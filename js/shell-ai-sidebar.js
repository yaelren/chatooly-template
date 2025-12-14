/**
 * Chatooly Shell AI Sidebar - Persistent Chat Interface
 *
 * This is the AI sidebar that lives in the shell (parent container).
 * Key difference from ai-sidebar.js: refreshes the IFRAME, not the page.
 *
 * WebSocket connection and chat history persist across tool refreshes.
 */

(function() {
  'use strict';

  // Configuration
  const WS_URL = `ws://${window.location.hostname}:3001/ws`;
  const RECONNECT_DELAY = 3000;
  const MAX_RECONNECT_ATTEMPTS = 5;
  const AUTO_REFRESH_DELAY = 1500;

  // BroadcastChannel for iframe communication
  const ipcChannel = new BroadcastChannel('chatooly-ipc');

  // DOM Elements
  const statusEl = document.getElementById('ai-status');
  const messagesEl = document.getElementById('ai-messages');
  const inputEl = document.getElementById('ai-input');
  const sendBtn = document.getElementById('ai-send');
  const clearBtn = document.getElementById('ai-clear');
  const toggleBtn = document.getElementById('ai-sidebar-toggle');
  const shellContainer = document.getElementById('shell-container');
  const toolFrame = document.getElementById('tool-frame');
  const loadingOverlay = document.getElementById('tool-loading-overlay');

  // State
  let socket = null;
  let reconnectAttempts = 0;
  let isConnected = false;
  let isThinking = false;
  let changedFilesInTask = new Set(); // Track files changed during agent execution

  /**
   * Initialize the AI sidebar
   */
  function init() {
    if (!statusEl || !messagesEl || !inputEl || !sendBtn) {
      console.warn('Shell AI Sidebar: Required elements not found');
      return;
    }

    // Connect to WebSocket
    connect();

    // Setup event listeners
    setupEventListeners();

    // Setup IPC listeners
    setupIPCListeners();

    console.log('🤖 Shell AI Sidebar initialized (iframe mode)');
  }

  /**
   * Connect to WebSocket server
   */
  function connect() {
    try {
      socket = new WebSocket(WS_URL);

      socket.onopen = handleOpen;
      socket.onclose = handleClose;
      socket.onerror = handleError;
      socket.onmessage = handleMessage;
    } catch (error) {
      console.error('WebSocket connection error:', error);
      scheduleReconnect();
    }
  }

  /**
   * Handle WebSocket open event
   */
  function handleOpen() {
    console.log('🔌 Connected to AI server');
    isConnected = true;
    reconnectAttempts = 0;
    updateStatus('connected', 'Connected');
    sendBtn.disabled = false;
  }

  /**
   * Handle WebSocket close event
   */
  function handleClose() {
    console.log('🔌 Disconnected from AI server');
    isConnected = false;
    updateStatus('disconnected', 'Disconnected');
    sendBtn.disabled = true;
    scheduleReconnect();
  }

  /**
   * Handle WebSocket error event
   */
  function handleError(error) {
    console.error('WebSocket error:', error);
    updateStatus('disconnected', 'Error');
  }

  /**
   * Handle incoming WebSocket messages
   */
  function handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      console.log('📨 Received:', data.type);

      switch (data.type) {
        case 'connected':
          if (!data.hasApiKey) {
            addMessage('system', '⚠️ API key not configured. Add your ANTHROPIC_API_KEY to the .env file and restart the server.');
          }
          break;

        case 'thinking':
          isThinking = true;
          updateStatus('thinking', 'Thinking...');
          break;

        case 'assistant':
          isThinking = false;
          updateStatus('connected', 'Connected');
          addMessage('assistant', data.content);
          break;

        case 'tool_use':
          // Show loading overlay when agent is editing files
          if (loadingOverlay && (data.tool === 'Edit' || data.tool === 'Write' || data.tool === 'MultiEdit')) {
            loadingOverlay.style.display = 'flex';
          }
          addMessage('tool-use', `🔧 Using: ${data.tool}`);
          break;

        case 'result':
          isThinking = false;
          updateStatus('connected', 'Connected');

          // Hide loading overlay
          if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
          }

          if (data.subtype === 'success') {
            addMessage('system', `✅ Task completed (${data.num_turns} turns, $${data.total_cost_usd?.toFixed(4) || '0.00'})`);

            // Only auto-refresh if HTML was changed during this task
            const htmlChanged = Array.from(changedFilesInTask).some(f => f.endsWith('.html'));
            if (htmlChanged) {
              scheduleAutoRefresh();
            }
            changedFilesInTask.clear(); // Reset for next task
          } else {
            addMessage('error', `❌ ${data.subtype}: ${data.errors?.join(', ') || 'Unknown error'}`);
            changedFilesInTask.clear(); // Reset on error too
          }
          break;

        case 'system':
          if (data.subtype === 'init') {
            addMessage('system', `🚀 Agent initialized with ${data.tools?.length || 0} tools`);
          }
          break;

        case 'error':
          isThinking = false;
          updateStatus('connected', 'Connected');
          // Hide loading overlay on error
          if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
          }
          changedFilesInTask.clear();
          addMessage('error', data.message);
          break;

        case 'file-changed':
          changedFilesInTask.add(data.file); // Track changed files
          handleFileChange(data);
          break;

        case 'pong':
          // Heartbeat response
          break;

        case 'cancelled':
          isThinking = false;
          updateStatus('connected', 'Connected');
          // Hide loading overlay on cancellation
          if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
          }
          changedFilesInTask.clear();
          addMessage('system', '🛑 ' + data.message);
          break;

        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }

  /**
   * Handle file change events - forward to iframe
   */
  function handleFileChange(data) {
    const { file, eventType } = data;
    console.log(`📝 File ${eventType}: ${file}`);

    // Forward file change to iframe via BroadcastChannel
    ipcChannel.postMessage({
      type: 'file-changed',
      file,
      eventType
    });

    // For HTML changes (index.html), refresh the iframe
    if (file.endsWith('.html') && file.includes('index')) {
      addMessage('system', `📄 HTML changed - refreshing tool...`);
      refreshToolFrame();
    }
  }

  /**
   * Schedule an automatic refresh of the TOOL IFRAME (not parent page!)
   * This is the KEY DIFFERENCE from the original ai-sidebar.js
   */
  function scheduleAutoRefresh() {
    addMessage('system', `🔄 Refreshing tool in ${AUTO_REFRESH_DELAY / 1000}s...`);
    updateStatus('thinking', 'Refreshing...');

    setTimeout(() => {
      refreshToolFrame();
      updateStatus('connected', 'Connected');
      addMessage('system', '✨ Tool refreshed - chat preserved!');
    }, AUTO_REFRESH_DELAY);
  }

  /**
   * Refresh the tool iframe
   */
  function refreshToolFrame() {
    if (toolFrame) {
      // Method 1: Reload iframe by resetting src
      toolFrame.src = toolFrame.src;

      // Alternative: Use BroadcastChannel to tell iframe to reload itself
      // ipcChannel.postMessage({ type: 'refresh-tool' });
    }
  }

  /**
   * Setup IPC listeners for messages from the iframe
   */
  function setupIPCListeners() {
    ipcChannel.onmessage = (event) => {
      const { type, data } = event.data;

      switch (type) {
        case 'tool-ready':
          console.log('📱 Tool iframe loaded');
          break;

        case 'tool-error':
          addMessage('error', `Tool error: ${data?.message || 'Unknown error'}`);
          break;

        default:
          console.log('IPC message:', type, data);
      }
    };
  }

  /**
   * Schedule a reconnection attempt
   */
  function scheduleReconnect() {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      addMessage('error', '❌ Could not connect to server. Please ensure the server is running (npm start)');
      return;
    }

    reconnectAttempts++;
    const delay = RECONNECT_DELAY * reconnectAttempts;

    console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);

    setTimeout(() => {
      if (!isConnected) {
        connect();
      }
    }, delay);
  }

  /**
   * Update the status indicator
   */
  function updateStatus(state, text) {
    statusEl.className = `ai-status ${state}`;
    statusEl.textContent = text;
  }

  /**
   * Add a message to the chat
   */
  function addMessage(type, content) {
    // Remove welcome message if present
    const welcome = messagesEl.querySelector('.ai-welcome');
    if (welcome) {
      welcome.remove();
    }

    const messageEl = document.createElement('div');
    messageEl.className = `ai-message ${type}`;

    // Format content (handle markdown-like formatting)
    messageEl.innerHTML = formatContent(content);

    messagesEl.appendChild(messageEl);

    // Scroll to bottom
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  /**
   * Format message content with basic markdown support
   */
  function formatContent(content) {
    if (!content) return '';

    // Escape HTML
    let formatted = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks
    formatted = formatted.replace(/```(\w*)\n?([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre><code class="${lang}">${code.trim()}</code></pre>`;
    });

    // Inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Line breaks
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
  }

  /**
   * Send a message to the agent
   */
  function sendMessage() {
    const text = inputEl.value.trim();

    if (!text || !isConnected || isThinking) {
      return;
    }

    // Add user message to chat
    addMessage('user', text);

    // Send to server
    socket.send(JSON.stringify({
      type: 'chat',
      prompt: text
    }));

    // Clear input
    inputEl.value = '';
    inputEl.focus();
  }

  /**
   * Clear the conversation
   */
  function clearConversation() {
    // Reset messages area
    messagesEl.innerHTML = `
      <div class="ai-welcome">
        <h4>Welcome to Chatooly AI</h4>
        <p>Describe the tool you want to build, and I'll create it for you following all Chatooly conventions.</p>
        <p style="margin-top: 12px; font-size: 11px;">Examples:<br>
        "Create a gradient generator"<br>
        "Build a mandala pattern tool"<br>
        "Make a color palette picker"</p>
      </div>
    `;

    inputEl.focus();
  }

  /**
   * Toggle sidebar visibility
   */
  function toggleSidebar() {
    if (shellContainer) {
      shellContainer.classList.toggle('ai-sidebar-collapsed');
      // Save state to localStorage
      const isCollapsed = shellContainer.classList.contains('ai-sidebar-collapsed');
      localStorage.setItem('ai-sidebar-collapsed', isCollapsed);
    }
  }

  /**
   * Restore sidebar state from localStorage
   */
  function restoreSidebarState() {
    const isCollapsed = localStorage.getItem('ai-sidebar-collapsed') === 'true';
    if (isCollapsed && shellContainer) {
      shellContainer.classList.add('ai-sidebar-collapsed');
    }
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Send button
    sendBtn.addEventListener('click', sendMessage);

    // Clear button
    clearBtn.addEventListener('click', clearConversation);

    // Toggle button
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleSidebar);
    }

    // Restore sidebar state
    restoreSidebarState();

    // Enter to send (Shift+Enter for new line)
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Enable/disable send button based on input
    inputEl.addEventListener('input', () => {
      sendBtn.disabled = !isConnected || !inputEl.value.trim();
    });

    // Heartbeat to keep connection alive
    setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging
  window.ShellAI = {
    connect,
    sendMessage,
    clearConversation,
    toggleSidebar,
    refreshToolFrame,
    isConnected: () => isConnected,
    isThinking: () => isThinking,
    ipcChannel
  };

})();
