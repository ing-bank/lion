/**
 * GitHub Copilot provider.
 *
 * Kept as an alternative to the OpenAI-compatible runner so a skill can still be evaluated with
 * the Copilot CLI/agent it was originally authored against. The `@github/copilot-sdk` dependency
 * is optional and loaded lazily: installs that only use the OpenAI-compatible path never need it.
 *
 * Returns the same `AgentRunResult` shape as `llm/agentRunner.ts`, so the orchestrator and the
 * scorer are provider-agnostic.
 */

import type { AgentEvent, AgentRunResult } from './agentRunner.ts';
import type { ChatMessage, ChatUsage } from './openaiClient.ts';
import type { LlmConfig } from '../config.ts';

// Minimal structural types for the optional SDK, so this module type-checks without the package
// installed. The real shapes are validated by the SDK's own types when it is present.
type CopilotToolResult = { resultType?: string; textResultForLlm?: string };
type CopilotSessionEvent = {
  type: string;
  data?: { content?: string; inputTokens?: number; outputTokens?: number };
};
type CopilotHookInput = { toolName?: string; toolArgs?: unknown; toolResult?: CopilotToolResult };

type CopilotSession = {
  on(handler: (event: CopilotSessionEvent) => void): unknown;
  sendAndWait(options: { prompt: string }, timeout?: number): Promise<unknown>;
  disconnect(): Promise<void>;
};

type CopilotClientInstance = {
  start(): Promise<void>;
  stop(): Promise<unknown>;
  createSession(config: Record<string, unknown>): Promise<CopilotSession>;
};

type CopilotSdkModule = {
  CopilotClient: new (options: { cwd: string }) => CopilotClientInstance;
  approveAll: unknown;
};

const COPILOT_SDK_PACKAGE = '@github/copilot-sdk';

export type CopilotAgentOptions = {
  llmConfig: LlmConfig;
  systemPrompt: string;
  userPrompt: string;
  sandboxRoot: string;
  /** Name the custom agent is registered under (and selected with). */
  agentName?: string;
  /** Copilot tool names the agent may use. Omit for all tools (the SDK default). */
  tools?: string[];
  /** How long to wait for the session to become idle, in milliseconds. */
  timeoutMs?: number;
  onEvent?: (event: AgentEvent) => void;
};

/** True when the optional Copilot SDK can be resolved from the current installation. */
export async function isCopilotSdkAvailable(): Promise<boolean> {
  try {
    await loadCopilotSdk();
    return true;
  } catch {
    return false;
  }
}

async function loadCopilotSdk(): Promise<CopilotSdkModule> {
  try {
    // Non-literal specifier keeps TypeScript from requiring the optional package at compile time.
    const specifier = COPILOT_SDK_PACKAGE;
    return (await import(specifier)) as CopilotSdkModule;
  } catch (error) {
    throw new Error(
      `The "copilot" provider requires the optional dependency ${COPILOT_SDK_PACKAGE}, ` +
        `which is not installed.\nInstall it with:  npm install ${COPILOT_SDK_PACKAGE}\n` +
        `(or use --provider openai with an OpenAI-compatible endpoint instead)\n` +
        `Original error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function stringifyArgs(args: unknown): string {
  try {
    return JSON.stringify(args);
  } catch {
    return String(args);
  }
}

export async function runCopilotAgent({
  llmConfig,
  systemPrompt,
  userPrompt,
  sandboxRoot,
  agentName = 'skill-under-test',
  tools,
  timeoutMs,
  onEvent,
}: CopilotAgentOptions): Promise<AgentRunResult> {
  const sdk = await loadCopilotSdk();

  const usage: ChatUsage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
  let turns = 0;
  let toolCalls = 0;
  let lastContent = '';

  const client = new sdk.CopilotClient({ cwd: sandboxRoot });
  await client.start();

  try {
    const session = await client.createSession({
      model: llmConfig.model,
      onPermissionRequest: sdk.approveAll,
      customAgents: [
        {
          name: agentName,
          displayName: agentName,
          prompt: systemPrompt,
          // `tools: undefined` means "all tools" to the SDK, so only pass it when we have a list.
          ...(tools && tools.length > 0 ? { tools } : {}),
        },
      ],
      agent: agentName,
      hooks: {
        onPreToolUse: (input: CopilotHookInput) => {
          toolCalls++;
          onEvent?.({
            type: 'tool_call',
            name: String(input?.toolName ?? 'unknown'),
            arguments: stringifyArgs(input?.toolArgs),
          });
        },
        onPostToolUse: (input: CopilotHookInput) => {
          const result = input?.toolResult ?? {};
          const failed = result.resultType === 'failure';
          onEvent?.({
            type: 'tool_result',
            name: String(input?.toolName ?? 'unknown'),
            // The "Error" prefix matches how the OpenAI-compatible runner reports tool failures,
            // so the orchestrator counts avoidable retries the same way for both providers.
            result: failed ? `Error: ${result.textResultForLlm ?? 'tool call failed'}` : 'ok',
          });
        },
      },
    });

    session.on(event => {
      if (event.type === 'assistant.message') {
        turns++;
        lastContent = event.data?.content ?? '';
        if (lastContent.trim()) {
          onEvent?.({ type: 'assistant_message', content: lastContent });
        }
      } else if (event.type === 'assistant.usage') {
        usage.prompt_tokens = (usage.prompt_tokens ?? 0) + (event.data?.inputTokens ?? 0);
        usage.completion_tokens = (usage.completion_tokens ?? 0) + (event.data?.outputTokens ?? 0);
      }
    });

    await session.sendAndWait({ prompt: userPrompt }, timeoutMs);
    await session.disconnect();
  } finally {
    await client.stop();
  }

  usage.total_tokens = (usage.prompt_tokens ?? 0) + (usage.completion_tokens ?? 0);
  onEvent?.({ type: 'finished', reason: 'completed' });

  const transcript: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
    ...(lastContent ? [{ role: 'assistant' as const, content: lastContent }] : []),
  ];

  return {
    transcript,
    turns,
    toolCalls,
    usage,
    finished: true,
    stopReason: 'completed',
  };
}
