/**
 * Deterministic gates.
 *
 * A gate is a pass/fail prerequisite checked *before* a sandbox is scored, not a scored
 * dimension: if a produced file does not even parse, textual similarity to a golden file is
 * meaningless (an unparseable file can otherwise score 100%, because the convention checks are
 * substring assertions). A failed gate zeroes the scenario and the reason is recorded as evidence.
 *
 * Both gates are derived from a single oxc parse per file:
 *
 *   - `syntax`        — does every produced source file parse at all?
 *   - `import-policy` — does it import only through the entrypoints the skill documents?
 *                       (no deep imports into `@lion/ui/components/**` or `@lion/ui/src/**`;
 *                        no `@lion/*` other than `@lion/ui/*`; bare `lit` is allowed, see below)
 *
 * The parser is `oxc-parser` — already a dependency of this repo (pinned by
 * `packages-node/providence-analytics`). It is used rather than `node --check` because the latter
 * ACCEPTS an unterminated template literal when the sandbox declares no module type. The sandbox
 * does declare `"type": "module"` (see `createProjectSandbox`), but the gate must not depend on it.
 *
 * The import policy is enforced here rather than with ESLint because ESLint 8.57 cannot express it:
 * `patterns[].regex` is rejected as invalid config, and `!@lion/ui/*` negation flags the valid
 * import as a violation (both measured). oxc already gives us the specifiers, exactly and for free.
 */

import fs from 'node:fs';
import path from 'node:path';
import { parseSync } from 'oxc-parser';

export type GateName = 'syntax' | 'import-policy' | 'modified';

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

/** Extensions the gates attempt to parse. */
const PARSEABLE_EXTENSIONS = new Set(['.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx', '.mts', '.cts']);

/** Directories that are never produced by the model under test. */
const IGNORED_DIRS = new Set(['node_modules', '.git', '.skill', '.tmp']);

type ParsedFile = {
  relative: string;
  source: string;
  errors: { message: string; start: number }[];
  specifiers: { value: string; start: number }[];
};

/** Convert a byte offset into 1-based line/column for a readable failure message. */
function offsetToLineColumn(source: string, offset: number): { line: number; column: number } {
  const before = source.slice(0, offset);
  return { line: before.split('\n').length, column: offset - before.lastIndexOf('\n') };
}

/** The module specifier of an import; dynamic imports expose only a span, not a value. */
function specifierOf(moduleRequest: unknown, source: string): string | undefined {
  const request = moduleRequest as { value?: unknown; start?: number; end?: number } | undefined;
  if (!request) return undefined;
  if (typeof request.value === 'string') return request.value;
  if (typeof request.start === 'number' && typeof request.end === 'number') {
    return source.slice(request.start, request.end).replace(/^['"]|['"]$/g, '');
  }
  return undefined;
}

type ModuleSpecifier = { value: string; start: number };

type OxcParseResult = {
  module?: {
    staticImports?: { moduleRequest?: unknown }[];
    dynamicImports?: { moduleRequest?: unknown }[];
  };
  errors?: { message?: string; labels?: { start?: number }[] }[];
};

/** Parse every produced source file once, collecting syntax errors and import specifiers. */
function parseSandbox(sandboxRoot: string): ParsedFile[] {
  const files: ParsedFile[] = [];

  const walk = (dir: string): void => {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.name)) walk(full);
        continue;
      }
      if (!entry.isFile() || !PARSEABLE_EXTENSIONS.has(path.extname(entry.name))) continue;

      const source = fs.readFileSync(full, 'utf-8');
      const result = parseSync(full, source) as OxcParseResult;

      const specifiers: ModuleSpecifier[] = [];
      for (const node of [
        ...(result.module?.staticImports ?? []),
        ...(result.module?.dynamicImports ?? []),
      ]) {
        const value = specifierOf(node.moduleRequest, source);
        if (!value) continue;
        const request = node.moduleRequest as { start?: number } | undefined;
        specifiers.push({ value, start: request?.start ?? 0 });
      }

      files.push({
        relative: path.relative(sandboxRoot, full).split(path.sep).join('/'),
        source,
        errors: (result.errors ?? []).map(error => ({
          message: error.message ?? 'syntax error',
          start: error.labels?.[0]?.start ?? 0,
        })),
        specifiers,
      });
    }
  };

  walk(sandboxRoot);
  return files;
}

