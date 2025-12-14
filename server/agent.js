/**
 * Chatooly AI Tool Builder - Agent Configuration
 *
 * Sets up the Claude Agent SDK with:
 * - Condensed Chatooly system prompt
 * - Custom MCP tools for rule fetching and validation
 * - Full file system access for tool building
 */

import { query, tool, createSdkMcpServer } from '@anthropic-ai/claude-agent-sdk';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';

// Rule file mapping
const RULE_FILES = {
  'core-rules': '01-core-rules.md',
  'workflow-setup': '02-workflow-setup.md',
  'canvas-resize': '03-canvas-resize.md',
  'high-res-export': '04-high-res-export.md',
  'library-selection': '05-library-selection.md',
  'design-system': '06-design-system.md',
  'publishing': '07-publishing-troubleshooting.md',
  'background-system': '08-background-system.md'
};

/**
 * Load the condensed system prompt
 */
function loadSystemPrompt(projectRoot) {
  const promptPath = join(projectRoot, 'server', 'system-prompt.md');
  if (existsSync(promptPath)) {
    return readFileSync(promptPath, 'utf-8');
  }

  // Fallback condensed prompt if file doesn't exist
  return `# Chatooly Tool Builder Agent

You build interactive visual tools for the Chatooly platform.

## CRITICAL RULES (Never Break These)
1. Canvas MUST have id="chatooly-canvas"
2. NEVER modify CDN scripts or create export buttons
3. ALL visual content inside #chatooly-canvas
4. Use chatooly-* CSS classes (auto-styled by CDN)
5. Implement window.renderHighResolution(targetCanvas, scale) for exports
6. Connect background controls to Chatooly.backgroundManager

## File Responsibilities
- js/main.js: Canvas rendering, tool logic, animations, exports
- js/ui.js: UI interactions, control event listeners
- js/chatooly-config.js: Tool metadata only
- index.html: Add control sections using chatooly-section-card pattern

## On-Demand Rules
Use the read_chatooly_rule tool to fetch detailed instructions when needed.

## Workflow
1. Ask clarifying questions about the tool
2. Plan the implementation
3. Fetch relevant rule files for details
4. Implement in small, testable steps
5. Validate using validate_chatooly_tool after major changes`;
}

/**
 * Create custom MCP tools for Chatooly-specific operations
 */
function createChatoolyTools(projectRoot) {
  const readRuleTool = tool(
    'read_chatooly_rule',
    'Fetch detailed Chatooly rule documentation. Use this to get specific implementation details for canvas resize, exports, library setup, background system, or design system.',
    {
      ruleName: z.enum([
        'core-rules',
        'workflow-setup',
        'canvas-resize',
        'high-res-export',
        'library-selection',
        'design-system',
        'publishing',
        'background-system'
      ]).describe('The name of the rule file to read')
    },
    async ({ ruleName }) => {
      const fileName = RULE_FILES[ruleName];
      const filePath = join(projectRoot, 'claude-rules', fileName);

      if (!existsSync(filePath)) {
        return {
          content: [{ type: 'text', text: `Rule file not found: ${fileName}` }],
          isError: true
        };
      }

      const content = readFileSync(filePath, 'utf-8');
      return {
        content: [{ type: 'text', text: content }]
      };
    }
  );

  const validateTool = tool(
    'validate_chatooly_tool',
    'Validate the current tool implementation against Chatooly requirements. Run this after making significant changes to verify compliance.',
    {},
    async () => {
      const checks = [];

      // Check index.html
      const htmlPath = join(projectRoot, 'index.html');
      if (existsSync(htmlPath)) {
        const html = readFileSync(htmlPath, 'utf-8');

        checks.push({
          name: 'Canvas has id="chatooly-canvas"',
          pass: html.includes('id="chatooly-canvas"'),
          file: 'index.html'
        });

        checks.push({
          name: 'CDN script intact',
          pass: html.includes('chatooly-cdn/js/core.min.js'),
          file: 'index.html'
        });

        checks.push({
          name: 'Uses chatooly-section-card pattern',
          pass: html.includes('chatooly-section-card'),
          file: 'index.html'
        });

        checks.push({
          name: 'Background controls present',
          pass: html.includes('transparent-bg') && html.includes('bg-color'),
          file: 'index.html'
        });
      } else {
        checks.push({ name: 'index.html exists', pass: false, file: 'index.html' });
      }

      // Check main.js
      const mainJsPath = join(projectRoot, 'js', 'main.js');
      if (existsSync(mainJsPath)) {
        const js = readFileSync(mainJsPath, 'utf-8');

        checks.push({
          name: 'High-res export function defined',
          pass: js.includes('renderHighResolution'),
          file: 'js/main.js'
        });

        checks.push({
          name: 'Background manager initialized',
          pass: js.includes('backgroundManager'),
          file: 'js/main.js'
        });

        checks.push({
          name: 'Canvas dimensions set',
          pass: js.includes('canvas.width') && js.includes('canvas.height'),
          file: 'js/main.js'
        });
      }

      // Format results
      const passed = checks.filter(c => c.pass).length;
      const total = checks.length;
      const status = passed === total ? '✅ ALL CHECKS PASSED' : `⚠️ ${passed}/${total} checks passed`;

      const result = [
        `# Chatooly Validation Results`,
        ``,
        `**Status:** ${status}`,
        ``,
        `## Checks:`,
        ...checks.map(c => `- ${c.pass ? '✅' : '❌'} ${c.name} (${c.file})`)
      ].join('\n');

      return {
        content: [{ type: 'text', text: result }]
      };
    }
  );

  return createSdkMcpServer({
    name: 'chatooly-tools',
    version: '1.0.0',
    tools: [readRuleTool, validateTool]
  });
}

