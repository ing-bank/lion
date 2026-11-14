/**
 * Claude Code provider.
 *
 * Drives the locally installed `claude` CLI in non-interactive print mode with
 * `--output-format=stream-json`. That emits the whole agent loop as one JSON object per line:
 *
 *   { type: 'system',    subtype: 'init', tools: [...] }                      — session start + tool list
 *   { type: 'assistant', message: { content: [ { type: 'tool_use', name, input } | { type: 'text' } ] } }
 *   { type: 'user',      message: { content: [ { type: 'tool_result', tool_use_id, content, is_error } ] } }
 *   { type: 'result',    stop_reason, usage: {...}, total_cost_usd }
 *
 * Measured on Claude Code 2.1.322 before this file was written, so the shapes above are observed, not
 * assumed. Tool calls are re-emitted as `tool_call` events with their JSON arguments, which means the
 * harness's existing read accounting (skill reads vs dependency reads) works on this route unchanged -
 * the same signals the OpenAI-compatible route provides.
 *
 * Two honest differences remain, and they live in the ledger rather than in prose:
 *   - the agent brings its own system prompt and plan, and the skill is appended to it, so this measures
 *     "an agent with the skill", not "a model with the skill";
 *   - authentication is whatever the CLI has (typically a subscription), so `total_cost_usd` is the
 *     CLI's NOTIONAL API cost, not what the subscription pays.
 */

import { spawn, spawnSync } from 'node:child_process';
import type { AgentEvent, AgentRunResult } from './agentRunner.ts';
import type { ChatMessage, ChatUsage } from './openaiClient.ts';
import type { LlmConfig } from '../config.ts';

export type ClaudeCodeOptions = {
  llmConfig: LlmConfig;
  systemPrompt: string;
  userPrompt: string;
  sandboxRoot: string;
  timeoutMs?: number;
  onEvent?: (event: AgentEvent) => void;
};

function claudeBinary(): string {
  return process.env.SKILL_TESTER_CLAUDE_BIN || 'claude';
}

/**
 * True when a `claude` CLI answers. `shell` only on Windows, where the launcher is a `.cmd` shim that
 * cannot be spawned directly (the same reason the web-test-runner binary is resolved per platform).
 */
export function isClaudeCodeAvailable(): boolean {
  try {
    const probe = spawnSync(claudeBinary(), ['--version'], {
      encoding: 'utf8',
      timeout: 20_000,
      shell: process.platform === 'win32',
    });
    return probe.status === 0;
  } catch {
    return false;
  }
}

type StreamEvent = {
  type?: string;
  subtype?: string;
  message?: { content?: Array<Record<string, unknown>> };
  stop_reason?: string;
  total_cost_usd?: number;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };
};

/** Tool blocks the CLI emits, reduced to what this runner needs. */
function toolUses(event: StreamEvent): Array<{ id: string; name: string; input: unknown }> {
  const blocks = event.message?.content ?? [];
  return blocks
    .filter(block => block.type === 'tool_use')
    .map(block => ({
      id: String(block.id ?? ''),
      name: String(block.name ?? 'unknown'),
      input: block.input,
    }));
}

function toolResults(event: StreamEvent): Array<{ id: string; text: string; failed: boolean }> {
  const blocks = event.message?.content ?? [];
  return blocks
    .filter(block => block.type === 'tool_result')
    .map(block => {
      const content = block.content;
      const text =
        typeof content === 'string'
          ? content
          : Array.isArray(content)
            ? content
                .map(part =>
                  typeof part === 'object' && part !== null && 'text' in part
                    ? String((part as { text: unknown }).text)
                    : '',
                )
                .join(' ')
            : '';
      return { id: String(block.tool_use_id ?? ''), text, failed: Boolean(block.is_error) };
    });
}

function textOf(event: StreamEvent): string {
  const blocks = event.message?.content ?? [];
  return blocks
    .filter(block => block.type === 'text')
    .map(block => String(block.text ?? ''))
    .join('\n')
    .trim();
}

function stringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function runClaudeCodeAgent({
  llmConfig,
  systemPrompt,
  userPrompt,
  sandboxRoot,
  timeoutMs = 15 * 60 * 1000,
  onEvent,
}: ClaudeCodeOptions): Promise<AgentRunResult> {
  const args = [
    '-p',
    '--output-format',
    'stream-json',
    '--verbose',
    '--model',
    llmConfig.model,
    // The CLI keeps its own system prompt and appends ours, which is exactly the difference this provider
    // exists to measure (see the file comment).
    '--append-system-prompt',
    systemPrompt,
    // Print mode still asks before some tools; acceptEdits keeps a sandboxed file write from stalling a run.
    '--permission-mode',
    'acceptEdits',
    userPrompt,
  ];

  return new Promise<AgentRunResult>((resolve, reject) => {
    const child = spawn(claudeBinary(), args, {
      cwd: sandboxRoot,
      env: { ...process.env },
      shell: process.platform === 'win32',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const usage: ChatUsage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
    const toolNamesById = new Map<string, string>();
    let turns = 0;
    let toolCalls = 0;
    let finalMessage = '';
    let stopReason: AgentRunResult['stopReason'] = 'completed';
    let stderr = '';
    let buffer = '';
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        child.kill('SIGKILL');
        reject(new Error(`the claude CLI did not finish within ${timeoutMs}ms`));
      }
    }, timeoutMs);

    const handleLine = (line: string) => {
      const trimmed = line.trim();
      if (!trimmed.startsWith('{')) return;
      let event: StreamEvent;
      try {
        event = JSON.parse(trimmed) as StreamEvent;
      } catch {
        return;
      }

      if (event.type === 'assistant') {
        turns++;
        for (const use of toolUses(event)) {
          toolCalls++;
          toolNamesById.set(use.id, use.name);
          onEvent?.({ type: 'tool_call', name: use.name, arguments: stringify(use.input) });
        }
        const text = textOf(event);
        if (text) {
          finalMessage = text;
          onEvent?.({ type: 'assistant_message', content: text });
        }
      } else if (event.type === 'user') {
        for (const result of toolResults(event)) {
          onEvent?.({
            type: 'tool_result',
            name: toolNamesById.get(result.id) ?? 'unknown',
            // The "Error" prefix matches the other providers, so avoidable retries are counted the same way.
            result: result.failed ? `Error: ${result.text || 'tool call failed'}` : 'ok',
          });
        }
      } else if (event.type === 'result') {
        if (event.stop_reason === 'max_turns') stopReason = 'max_turns';
        const u = event.usage ?? {};
        usage.prompt_tokens =
          (u.input_tokens ?? 0) +
          (u.cache_creation_input_tokens ?? 0) +
          (u.cache_read_input_tokens ?? 0);
        usage.completion_tokens = u.output_tokens ?? 0;
      }
    };

    child.stdout?.setEncoding('utf8');
    child.stdout?.on('data', (chunk: string) => {
      buffer += chunk;
      let index = buffer.indexOf('\n');
      while (index >= 0) {
        handleLine(buffer.slice(0, index));
        buffer = buffer.slice(index + 1);
        index = buffer.indexOf('\n');
      }
    });
    child.stderr?.setEncoding('utf8');
    child.stderr?.on('data', (chunk: string) => {
      stderr += chunk;
    });

    child.on('error', error => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        reject(
          new Error(
            `could not start the claude CLI ("${claudeBinary()}"): ${error.message}. ` +
              `Install it, or point SKILL_TESTER_CLAUDE_BIN at it.`,
          ),
        );
      }
    });

    child.on('close', code => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (buffer.trim()) handleLine(buffer);

      if (code !== 0 && turns === 0 && toolCalls === 0) {
        reject(
          new Error(
            `the claude CLI exited with code ${code} without doing anything: ${stderr.trim().slice(0, 400)}`,
          ),
        );
        return;
      }

      usage.total_tokens = (usage.prompt_tokens ?? 0) + (usage.completion_tokens ?? 0);
      onEvent?.({ type: 'finished', reason: stopReason });

      const transcript: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
        ...(finalMessage ? [{ role: 'assistant' as const, content: finalMessage }] : []),
      ];

      resolve({
        transcript,
        turns,
        toolCalls,
        usage,
        // A CLI that exits cleanly counts as finished; the scorer reads the produced files, not this flag.
        finished: code === 0,
        stopReason,
        finalMessage,
      });
    });
  });
}
