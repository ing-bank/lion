/**
 * Derives one scenario per documented use case, from the docs themselves.
 *
 * The task has exactly two inputs:
 *
 *   - `docs`:     globs of the docs files to read (repo-relative);
 *   - `headings`: a regular expression; a line that matches it starts a use case, and the rest of
 *                 that line (with the match removed) is the use case's name.
 *
 * Each use case is one scenario, named `use-case/<unit>--<slug>` (the convention of the hand-authored
 * `use-case/combobox--suggest-while-you-type`). `<unit>` is the folder that holds the docs file and
 * `<slug>` is the heading, slugified. The scenario kind says what the unit is:
 *
 *   - `docs/components/<unit>/…`          -> kind `component`, the unit's entrypoint is `@lion/ui/<unit>.js`;
 *   - `docs/fundamentals/systems/<unit>/…` -> kind `system`, and the system's documented consumer
 *                                             entrypoints (e.g. `dialog` for `overlays`) are accepted too.
 *
 * Everything in a scenario is derived, never invented: the prompt goal is the heading plus the first
 * sentence of its prose; the file and class come from the neutral helpers in `lionUi.ts`
 * (`targetFileFor`, `classNameFor`); the checks are the shared entrypoint checks. The prompt must never
 * name a component tag (`lion-<name>`) or class (`Lion<Name>`), so a use case whose text does is
 * reduced to its heading, and a heading that leaks is a hard error.
 *
 * A glob that matches no file, or a heading pattern that matches no line, is an error. Zero scenarios is
 * never reported as success.
 */
import fs from 'node:fs';
import path from 'node:path';
import fsGlob from '../fsGlob.ts';
import { lintScenarios, type LintFinding } from './lint.ts';
import {
  classNameFor,
  entrypointChecks,
  SYSTEM_CONSUMER_ENTRYPOINTS,
  targetFileFor,
} from './lionUi.ts';
import {
  discoverComponentNames,
  discoverKnownTags,
  discoverSystemNames,
  discoverTagClasses,
} from './index.ts';
import type { ScenarioCheck, TestScenario } from './types.ts';

/** The docs the use cases live in. Systems live under `docs/fundamentals/systems`, not `docs/systems`. */
export const DEFAULT_USE_CASE_DOCS = [
  'docs/components/*/use-cases.md',
  'docs/fundamentals/systems/*/use-cases.md',
];

/** `## ` headings, the same inventory `scripts/report-use-case-coverage.mjs` counts. */
export const DEFAULT_USE_CASE_HEADINGS = '^## ';

export type UseCaseSource = {
  /** Repo-relative path of the docs file. */
  file: string;
  /** 1-indexed line of the heading. */
  line: number;
  /** The use case's name, as written in the heading. */
  heading: string;
  /** The folder that holds the docs file: the component or system the use case documents. */
  unit: string;
  kind: 'component' | 'system';
};

export type DerivedUseCase = { scenario: TestScenario; source: UseCaseSource };

export type DeriveUseCasesOptions = {
  repoRoot: string;
  docs?: string[];
  headings?: string;
  /** Scenario names already taken elsewhere (the hand-authored registry); a clash is an error. */
  reserved?: string[];
};

type ScannedLine = { text: string; line: number; fenced: boolean };

