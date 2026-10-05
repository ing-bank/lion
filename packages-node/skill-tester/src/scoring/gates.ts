/**
 * Deterministic gates.
 *
 * A gate is a pass/fail prerequisite checked *before* a sandbox is scored, not a scored
 * dimension: if a produced file does not even parse, textual similarity to a golden file is
 * meaningless (an unparseable file can otherwise score 100%, because the convention checks are
 * substring assertions). When a gate fails the scenario scores zero and the reason is recorded
 * as evidence.
 *
 * The parser is `oxc-parser` — already a dependency of this repo
 * (`packages-node/providence-analytics` pins it). It is used here rather than `node --check`
 * because it does not depend on module-type inference: on a sandbox without a declared module
 * type, `node --check` accepts a file with an unterminated template literal that oxc rejects.
 * The sandbox declares `"type": "module"` (see `createProjectSandbox`) so both agree, but the
 * gate must not depend on that.
 */

import fs from 'node:fs';
import path from 'node:path';
import { parseSync } from 'oxc-parser';

export type GateName = 'syntax';

export type GateFailure = {
  file: string;
  message: string;
  line: number;
  column: number;
};

export type GateResult = {
  name: GateName;
  passed: boolean;
  /** How many files the gate inspected. */
  checked: number;
  failures: GateFailure[];
  summary: string;
};

/** Extensions the syntax gate attempts to parse. */
const PARSEABLE_EXTENSIONS = new Set(['.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx', '.mts', '.cts']);

/** Directories that are never produced by the model under test. */
const IGNORED_DIRS = new Set(['node_modules', '.git', '.skill', '.tmp']);

function walk(dir: string, out: string[] = []): string[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) walk(full, out);
    } else if (entry.isFile() && PARSEABLE_EXTENSIONS.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

/** Convert a byte offset into 1-based line/column for a readable failure message. */
function offsetToLineColumn(source: string, offset: number): { line: number; column: number } {
  const before = source.slice(0, offset);
  const line = before.split('\n').length;
  const lastNewline = before.lastIndexOf('\n');
  return { line, column: offset - lastNewline };
}

/**
 * Parse every produced source file in the sandbox; any syntax error fails the gate.
 */
export function syntaxGate(sandboxRoot: string): GateResult {
  const files = walk(sandboxRoot);
  const failures: GateFailure[] = [];

  for (const absolute of files) {
    const source = fs.readFileSync(absolute, 'utf-8');
    const result = parseSync(absolute, source);
    const first = result.errors?.[0];
    if (!first) continue;

    const start = first.labels?.[0]?.start ?? 0;
    const { line, column } = offsetToLineColumn(source, start);
    failures.push({
      file: path.relative(sandboxRoot, absolute).split(path.sep).join('/'),
      message: first.message ?? 'syntax error',
      line,
      column,
    });
  }

  const passed = failures.length === 0;
  return {
    name: 'syntax',
    passed,
    checked: files.length,
    failures,
    summary: passed
      ? `${files.length} file(s) parsed`
      : `${failures.length} of ${files.length} file(s) do not parse: ` +
        failures.map(f => `${f.file}:${f.line}:${f.column} ${f.message}`).join('; '),
  };
}

/** Run every gate. */
export function runGates(sandboxRoot: string): GateResult[] {
  return [syntaxGate(sandboxRoot)];
}
