/**
 * Provider-agnostic agent loop.
 *
 * Drives an OpenAI-compatible model with file tools until it stops requesting tools (or the
 * turn budget is exhausted). This is the Copilot-free replacement for the proprietary
 * `CopilotClient`/`createSession` workflow: the skill definition becomes the system prompt and
 * the model edits files in a sandbox through `createFileToolset`.
 */

import { createFileToolset } from './tools.ts';
import { createChatCompletion, type ChatMessage, type ChatUsage } from './openaiClient.ts';
import type { LlmConfig } from '../config.ts';

export type AgentEvent =
  | { type: 'assistant_message'; content: string }
  | { type: 'tool_call'; name: string; arguments: string }
  | { type: 'tool_result'; name: string; result: string }
  | { type: 'finished'; reason: 'completed' | 'max_turns' };

export type AgentRunOptions = {
  llmConfig: LlmConfig;
  systemPrompt: string;
  userPrompt: string;
  sandboxRoot: string;
  /** Upper bound on model round-trips (each may contain several tool calls). */
  maxTurns?: number;
  onEvent?: (event: AgentEvent) => void;
};

export type AgentRunResult = {
  transcript: ChatMessage[];
  turns: number;
  toolCalls: number;
  usage: ChatUsage;
  finished: boolean;
  stopReason: 'completed' | 'max_turns';
};

export async function runAgent({
  llmConfig,
  systemPrompt,
  userPrompt,
  sandboxRoot,
  maxTurns = 25,
  onEvent,
}: AgentRunOptions): Promise<AgentRunResult> {
  const toolset = createFileToolset(sandboxRoot);
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const usage: ChatUsage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
  let toolCalls = 0;
  let turns = 0;
  let stopReason: AgentRunResult['stopReason'] = 'max_turns';

  for (let turn = 1; turn <= maxTurns; turn++) {
    turns = turn;
    const { message, usage: turnUsage } = await createChatCompletion({
      config: llmConfig,
      messages,
      tools: toolset.definitions,
    });
    accumulateUsage(usage, turnUsage);
    messages.push(message);

    if (message.content) {
      onEvent?.({ type: 'assistant_message', content: message.content });
    }

    const pendingToolCalls = message.tool_calls ?? [];
    if (pendingToolCalls.length === 0) {
      stopReason = 'completed';
      break;
    }

    for (const toolCall of pendingToolCalls) {
      toolCalls++;
      onEvent?.({
        type: 'tool_call',
        name: toolCall.function.name,
        arguments: toolCall.function.arguments,
      });
      const result = await toolset.execute(toolCall.function.name, toolCall.function.arguments);
      onEvent?.({ type: 'tool_result', name: toolCall.function.name, result });
      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: result,
      });
    }
  }

  onEvent?.({ type: 'finished', reason: stopReason });

  return {
    transcript: messages,
    turns,
    toolCalls,
    usage,
    finished: stopReason === 'completed',
    stopReason,
  };
}

function accumulateUsage(target: ChatUsage, source: ChatUsage | undefined): void {
  if (!source) return;
  target.prompt_tokens = (target.prompt_tokens ?? 0) + (source.prompt_tokens ?? 0);
  target.completion_tokens = (target.completion_tokens ?? 0) + (source.completion_tokens ?? 0);
  target.total_tokens = (target.total_tokens ?? 0) + (source.total_tokens ?? 0);
}
