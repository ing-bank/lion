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
    // so the description belongs to the button instead of floating somewhere on the page.
    expect(content.getAttribute('role')).to.equal('tooltip');
    expect(invoker.getAttribute('aria-describedby')).to.equal(content.id);
    expect(content.id).to.not.equal(null);

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
    if (activeReader === 'virtual') {
      // The description is announced with the invoker; walking on also passes the tooltip content
      // itself, so a user who keeps browsing finds it again.
      for (let step = 0; step < 4; step += 1) {
        // eslint-disable-next-line no-await-in-loop
        if ((await sr.itemText()) === 'This is a tooltip') {
          break;
        }
        // eslint-disable-next-line no-await-in-loop
        await sr.next();
      }
    }

    await sr.expect({
      virtual: contains('tooltip, This is a tooltip'),
      nvda: containsLike('This is a tooltip'),
      voiceover: containsLike('This is a tooltip'),
    });
  });
});