function syntaxGateFor(files: ParsedFile[]): GateResult {
  const failures: GateFailure[] = [];
  for (const file of files) {
    const first = file.errors[0];
    if (!first) continue;
    failures.push({
      file: file.relative,
      message: first.message,
      ...offsetToLineColumn(file.source, first.start),
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

/**
 * Deep imports into `@lion/ui` internals.
 *
 * The skill's Rules say "Never deep-import from `@lion/ui/components/<x>/src/*`", so that — not
 * bare `lit` — is what this gate enforces.
 *
 * Bare `lit` is deliberately ALLOWED. `@lion/ui/core.js` exports only mixins and utilities
 * (DisabledMixin, SlotMixin, uuid, ...) and does NOT export `LitElement`, `html` or `css`; the
 * skill's own canonical example is `import { html } from 'lit';`. Requiring core.js here made the
 * gate zero the skill's documented output while "fixing" it produced code that throws in the
 * browser (`does not provide an export named 'LitElement'`). Measured in headless Chromium, not
 * assumed.
 */
const DEEP_LION_IMPORT = /^@lion\/ui\/(components|src)\//;

/**
 * The `@lion/ui` specifiers that actually exist, derived from the package's own export map.
 *
 * One allowlist replaces four denylists: `#` subpath imports, `@lion/*` other than `@lion/ui/*`,
 * deep paths, and any subpath the export map does not declare all fail the same test — and the
 * list stays true when the export map changes, because it is read from the map itself.
 */
export function allowedLionUiSpecifiers(repoRoot: string): string[] {
  const packageJsonPath = path.join(repoRoot, 'packages/ui/package.json');
  if (!fs.existsSync(packageJsonPath)) return [];
  const { exports } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as {
    exports?: Record<string, unknown>;
  };
  return Object.keys(exports ?? {})
    .filter(key => key.startsWith('./'))
    .map(key => `@lion/ui/${key.slice(2)}`);
}

/**
 * Export-map keys use a single `*` wildcard. Matched by prefix/suffix rather than by building a
 * RegExp, so this needs no escaping and cannot mis-escape a specifier.
 */
function matchesExportPattern(specifier: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    const [prefix, suffix] = pattern.split('*');
    if (suffix === undefined) return specifier === prefix;
    return (
      specifier.startsWith(prefix) &&
      specifier.endsWith(suffix) &&
      specifier.length >= prefix.length + suffix.length
    );
  });
}

function policyViolation(specifier: string, allowed: string[] = []): string | undefined {
  if (specifier.startsWith('#')) {
    return `imports '${specifier}': internal '#' subpath imports are not public API, use the '@lion/ui/*' entrypoints`;
  }
  if (DEEP_LION_IMPORT.test(specifier)) {
    return `imports '${specifier}': deep imports are not documented, use the '@lion/ui/*' entrypoints`;
  }
  if (specifier === '@lion' || (specifier.startsWith('@lion/') && !specifier.startsWith('@lion/ui'))) {
    return `imports '${specifier}': use the '@lion/ui/*' entrypoints ('@lion/*' is not a dependency)`;
  }
  if (
    allowed.length > 0 &&
    specifier.startsWith('@lion/ui/') &&
    !matchesExportPattern(specifier, allowed)
  ) {
    return `imports '${specifier}': not covered by the '@lion/ui' export map`;
  }
  return undefined;
}

function importPolicyGateFor(files: ParsedFile[], allowed: string[] = []): GateResult {
  const failures: GateFailure[] = [];
  let checked = 0;

  for (const file of files) {
    // A file that does not parse cannot yield reliable imports; the syntax gate owns that failure.
    if (file.errors.length > 0) continue;
    checked++;
    for (const { value, start } of file.specifiers) {
      const message = policyViolation(value, allowed);
      if (!message) continue;
      failures.push({ file: file.relative, message, ...offsetToLineColumn(file.source, start) });
    }
  }

  const passed = failures.length === 0;
  return {
    name: 'import-policy',
    passed,
    checked,
    failures,
    summary: passed
      ? `${checked} file(s) import through allowed entrypoints`
      : `${failures.length} import violation(s): ` +
        failures.map(f => `${f.file}:${f.line} ${f.message}`).join('; '),
  };
}

/**
 * Did the model change anything at all?
 *
 * A no-op must not collect partial credit. Measured: an untouched starter file scored 42.9% because
 * it satisfies `exists` (the file is there — it ships in the sandbox) and every `notMatches`
 * (an empty file contains none of the forbidden things). So doing nothing collected 3 of 7 checks.
 *
 * The deliverable always ships in the sandbox, so "this is still exactly the starter" is a
 * deterministic prerequisite like "does it parse" — not a scored dimension.
 */
function modifiedGateFor(sandboxRoot: string, starter: Record<string, string>): GateResult {
  const declared = Object.entries(starter);
  const untouched: string[] = [];
  let changed = false;

  for (const [relative, starterContent] of declared) {
    let actual: string | undefined;
    try {
      actual = fs.readFileSync(path.join(sandboxRoot, relative), 'utf-8');
    } catch {
      actual = undefined; // deleting the file is a change (the `exists` check catches it separately)
    }
    if (actual === undefined || actual !== starterContent) changed = true;
    else untouched.push(relative);
  }

  const passed = changed || declared.length === 0;
  return {
    name: 'modified',
    passed,
    checked: declared.length,
    failures: passed
      ? []
      : declared.map(([relative]) => ({
          file: relative,
          line: 1,
          column: 1,
          message: 'still byte-identical to the starter file: the scenario was not attempted',
        })),
    summary: passed
      ? `${declared.length - untouched.length} of ${declared.length} starter file(s) changed`
      : `no starter file was modified (${untouched.join(', ')})`,
  };
}

/** Run every gate over a sandbox, parsing each file exactly once. */
export function runGates(
  sandboxRoot: string,
  options: { allowedLionUiSpecifiers?: string[]; starter?: Record<string, string> } = {},
): GateResult[] {
  const files = parseSandbox(sandboxRoot);
  return [
    syntaxGateFor(files),
    importPolicyGateFor(files, options.allowedLionUiSpecifiers ?? []),
    // Only when the caller supplies the starter: without it there is nothing to compare against.
    ...(options.starter ? [modifiedGateFor(sandboxRoot, options.starter)] : []),
  ];
}

/** The syntax gate on its own. */
export function syntaxGate(sandboxRoot: string): GateResult {
  return syntaxGateFor(parseSandbox(sandboxRoot));
}

/** The import-policy gate on its own. */
export function importPolicyGate(sandboxRoot: string): GateResult {
  return importPolicyGateFor(parseSandbox(sandboxRoot));
}
