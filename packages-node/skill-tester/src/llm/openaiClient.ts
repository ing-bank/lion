/**
 * Minimal, dependency-free OpenAI-compatible chat client.
 *
 * Uses the global `fetch` (Node >= 18) so the tester can talk to any OpenAI-compatible
 * `/chat/completions` endpoint: OpenAI, Azure OpenAI, Ollama, llama.cpp, vLLM, ...
 * No vendor SDK is required.
 */

import type { LlmConfig } from '../config.ts';

export type ToolCall = {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
};

export type ChatMessage =
  | { role: 'system'; content: string }
  | { role: 'user'; content: string }
  | { role: 'assistant'; content: string | null; tool_calls?: ToolCall[] }
  | { role: 'tool'; tool_call_id: string; content: string };

export type ToolDefinition = {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
};

export type ChatUsage = {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
};

export type ChatCompletionResult = {
  message: Extract<ChatMessage, { role: 'assistant' }>;
  usage?: ChatUsage;
  finishReason?: string;
};

export type ChatCompletionOptions = {
  config: LlmConfig;
  messages: ChatMessage[];
  tools?: ToolDefinition[];
  /**
   * Omitted by default. Several models (the GPT-5 family, some reasoning models) reject any
   * value other than their own default, so not sending it is the portable choice.
   */
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
};

/** Error carrying the HTTP status and (truncated) response body of a failed request. */
export class ChatCompletionError extends Error {
  status: number;
  body: string;

  constructor(status: number, body: string, url: string) {
    super(`Chat completion request to ${url} failed with HTTP ${status}: ${body.slice(0, 500)}`);
    this.name = 'ChatCompletionError';
    this.status = status;
    this.body = body;
  }
}

/**
 * Send a chat completion request and return the assistant message.
 * Retries transient failures (429, 5xx, network errors) with exponential backoff.
 */
export async function createChatCompletion({
  config,
  messages,
  tools,
  temperature,
  maxTokens,
  signal,
}: ChatCompletionOptions): Promise<ChatCompletionResult> {
  const url = `${config.baseUrl}/chat/completions`;
  const body: Record<string, unknown> = {
    model: config.model,
    messages,
  };
  // Only send temperature when explicitly asked for; see ChatCompletionOptions.temperature.
  if (typeof temperature === 'number') {
    body.temperature = temperature;
  }
  if (tools && tools.length > 0) {
    body.tools = tools;
    body.tool_choice = 'auto';
  }
  if (typeof maxTokens === 'number') {
    body.max_tokens = maxTokens;
  }

  const maxAttempts = 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
        },
        body: JSON.stringify(body),
        signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        // Retry only transient status codes.
        if ((response.status === 429 || response.status >= 500) && attempt < maxAttempts) {
          await delay(backoffMs(attempt));
          continue;
        }
        throw new ChatCompletionError(response.status, errorBody, url);
      }

      const json = (await response.json()) as {
        choices?: { message?: unknown; finish_reason?: string }[];
        usage?: ChatUsage;
      };

      const choice = json.choices?.[0];
      if (!choice?.message) {
        throw new Error(`Malformed response from ${url}: no choices[0].message (${JSON.stringify(json).slice(0, 300)})`);
      }

      return {
        message: normalizeAssistantMessage(choice.message),
        usage: json.usage,
        finishReason: choice.finish_reason,
      };
    } catch (error) {
      lastError = error;
      const isNetworkError = error instanceof TypeError;
      if (isNetworkError && attempt < maxAttempts) {
        await delay(backoffMs(attempt));
        continue;
      }
      throw error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

function normalizeAssistantMessage(message: unknown): Extract<ChatMessage, { role: 'assistant' }> {
  const raw = message as { content?: unknown; tool_calls?: ToolCall[] };
  const content = typeof raw.content === 'string' ? raw.content : null;
  return {
    role: 'assistant',
    content,
    ...(Array.isArray(raw.tool_calls) && raw.tool_calls.length > 0
      ? { tool_calls: raw.tool_calls }
      : {}),
  };
}

function backoffMs(attempt: number): number {
  return 500 * 2 ** (attempt - 1);
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