/** Every line with its number, and whether it sits inside a fenced code block (fence lines included). */
function scanLines(markdown: string): ScannedLine[] {
  let inFence = false;
  return markdown.split('\n').map((text, index) => {
    if (/^\s*(```|~~~)/.test(text)) {
      inFence = !inFence;
      return { text, line: index + 1, fenced: true };
    }
    return { text, line: index + 1, fenced: inFence };
  });
}

/** Markdown to plain prose: links keep their text, code spans and emphasis markers go, quotes go. */
function plain(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`/g, '')
    .replace(/\*\*|__/g, '')
    .replace(/"/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The name fragment of a scenario: `Suggest while you type` -> `suggest-while-you-type`. */
export function slugify(heading: string): string {
  return plain(heading)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * The first sentence of the use case's first prose paragraph. Code, tables, lists, quotes, html and
 * images are skipped; a paragraph ends at a blank line, a code fence or any other block.
 */
function firstProseSentence(body: ScannedLine[]): string {
  const paragraph: string[] = [];
  for (const { text, fenced } of body) {
    const trimmed = text.trim();
    const blockStart = /^(>|\||<|!|[-*+]\s|\d+\.\s|\[)/.test(trimmed);
    if (fenced || !trimmed || blockStart) {
      if (paragraph.length > 0) break;
      continue;
    }
    paragraph.push(trimmed);
  }
  const text = plain(paragraph.join(' '));
  if (!text) return '';
  return text.split(/(?<=[.!?])\s+(?=[A-Z])/)[0].trim();
}

/** Token patterns a prompt must never contain: a component's tag or class is the answer. */
function forbiddenPatterns(
  knownTags: string[],
  tagClasses: Record<string, string>,
  units: string[],
): RegExp[] {
  const pascal = (name: string) =>
    name
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  const tokens = new Set<string>([
    ...knownTags,
    ...Object.values(tagClasses),
    ...units.flatMap(unit => [`lion-${unit}`, `Lion${pascal(unit)}`]),
  ]);
  const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [...tokens].map(token => new RegExp(`(?<![\\w-])${escape(token)}(?![\\w-])`));
}

const leaks = (text: string, patterns: RegExp[]) => patterns.some(pattern => pattern.test(text));

/** The `kind` of a docs file, from the folder above its unit: `components/` or `systems/`. */
function kindOf(file: string): { unit: string; kind: 'component' | 'system' } {
  const unitDir = path.posix.dirname(file.split(path.sep).join('/'));
  const unit = path.posix.basename(unitDir);
  const parent = path.posix.basename(path.posix.dirname(unitDir));
  if (parent === 'components') return { unit, kind: 'component' };
  if (parent === 'systems') return { unit, kind: 'system' };
  throw new Error(
    `cannot tell whether "${file}" documents a component or a system: its folder must be ` +
      `.../components/<name>/ or .../systems/<name>/`,
  );
}

/**
 * Derive one scenario per use case. Throws (never returns an empty list silently) when a glob matches no
 * file, a heading pattern matches no line, a heading is empty or unslugifiable, two use cases claim one
 * name, or a heading itself names a tag or class.
 */
export async function deriveUseCaseScenarios(options: DeriveUseCasesOptions): Promise<{
  derived: DerivedUseCase[];
  files: string[];
  /** Use cases whose prose named a tag or class, so their goal is the heading alone. */
  headingOnlyGoals: string[];
}> {
  const { repoRoot } = options;
  const docs = options.docs ?? DEFAULT_USE_CASE_DOCS;
  const headings = options.headings ?? DEFAULT_USE_CASE_HEADINGS;

  if (docs.length === 0) throw new Error('--docs needs at least one glob');
  let pattern: RegExp;
  try {
    pattern = new RegExp(headings);
  } catch (error) {
    throw new Error(
      `--headings "${headings}" is not a valid regular expression: ${error instanceof Error ? error.message : error}`,
    );
  }

  const files = new Set<string>();
  for (const glob of docs) {
    const matched = await fsGlob(glob, { cwd: repoRoot, onlyFiles: true });
    if (matched.length === 0) {
      throw new Error(`--docs "${glob}" matched no files under ${repoRoot}`);
    }
    for (const file of matched) files.add(file);
  }
  const sortedFiles = [...files].sort();

  const knownTags = discoverKnownTags(repoRoot);
  const tagClasses = discoverTagClasses(repoRoot);
  const units = [...new Set(sortedFiles.map(file => kindOf(file).unit))];
  const patterns = forbiddenPatterns(knownTags, tagClasses, units);

  const derived: DerivedUseCase[] = [];
  const headingOnlyGoals: string[] = [];
  const seen = new Map<string, string>(); // name -> where it came from
  const reserved = new Set(options.reserved ?? []);

  for (const file of sortedFiles) {
    const { unit, kind } = kindOf(file);
    const lines = scanLines(fs.readFileSync(path.join(repoRoot, file), 'utf8'));
    const isBoundary = (entry: ScannedLine) =>
      !entry.fenced && (pattern.test(entry.text) || /^#{1,6}\s/.test(entry.text));

    for (let index = 0; index < lines.length; index++) {
      const entry = lines[index];
      if (entry.fenced || !pattern.test(entry.text)) continue;

      const rawHeading = entry.text.replace(pattern, '').trim();
      const where = `${file}:${entry.line}`;
      if (!rawHeading) throw new Error(`${where}: the heading matches --headings but has no name`);
      const slug = slugify(rawHeading);
      if (!slug)
        throw new Error(
          `${where}: the heading "${rawHeading}" has no letters or digits to name a scenario`,
        );

      const name = `use-case/${unit}--${slug}`;
      const previous = seen.get(name);
      if (previous)
        throw new Error(`scenario "${name}" is produced twice: ${previous} and ${where}`);
      if (reserved.has(name))
        throw new Error(`scenario "${name}" (${where}) clashes with a hand-authored scenario`);
      seen.set(name, where);

      let end = index + 1;
      while (end < lines.length && !isBoundary(lines[end])) end++;
      const body = lines.slice(index + 1, end);

      const heading = plain(rawHeading);
      const headingSentence = /[.!?]$/.test(heading) ? heading : `${heading}.`;
      const capitalised = headingSentence.charAt(0).toUpperCase() + headingSentence.slice(1);
      const sentence = firstProseSentence(body);
      let goal = [capitalised, sentence].filter(Boolean).join(' ');
      if (leaks(goal, patterns)) {
        if (leaks(capitalised, patterns)) {
          throw new Error(
            `${where}: the heading "${rawHeading}" names a tag or class, so the prompt would leak the answer`,
          );
        }
        goal = capitalised;
        headingOnlyGoals.push(name);
      }

      const target = targetFileFor(unit);
      const producedClass = classNameFor(unit);
      const checks: ScenarioCheck[] = [
        { type: 'exists', file: target },
        {
          type: 'matches',
          file: target,
          pattern: `export class ${producedClass}`,
          description: `exports the class \`${producedClass}\``,
        },
        ...entrypointChecks(target, unit, {
          acceptedEntrypoints: kind === 'system' ? SYSTEM_CONSUMER_ENTRYPOINTS[unit] : undefined,
        }),
        { type: 'noUnusedImports', file: target, description: 'imports nothing it does not use' },
        {
          type: 'notMatches',
          file: target,
          pattern: '@lion/ui/define/',
          description: 'does not use a global define entrypoint',
        },
        {
          type: 'notMatches',
          file: target,
          pattern: 'extends\\s+Lion[A-Za-z]*',
          description: 'consumes lion rather than subclassing it',
        },
        {
          type: 'noExtraFiles',
          file: target,
          description: `creates no files other than the deliverable`,
        },
      ];

      derived.push({
        source: { file, line: entry.line, heading: rawHeading, unit, kind },
        scenario: {
          name,
          kind,
          description: `Documented use case "${rawHeading}" (${where}).`,
          prompt: [
            `Create \`${target}\`. Create that file only — nothing else.`,
            `It must export a class named \`${producedClass}\`.`,
            `Goal: ${goal}`,
          ].join(' '),
          targetFile: target,
          files: {
            [target]: `// TODO: implement the use case in this file.\n`,
          },
          checks,
        },
      });
    }
  }

  if (derived.length === 0) {
    throw new Error(
      `--headings "${headings}" matched no line in ${sortedFiles.length} docs file(s): ${sortedFiles.join(', ')}`,
    );
  }

  return { derived, files: sortedFiles, headingOnlyGoals };
}

/** The lint of the derived scenarios, with the same repository context `eval:list` lints with. */
export function lintDerivedUseCases(derived: DerivedUseCase[], repoRoot: string): LintFinding[] {
  const context = {
    components: discoverComponentNames(repoRoot),
    systems: discoverSystemNames(repoRoot),
  };
  return lintScenarios(
    derived.map(entry => entry.scenario),
    context,
  );
}
