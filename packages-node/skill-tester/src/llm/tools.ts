/**
 * Sandbox-scoped file tools handed to the model via OpenAI-style tool calling.
 *
 * These replace the file/terminal tools a proprietary agent runtime would normally provide,
 * so the same skill/agent definition can be exercised against any OpenAI-compatible model.
 * Every path is resolved inside the sandbox root; escaping it raises an error.
 */

import fs from 'node:fs';
import path from 'node:path';
import fsGlob from '../fsGlob.ts';
import type { ToolDefinition } from './openaiClient.ts';

export type ToolImplementation = (args: Record<string, unknown>) => Promise<string>;

export type FileToolset = {
  definitions: ToolDefinition[];
  execute: (name: string, rawArguments: string) => Promise<string>;
};

const MAX_FILE_CHARS = 40_000;
const MAX_SEARCH_RESULTS = 100;

function asString(args: Record<string, unknown>, key: string, fallback?: string): string {
  const value = args[key];
  if (typeof value === 'string') return value;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required string argument "${key}"`);
}

/** Resolve `relativePath` inside `root`, refusing paths that escape the sandbox. */
export function resolveInSandbox(root: string, relativePath: string): string {
  const resolvedRoot = path.resolve(root);
  const resolved = path.resolve(resolvedRoot, relativePath);
  const relative = path.relative(resolvedRoot, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Path "${relativePath}" escapes the sandbox root`);
  }
  return resolved;
}

function toRelative(root: string, absolutePath: string): string {
  return path.relative(path.resolve(root), absolutePath).split(path.sep).join('/');
}

async function walkFiles(dir: string): Promise<string[]> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const results: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      results.push(...(await walkFiles(full)));
    } else if (entry.isFile()) {
      results.push(full);
    }
  }
  return results;
}

