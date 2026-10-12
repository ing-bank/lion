/**
 * Renders the results ledger as a static markdown table page for the docs site.
 *
 * Static on purpose: the docs site is Eleventy with `eleventyNavigation` frontmatter, so a committed
 * markdown page needs no change in the site repository and no data-file coupling — the same
 * generated-artifact pattern the skill references already use.
 *
 * Two honesty rules from the harness itself, enforced here:
 * - a cell with fewer than 3 samples is marked indicative, because a single sample is never quoted;
 * - a cell with no comparable run prints `n/a`, never `0%` (an endpoint failure is not a zero score).
 */

import fs from 'node:fs';
import path from 'node:path';
import type { Ledger, LedgerEntry } from './ledger.ts';

/** Below this, cross-run variance is not meaningful. */
const INDICATIVE_BELOW = 3;

function percent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function cell(entry: LedgerEntry, value: (entry: LedgerEntry) => string): string {
  return entry.samples === 0 ? 'n/a' : value(entry);
}

function samplesCell(entry: LedgerEntry): string {
  if (entry.samples === 0) return '0 (n/a)';
  return entry.samples < INDICATIVE_BELOW ? `${entry.samples}¹` : String(entry.samples);
}

function behaviourCell(entry: LedgerEntry): string {
  if (entry.behaviourTotal === 0) return '—';
  return `${entry.behaviourPassed}/${entry.behaviourTotal}`;
}

function tokensPerRun(entry: LedgerEntry): string {
  return entry.samples === 0 ? 'n/a' : Math.round(entry.tokens / entry.samples).toLocaleString('en-US');
}

export function renderQualityPage(ledger: Ledger): string {
  const lines: string[] = [];
  const scenarios = [...new Set(ledger.entries.map(entry => entry.scenario))].sort();
  const hasIndicative = ledger.entries.some(
    entry => entry.samples > 0 && entry.samples < INDICATIVE_BELOW,
  );

  lines.push('---');
  lines.push('parts:');
  lines.push('  - Node Tools');
  lines.push("title: 'skill-tester: quality'");
  lines.push('eleventyNavigation:');
  lines.push('  key: Node Tools >> skill-tester quality');
  lines.push('  parent: Node Tools >> skill-tester');
  lines.push('  title: Quality');
  lines.push('  order: 20');
  lines.push('---');
  lines.push('');
  lines.push('# skill-tester: quality');
  lines.push('');
  lines.push(
    '> Generated from `packages-node/skill-tester/results/ledger.json` by ' +
      '`npm run eval:docs -w packages-node/skill-tester`. Do not edit by hand.',
  );
  lines.push('');
  lines.push(
    'Scores are the skill-tester convention checks plus behaviour in a real browser, on small ' +
      'isolated scenarios. They say whether the skill produced working code for **these** prompts, ' +
      'not how good the skill is in general.',
  );
  lines.push('');
  lines.push(`Ledger updated: ${ledger.updatedAt || 'n/a'}`);
  lines.push('');

  for (const scenario of scenarios) {
    const rows = ledger.entries.filter(entry => entry.scenario === scenario);
    const kind = rows[0]?.kind ?? 'unknown';
    lines.push(`## ${scenario} (${kind})`);
    lines.push('');
    lines.push('| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run |');
    lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
    for (const entry of rows) {
      lines.push(
        `| \`${entry.model}\` ` +
          `| ${cell(entry, e => `**${percent(e.mean)}**`)} ` +
          `| ${cell(entry, e => percent(e.min))} ` +
          `| ${cell(entry, e => percent(e.max))} ` +
          `| ${cell(entry, e => e.stdDev.toFixed(1))} ` +
          `| ${samplesCell(entry)} ` +
          `| ${behaviourCell(entry)} ` +
          `| ${entry.samples === 0 ? 'n/a' : `${entry.attempts}/${entry.samples}`} ` +
          `| ${entry.samples === 0 ? 'n/a' : entry.redoable} ` +
          `| ${tokensPerRun(entry)} |`,
      );
    }
    lines.push('');
  }

  if (hasIndicative) {
    lines.push(`¹ fewer than ${INDICATIVE_BELOW} samples: indicative only.`);
    lines.push('');
  }

  lines.push(
    'A `n/a` row means every run had to be redone because the endpoint failed — not a score of zero. ' +
      '"Attempts" is how many runs actually modified the deliverable; a run that never wrote ' +
      'anything is recorded as *not attempted* rather than as a wrong answer.',
  );
  lines.push('');

  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`;
}

export function writeQualityPage(file: string, ledger: Ledger): string {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, renderQualityPage(ledger));
  return file;
}
