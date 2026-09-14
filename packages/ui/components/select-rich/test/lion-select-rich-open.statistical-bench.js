import { fixture, html, expect } from '@open-wc/testing';
import { runBenchmarks } from '@lion/web-test-runner-advanced-perf/browser.js';
import '@lion/ui/define/lion-select-rich.js';
import '@lion/ui/define/lion-option.js';

/** @typedef {import('@lion/ui/select-rich.js').LionSelectRich} LionSelectRich */

const options = Array.from(
  { length: 50 },
  (_, index) => html`<lion-option .choiceValue=${index}>Option ${index + 1}</lion-option>`,
);
const frameBudget = 1000 / 60;

/** @param {{ opened: boolean }} params */
const createSelectRichFixture = params =>
  /** @type {Promise<LionSelectRich>} */ (
    fixture(html`<lion-select-rich .opened=${params.opened}>${options}</lion-select-rich>`)
  );

describe('<lion-select-rich> statistical benchmarks', () => {
  it('measures closed 50-option listbox', async () => {
    const result = await runBenchmarks(
      [
        {
          name: 'closed-listbox',
          fixture: () => createSelectRichFixture({ opened: false }),
          cleanup: select => select.remove(),
        },
      ],
      { measure: { mode: 'paint' } },
    );

    expect(result.benchmarks['closed-listbox'].meanCI.high).to.be.below(frameBudget);
  });

  it('measures opened 50-option listbox', async () => {
    const result = await runBenchmarks(
      [
        {
          name: 'opened-listbox',
          fixture: () => createSelectRichFixture({ opened: true }),
          cleanup: select => select.remove(),
        },
      ],
      { measure: { mode: 'paint' } },
    );

    expect(result.benchmarks['opened-listbox'].meanCI.high).to.be.below(frameBudget);
  });
});