export function createFileToolset(sandboxRoot: string): FileToolset {
  const definitions: ToolDefinition[] = [
    {
      type: 'function',
      function: {
        name: 'read_file',
        description:
          'Read a UTF-8 text file from the project. Returns the file content with 1-based line numbers.',
        parameters: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Path relative to the project root.' },
            offset: { type: 'number', description: 'Optional 1-based first line to read.' },
            limit: { type: 'number', description: 'Optional maximum number of lines to read.' },
          },
          required: ['path'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'write_file',
        description: 'Create or overwrite a UTF-8 text file in the project.',
        parameters: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Path relative to the project root.' },
            content: { type: 'string', description: 'The full file content to write.' },
          },
          required: ['path', 'content'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'edit_file',
        description:
          'Replace an exact substring in an existing file. Fails when the substring is absent or ambiguous.',
        parameters: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Path relative to the project root.' },
            old_string: { type: 'string', description: 'The exact text to replace.' },
            new_string: { type: 'string', description: 'The replacement text.' },
            replace_all: {
              type: 'boolean',
              description: 'Replace every occurrence instead of requiring a unique match.',
            },
          },
          required: ['path', 'old_string', 'new_string'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'list_files',
        description: 'List the files and directories at a path in the project.',
        parameters: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Directory relative to the project root (default ".").' },
          },
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'glob',
        description: 'Find files by glob pattern, e.g. "src/**/*.js" or "**/*.md".',
        parameters: {
          type: 'object',
          properties: {
            pattern: { type: 'string', description: 'Glob pattern.' },
            path: { type: 'string', description: 'Directory to search in (default ".").' },
          },
          required: ['pattern'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'search_files',
        description: 'Search file contents with a regular expression. Returns matching lines.',
        parameters: {
          type: 'object',
          properties: {
            pattern: { type: 'string', description: 'JavaScript regular expression source.' },
            path: { type: 'string', description: 'Directory to search in (default ".").' },
          },
          required: ['pattern'],
        },
      },
    },
  ];

  const implementations: Record<string, ToolImplementation> = {
    read_file: async args => {
      const absolute = resolveInSandbox(sandboxRoot, asString(args, 'path'));
      const content = await fs.promises.readFile(absolute, 'utf-8');
      const lines = content.split('\n');
      const offset = typeof args.offset === 'number' ? Math.max(1, args.offset) : 1;
      const limit = typeof args.limit === 'number' ? args.limit : lines.length;
      const slice = lines.slice(offset - 1, offset - 1 + limit);
      return slice.map((line, index) => `${offset + index}|${line}`).join('\n');
    },

    write_file: async args => {
      const absolute = resolveInSandbox(sandboxRoot, asString(args, 'path'));
      await fs.promises.mkdir(path.dirname(absolute), { recursive: true });
      const content = asString(args, 'content');
      await fs.promises.writeFile(absolute, content);
      return `Wrote ${content.length} characters to ${toRelative(sandboxRoot, absolute)}`;
    },

    edit_file: async args => {
      const absolute = resolveInSandbox(sandboxRoot, asString(args, 'path'));
      const original = await fs.promises.readFile(absolute, 'utf-8');
      const oldString = asString(args, 'old_string');
      const newString = asString(args, 'new_string');
      const replaceAll = args.replace_all === true;
      const occurrences = original.split(oldString).length - 1;
      if (occurrences === 0) {
        throw new Error(`old_string not found in ${toRelative(sandboxRoot, absolute)}`);
      }
      if (occurrences > 1 && !replaceAll) {
        throw new Error(
          `old_string matches ${occurrences} times in ${toRelative(sandboxRoot, absolute)}; ` +
            'provide more context or set replace_all to true',
        );
      }
      const updated = replaceAll
        ? original.split(oldString).join(newString)
        : original.replace(oldString, newString);
      await fs.promises.writeFile(absolute, updated);
      return `Replaced ${replaceAll ? occurrences : 1} occurrence(s) in ${toRelative(
        sandboxRoot,
        absolute,
      )}`;
    },

    list_files: async args => {
      const absolute = resolveInSandbox(sandboxRoot, asString(args, 'path', '.'));
      const entries = await fs.promises.readdir(absolute, { withFileTypes: true });
      return entries
        .map(entry => `${entry.isDirectory() ? 'dir ' : 'file'} ${entry.name}`)
        .sort()
        .join('\n');
    },

    glob: async args => {
      const cwd = resolveInSandbox(sandboxRoot, asString(args, 'path', '.'));
      const matches = await fsGlob([asString(args, 'pattern')], {
        cwd,
        onlyFiles: true,
      });
      return matches.length > 0 ? matches.join('\n') : 'No files matched.';
    },

    search_files: async args => {
      const cwd = resolveInSandbox(sandboxRoot, asString(args, 'path', '.'));
      const regex = new RegExp(asString(args, 'pattern'));
      const files = await walkFiles(cwd);
      const results: string[] = [];
      for (const file of files) {
        if (results.length >= MAX_SEARCH_RESULTS) break;
        let content: string;
        try {
          content = await fs.promises.readFile(file, 'utf-8');
        } catch {
          continue;
        }
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (results.length < MAX_SEARCH_RESULTS && regex.test(line)) {
            results.push(`${toRelative(sandboxRoot, file)}:${index + 1}: ${line.trim()}`);
          }
        });
      }
      return results.length > 0 ? results.join('\n') : 'No matches.';
    },
  };

  return {
    definitions,
    async execute(name, rawArguments) {
      const implementation = implementations[name];
      if (!implementation) {
        return `Error: unknown tool "${name}"`;
      }
      let args: Record<string, unknown>;
      try {
        args = rawArguments ? JSON.parse(rawArguments) : {};
      } catch {
        return `Error: could not parse tool arguments as JSON: ${rawArguments}`;
      }
      try {
        const result = await implementation(args);
        return result.length > MAX_FILE_CHARS
          ? `${result.slice(0, MAX_FILE_CHARS)}\n... [truncated]`
          : result;
      } catch (error) {
        return `Error: ${error instanceof Error ? error.message : String(error)}`;
      }
    },
  };
}
