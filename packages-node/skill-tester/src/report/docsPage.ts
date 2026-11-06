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
import { RATES, formatUsd } from '../pricing/models.ts';

/** Below this, cross-run variance is not meaningful. */
const INDICATIVE_BELOW = 3;

function percent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function cell(entry: LedgerEntry, value: (entry: LedgerEntry) => string): string {
  if (entry.samples === 0) return 'n/a';
  // No run modified the deliverable: there is no comparable score, and 0% would read as a failure.
  if (entry.attempts === 0) return 'n/a';
  return value(entry);
}

function meanCell(entry: LedgerEntry): string {
  const rendered = cell(entry, e => `**${percent(e.mean)}**`);
  // The mean covers the runs that modified the deliverable only — mark it when that is not all of them.
  return entry.attempts > 0 && entry.attempts < entry.samples ? `${rendered}²` : rendered;
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

/** Cost for the whole cell, or an explicit absence — never a guessed number. */
function costCell(entry: LedgerEntry): string {
  if (entry.cost !== undefined) return formatUsd(entry.cost);
  if (!RATES[entry.model]) return 'no published rate';
  // The model has a rate but the row predates input/output tracking; $0.00 would be a lie.
  return 'n/a — recorded before the token split';
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
  lines.push(
    '`Rev` is the skill revision the row was measured against — the git tree hash of the skill ' +
      'directory, so it changes when the skill does and not when an unrelated commit lands. A ' +
      'scenario can hold rows from more than one revision; they are listed newest first, and only ' +
      'rows on the same revision are comparable.',
  );
  lines.push('');
  lines.push(`Ledger updated: ${ledger.updatedAt || 'n/a'}`);
  lines.push('');

  for (const scenario of scenarios) {
    const rows = ledger.entries
      .filter(entry => entry.scenario === scenario)
      .sort((a, b) => (b.ranAt ?? '').localeCompare(a.ranAt ?? ''));
    const kind = rows[0]?.kind ?? 'unknown';
    lines.push(`## ${scenario} (${kind})`);
    lines.push('');
    lines.push(
      '| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |',
    );
    lines.push(
      '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    );
    for (const entry of rows) {
      lines.push(
        `| \`${entry.model}\` ` +
          `| ${meanCell(entry)} ` +
          `| ${cell(entry, e => percent(e.min))} ` +
          `| ${cell(entry, e => percent(e.max))} ` +
          `| ${cell(entry, e => e.stdDev.toFixed(1))} ` +
          `| ${samplesCell(entry)} ` +
          `| ${behaviourCell(entry)} ` +
          `| ${entry.samples === 0 ? 'n/a' : `${entry.attempts}/${entry.samples}`} ` +
          `| ${entry.samples === 0 ? 'n/a' : entry.redoable} ` +
          `| ${tokensPerRun(entry)} ` +
          `| ${costCell(entry)} ` +
          `| \`${entry.skillRevision.slice(0, 7)}\` |`,
      );
    }
    lines.push('');
  }

  if (hasIndicative) {
    lines.push(`¹ fewer than ${INDICATIVE_BELOW} samples: indicative only.`);
    lines.push('');
  }
  if (ledger.entries.some(entry => entry.attempts > 0 && entry.attempts < entry.samples)) {
    lines.push('² the mean covers only the runs that modified the deliverable — see Attempts.');
    lines.push('');
  }
  if (ledger.entries.some(entry => entry.samples > 0 && entry.attempts === 0)) {
    lines.push(
      'A row also prints `n/a` when no run modified the deliverable: an untouched file is ' +
        '*not attempted*, which says nothing about the skill and must not read as a score of zero.',
    );
    lines.push('');
  }

  lines.push(
    'A `n/a` row means every run had to be redone because the endpoint failed — not a score of zero. ' +
      '"Attempts" is how many runs actually modified the deliverable; a run that never wrote ' +
      'anything is recorded as *not attempted* rather than as a wrong answer.',
  );
  lines.push('');
  lines.push('## Rates used for the cost column');
  lines.push('');
  lines.push('USD per 1M tokens, as read from the sources below. Input and output are priced');
  lines.push('separately; cached input is not discounted here, so a published cost is an upper bound.');
  lines.push('');
  lines.push('| Model | Input /1M | Output /1M | Source | Confidence | Read |');
  lines.push('| --- | --- | --- | --- | --- | --- |');
  for (const model of [...new Set(ledger.entries.map(entry => entry.model))].sort()) {
    const rate = RATES[model];
    lines.push(
      rate
        ? `| \`${model}\` | $${rate.input} | $${rate.output} | <${rate.source}> | ${rate.confidence} | ${rate.retrievedAt} |`
        : `| \`${model}\` | — | — | no published rate found | — | — |`,
    );
  }
  lines.push('');
  for (const model of [...new Set(ledger.entries.map(entry => entry.model))].sort()) {
    const note = RATES[model]?.note;
    if (note) lines.push(`- \`${model}\`: ${note}`);
  }
  lines.push('');

  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`;
}

export function writeQualityPage(file: string, ledger: Ledger): string {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, renderQualityPage(ledger));
  return file;
}
