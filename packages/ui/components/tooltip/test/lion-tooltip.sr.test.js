import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from '@lion/test-runner-screenreader/commands.js';
import '@lion/ui/define/lion-tooltip.js';

/**
 * Screen reader tests for the overlay system, on its non-modal side: <lion-tooltip>.
 *
 * A tooltip is only accessible when a screen reader announces it *with the invoker*: the overlay
 * engine gives the content `role="tooltip"` and puts `aria-describedby` (or `aria-labelledby` for
 * `invokerRelation: 'label'`) on the invoker, which is what makes the description part of what a user
 * hears when the invoker is focused. That is exactly what the virtual expectation pins, and what the
 * DOM assertions verify independently of the wording.
 *
 * @typedef {import('@lion/ui/tooltip.js').LionTooltip} LionTooltip
 * @typedef {import('@lion/test-runner-screenreader').SrReader} SrReader
 */

/** @returns {Promise<LionTooltip>} */
async function fixtureTooltip() {
  const el = /** @type {LionTooltip} */ (
    await fixture(html`
      <div>
        <lion-tooltip>
          <button slot="invoker">Info</button>
          <div slot="content">This is a tooltip</div>
        </lion-tooltip>
        <button type="button">Next</button>
      </div>
    `)
  );
  return el;
}

/** @type {SrReader} */
let activeReader;

/**
 * Walk the virtual reader (and NVDA, whose cursor is what speaks) until the log holds a phrase
 * starting with `prefix`.
 *
 * @param {string} fragment
 * @param {{ atStart?: boolean }} [options]
 */
async function walkUntilSpoken(fragment, { atStart = false } = {}) {
  if (activeReader === 'voiceover') {
    return;
  }
  // A fragment by default: a reader announces "button, Info, <description>" as one phrase. `atStart`
  // is for the tooltip content itself, which the virtual reader announces as its own item and which
  // would otherwise already be "found" inside the invoker's phrase. The page still holds the previous
  // test file's fixtures (an overlay host lives in the body), so the cursor needs room to walk.
  for (let step = 0; step < 20; step += 1) {
    const log = await sr.phraseLog();
    const spoken = atStart
      ? log.some(phrase => phrase.startsWith(fragment))
      : log.some(phrase => phrase.includes(fragment));
    if (spoken) {
      return;
    }
    // eslint-disable-next-line no-await-in-loop
    await sr.next();
  }
  throw new Error(
    `the reader never said anything ${atStart ? 'starting with' : 'containing'} "${fragment}"`,
  );
}

/**
 * @param {() => boolean} condition
 * @param {string} description
 * @param {number} [timeout]
 */
async function waitUntil(condition, description, timeout = 5000) {
  const deadline = Date.now() + timeout;
  while (!condition()) {
    if (Date.now() > deadline) {
      throw new Error(`Timed out after ${timeout}ms waiting until ${description}`);
    }
    // eslint-disable-next-line no-await-in-loop
    await new Promise(resolve => {
      setTimeout(resolve, 50);
    });
  }
}

describe('<lion-tooltip> screen reader', () => {
  before(async () => {
    activeReader = await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces the tooltip as the description of its invoker', async () => {
    const el = await fixtureTooltip();
    const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));
    const content = /** @type {HTMLElement} */ (el.querySelector('[slot="content"]'));

    await sr.focus('button[slot="invoker"]');

    // The wiring the announcement depends on: the content is a tooltip and the invoker points at it,
    // so the description belongs to the button instead of floating somewhere on the page. The
    // overlay needs a moment (its hover interaction has a delay) before it is wired up.
    await waitUntil(
      () => invoker.getAttribute('aria-describedby') === content.id,
      'the invoker points at the tooltip content',
    );
    expect(content.getAttribute('role')).to.equal('tooltip');
    expect(content.id).to.not.equal(null);

    // The description is announced with the control it belongs to; a reader that speaks about what
    // its cursor is on has to be anchored on the invoker first. NVDA needs more than the walk: on a
    // page this small its cursor starts outside the web content (empty log, empty current item, in
    // CI, while the browser focus was on the invoker). Tabbing away and back is what makes it
    // announce the control and its description - the trick the input-iban test uses as well.
    if (activeReader === 'nvda') {
      await sr.press('Tab');
      await sr.press('Shift+Tab');
    }
    await walkUntilSpoken('Info');

    await sr.expect({
      virtual: contains('button, Info, This is a tooltip'),
      // NVDA and VoiceOver announce the description with the control it belongs to; the exact
      // separator ("Info, button, This is a tooltip" vs "Info, button") is theirs to choose.
      nvda: containsLike('This is a tooltip'),
      voiceover: containsLike('This is a tooltip'),
    });
  });

  it('keeps the tooltip reachable as content of its own', async () => {
    await fixtureTooltip();

    await sr.focus('button[slot="invoker"]');
    // The description is announced with the invoker; walking on also passes the tooltip content
    // itself, so a user who keeps browsing finds it again.
    await walkUntilSpoken(activeReader === 'virtual' ? 'tooltip,' : 'This is a tooltip', {
      atStart: activeReader === 'virtual',
    });

    await sr.expect({
      virtual: contains('tooltip, This is a tooltip'),
      nvda: containsLike('This is a tooltip'),
      voiceover: containsLike('This is a tooltip'),
    });
  });
});