/**
 * Create a new agent session
 */
export async function createAgent(projectRoot) {
  const systemPrompt = loadSystemPrompt(projectRoot);
  const chatoolyMcp = createChatoolyTools(projectRoot);

  const abortController = new AbortController();

  return {
    projectRoot,
    systemPrompt,
    chatoolyMcp,
    abortController,
    sessionId: null, // Will be set after first query
    options: {
      systemPrompt: {
        type: 'preset',
        preset: 'claude_code',
        append: systemPrompt
      },
      settingSources: ['project'],
      cwd: projectRoot,
      allowedTools: [
        'Read', 'Write', 'Edit', 'Glob', 'Grep', 'Bash',
        'mcp__chatooly-tools__read_chatooly_rule',
        'mcp__chatooly-tools__validate_chatooly_tool'
      ],
      permissionMode: 'acceptEdits',
      mcpServers: {
        'chatooly-tools': chatoolyMcp
      },
      abortController,
      maxTurns: 50,
      model: 'claude-sonnet-4-20250514'
    }
  };
}

/**
 * Handle a message to the agent and stream responses
 */
export async function handleAgentMessage(agent, prompt, onEvent) {
  try {
    // Build query options - use resume if we have a session ID
    const queryOptions = { ...agent.options };
    if (agent.sessionId) {
      queryOptions.resume = agent.sessionId;
      console.log(`📝 Resuming session: ${agent.sessionId}`);
    }

    const queryGenerator = query({
      prompt,
      options: queryOptions
    });

    for await (const message of queryGenerator) {
      switch (message.type) {
        case 'assistant':
          // Extract text content from assistant message
          const textContent = message.message.content
            .filter(block => block.type === 'text')
            .map(block => block.text)
            .join('\n');

          if (textContent) {
            onEvent({
              type: 'assistant',
              content: textContent,
              uuid: message.uuid
            });
          }

          // Check for tool use
          const toolUses = message.message.content.filter(block => block.type === 'tool_use');
          for (const toolUse of toolUses) {
            onEvent({
              type: 'tool_use',
              tool: toolUse.name,
              input: toolUse.input
            });
          }
          break;

        case 'result':
          onEvent({
            type: 'result',
            subtype: message.subtype,
            result: message.result,
            duration_ms: message.duration_ms,
            total_cost_usd: message.total_cost_usd,
            num_turns: message.num_turns
          });
          break;

        case 'system':
          if (message.subtype === 'init') {
            // Capture session ID for future resumption
            if (message.session_id && !agent.sessionId) {
              agent.sessionId = message.session_id;
              console.log(`🆔 Session ID captured: ${agent.sessionId}`);
            }

            // Only send init event for NEW sessions (not resumed ones)
            if (!queryOptions.resume) {
              onEvent({
                type: 'system',
                subtype: 'init',
                tools: message.tools,
                model: message.model,
                session_id: message.session_id
              });
            }
          }
          break;
      }
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      onEvent({
        type: 'cancelled',
        message: 'Agent session was cancelled'
      });
    } else {
      throw error;
    }
  }
}
