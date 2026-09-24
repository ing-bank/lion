/**
 * Minimal mock of an OpenAI-compatible `/chat/completions` endpoint, used to exercise the
 * agent loop end to end without network access or API credentials.
 */

import http from 'node:http';
import type { AddressInfo } from 'node:net';

export type MockAssistantMessage = {
  role: 'assistant';
  content: string | null;
  tool_calls?: { id: string; type: 'function'; function: { name: string; arguments: string } }[];
};

export type MockResponse = {
  message: MockAssistantMessage;
  finish_reason?: string;
};

export type RecordedRequest = {
  path: string;
  authorization?: string;
  body: {
    model: string;
    messages: unknown[];
    tools?: unknown[];
    tool_choice?: string;
  };
};

export type MockOpenAiServer = {
  /** Base URL including the `/v1` prefix, ready to pass as `baseUrl`. */
  baseUrl: string;
  requests: RecordedRequest[];
  close: () => Promise<void>;
};

/**
 * @param responses scripted responses, consumed in order (the last one repeats).
 */
export async function startMockOpenAiServer(responses: MockResponse[]): Promise<MockOpenAiServer> {
  const requests: RecordedRequest[] = [];
  const server = http.createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on('data', chunk => chunks.push(chunk as Buffer));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf-8');
      const body = raw ? JSON.parse(raw) : {};
      requests.push({ path: req.url ?? '', authorization: req.headers.authorization, body });

      const scripted = responses[Math.min(requests.length - 1, responses.length - 1)] ?? {
        message: { role: 'assistant', content: 'done' },
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          id: 'mock',
          object: 'chat.completion',
          model: body.model,
          choices: [
            {
              index: 0,
              message: scripted.message,
              finish_reason: scripted.finish_reason ?? (scripted.message.tool_calls ? 'tool_calls' : 'stop'),
            },
          ],
          usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        }),
      );
    });
  });

  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;

  return {
    baseUrl: `http://127.0.0.1:${port}/v1`,
    requests,
    close: () =>
      new Promise<void>((resolve, reject) =>
        server.close(error => (error ? reject(error) : resolve())),
      ),
  };
}

/** Build a scripted `write_file` tool call. */
export function writeFileToolCall(path: string, content: string, id = 'call_1'): MockAssistantMessage {
  return {
    role: 'assistant',
    content: null,
    tool_calls: [
      { id, type: 'function', function: { name: 'write_file', arguments: JSON.stringify({ path, content }) } },
    ],
  };
}
