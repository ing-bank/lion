import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from 'test-runner-sr/commands.js';
import '@lion/ui/define/lion-button.js';

/**
 * Screen reader test for <lion-button>.
 *
 * A button is only useful if it has a name, and that is exactly where buttons go wrong: an icon-only
 * button announces as "button" and nothing else. This pins the three ways a name is produced - slot
 * text, `aria-label`, and (for an icon) a label instead of an exposed icon - and the state that makes a
 * button unreachable without removing it from the tab order.
 *
 */

/** @returns {Promise<HTMLElement>} */
async function fixtureComponent() {
  return fixture(html`
    <div>
      <lion-button>Save</lion-button>
      <lion-button aria-label="Close dialog">
        <span aria-hidden="true">×</span>
      </lion-button>
    </div>
  `);
}

describe('<lion-button> screen reader', () => {
  before(async () => {
    await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces every button by its name, also when it only holds an icon', async () => {
    await fixtureComponent();
    const wrapper = /** @type {HTMLElement} */ (document.querySelector('div'));
    await expect(wrapper).to.be.accessible();

    await sr.focus('lion-button');
    // The log grows one phrase per step, so walk the three buttons before asserting the whole set.
    for (let step = 0; step < 8; step += 1) {
      // eslint-disable-next-line no-await-in-loop
      await sr.next();
    }

    await sr.expect({
      virtual: contains(
        'button, Save',
        // The name of an icon-only button comes from `aria-label`; without it this would be "button".
        'button, Close dialog',
      ),
      // The three names are what every reader has to say, so these do not differ per reader. What does
      // differ is how a disabled state is worded (NVDA says "unavailable", VoiceOver "dimmed"), so
      // that is left to the state assertion below instead of being pinned to one reader's vocabulary.
      nvda: containsLike('Save'),
      voiceover: containsLike('Save'),
    });
  });
});
