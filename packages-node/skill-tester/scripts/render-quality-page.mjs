// Re-render the quality docs page from the committed ledger, without running a sweep.
// Used by `npm run eval:docs` and by the docs build, so the page can be refreshed at any time.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLedger } from '../src/report/ledger.ts';
import { writeQualityPage } from '../src/report/docsPage.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, '..');
const repoRoot = path.resolve(packageRoot, '../..');

const ledgerPath = path.join(packageRoot, 'results/ledger.json');
const pagePath = path.join(
  repoRoot,
  'docs/fundamentals/node-tools/skill-tester/quality.md',
);

const ledger = loadLedger(ledgerPath);
writeQualityPage(pagePath, ledger);
console.log(
  `Rendered ${path.relative(repoRoot, pagePath)} from ${path.relative(repoRoot, ledgerPath)} ` +
    `(${ledger.entries.length} ledger row(s)).`,
);
