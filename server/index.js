/**
 * Chatooly AI Tool Builder - Server
 *
 * Express + WebSocket server that:
 * 1. Serves static files from project root
 * 2. Manages Claude Agent SDK sessions
 * 3. Broadcasts file changes for live updates
 */

import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

import { createAgent, handleAgentMessage } from './agent.js';
import { setupFileWatcher } from './file-watcher.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

const PORT = process.env.PORT || 3001;

// Express app setup
const app = express();
app.use(express.json());

// Default route serves shell.html (persistent AI sidebar container)
// MUST come before static middleware to override index.html default
app.get('/', (req, res) => {
  res.sendFile(join(PROJECT_ROOT, 'shell.html'));
});

// Serve static files from project root
// index: false prevents serving index.html for / (we handle that above)
app.use(express.static(PROJECT_ROOT, { index: false }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.ANTHROPIC_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Create HTTP server
const server = createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' });

// Track active connections and agent sessions
const clients = new Set();
const agentSessions = new Map();

wss.on('connection', (ws) => {
  console.log('🔌 Client connected');
  clients.add(ws);

  // Send connection confirmation
  ws.send(JSON.stringify({
    type: 'connected',
    message: 'Connected to Chatooly AI Server',
    hasApiKey: !!process.env.ANTHROPIC_API_KEY
  }));

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('📨 Received:', message.type);

      switch (message.type) {
        case 'chat':
          await handleChatMessage(ws, message);
          break;

        case 'cancel':
          cancelAgentSession(ws);
          break;

        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }));
          break;

        case 'reset':
          await resetToolToTemplate(ws);
          break;

        default:
          ws.send(JSON.stringify({
            type: 'error',
            message: `Unknown message type: ${message.type}`
          }));
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: error.message
      }));
    }
  });

  ws.on('close', () => {
    console.log('🔌 Client disconnected');
    clients.delete(ws);
    cancelAgentSession(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

/**
 * Handle incoming chat messages from the frontend
 */
async function handleChatMessage(ws, message) {
  const { prompt, sessionId } = message;

  if (!process.env.ANTHROPIC_API_KEY) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'ANTHROPIC_API_KEY not configured. Please add your API key to the .env file.'
    }));
    return;
  }

  try {
    // Reuse existing agent session if available, otherwise create new one
    let agent = agentSessions.get(ws);

    if (!agent) {
      // First message - create new agent
      ws.send(JSON.stringify({ type: 'thinking', message: 'Initializing agent...' }));
      agent = await createAgent(PROJECT_ROOT);
      agentSessions.set(ws, agent);
      console.log('🤖 New agent session created');
    } else {
      // Subsequent messages - reuse existing agent
      ws.send(JSON.stringify({ type: 'thinking', message: 'Agent is processing...' }));
      console.log('🤖 Reusing existing agent session');
    }

    // Process the message and stream responses
    await handleAgentMessage(agent, prompt, (event) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(event));
      }
    });

  } catch (error) {
    console.error('Agent error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: `Agent error: ${error.message}`
    }));
  }
}

/**
 * Cancel an active agent session
 */
function cancelAgentSession(ws) {
  const agent = agentSessions.get(ws);
  if (agent && agent.abortController) {
    agent.abortController.abort();
    agentSessions.delete(ws);
    console.log('🛑 Agent session cancelled');
  }
}

/**
 * Reset tool files to blank template state
 */
async function resetToolToTemplate(ws) {
  try {
    execSync('git checkout origin/main -- index.html js/main.js js/ui.js js/chatooly-config.js', {
      cwd: PROJECT_ROOT
    });
    ws.send(JSON.stringify({ type: 'reset-complete' }));
    // Broadcast file change to trigger iframe refresh
    broadcastFileChange('index.html', 'change');
    console.log('🔄 Tool reset to blank template');
  } catch (error) {
    console.error('Reset error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Reset failed: ' + error.message
    }));
  }
}

/**
 * Broadcast file changes to all connected clients
 */
function broadcastFileChange(file, eventType) {
  const message = JSON.stringify({
    type: 'file-changed',
    file: file.replace(PROJECT_ROOT, '').replace(/^[\/\\]/, ''),
    eventType
  });

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Setup file watcher for live updates
setupFileWatcher(PROJECT_ROOT, broadcastFileChange);

// Start server
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║          🤖 Chatooly AI Tool Builder Server                ║
╠════════════════════════════════════════════════════════════╣
║  🌐 Server:     http://localhost:${PORT}                      ║
║  🔌 WebSocket:  ws://localhost:${PORT}/ws                     ║
║  📁 Project:    ${PROJECT_ROOT}
╠════════════════════════════════════════════════════════════╣
║  API Key:       ${process.env.ANTHROPIC_API_KEY ? '✅ Configured' : '❌ Missing (add to .env)'}                       ║
╚════════════════════════════════════════════════════════════╝
  `);
});

export { app, server, wss };
