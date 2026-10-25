import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from 'test-runner-sr/commands.js';
import '@lion/ui/define/lion-dialog.js';

/**
 * Screen reader tests for the overlay system, on its modal side: <lion-dialog>.
 *
 * The overlay engine puts `role="dialog"` and the accessible name on the content node
 * (`OverlayController.handlesAccessibility`) and wraps it in `<dialog role="none">`; the
 * announcement that matters to a user is therefore "dialog, Popup" plus the content, not "a div
 * somewhere on the page". The DOM assertions keep that wiring covered independently of the wording a
 * reader chooses, because that wording differs per reader and per run.
 *
 * @typedef {import('@lion/ui/dialog.js').LionDialog} LionDialog
 * @typedef {import('test-runner-sr').SrReader} SrReader
 */

/** @returns {Promise<LionDialog>} */
async function fixtureDialog() {
  const el = /** @type {LionDialog} */ (
    await fixture(html`
      <div>
        <lion-dialog>
          <button slot="invoker">Popup button</button>
          <div slot="content" class="dialog" aria-label="Popup">Hey there</div>
        </lion-dialog>
        <!-- Somewhere for Tab to go, so the focus does not leave the page. -->
        <button type="button">Next</button>
      </div>
    `)
  );
  return el;
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

/** @type {SrReader} */
let activeReader;

/**
 * Put the reader (and the browser focus) on the invoker button.
 *
 * A real reader follows the OS focus, so `sr.focus()` is enough for NVDA and VoiceOver. The virtual
 * reader has a cursor of its own: it has to be walked onto the button, and it is that cursor - not
 * the browser focus - that decides where its `Enter` goes (a press on the wrong item opens nothing).
 */
async function anchorOnInvoker() {
  await sr.focus('button[slot="invoker"]');
  if (activeReader === 'virtual') {
    for (let step = 0; step < 5; step += 1) {
      // eslint-disable-next-line no-await-in-loop
      if ((await sr.itemText()) === 'Popup button') {
        return;
      }
      // eslint-disable-next-line no-await-in-loop
      await sr.next();
    }
    throw new Error('the virtual reader never reached the invoker button');
  }
}

/**
 * Walk the virtual reader until its log holds a phrase starting with `prefix`.
 *
 * The log is the signal, not the current item: the overlay moves nodes around, and a DOM mutation
 * resets the virtual reader's cursor, so `itemText()` can be empty while the log already says plenty.
 *
 * @param {string} fragment
 */
async function walkUntilSpoken(fragment) {
  if (activeReader === 'voiceover') {
    return;
  }
  // A fragment, not a prefix: NVDA says "dialog" where the virtual reader says "dialog, Popup", and
  // the page still holds the previous test file's fixtures, so the cursor needs room to walk.
  for (let step = 0; step < 20; step += 1) {
    const log = await sr.phraseLog();
    if (log.some(phrase => phrase.includes(fragment))) {
      return;
    }
    // eslint-disable-next-line no-await-in-loop
    await sr.next();
  }
  throw new Error(`the reader never said anything containing "${fragment}"`);
}

/**
 * Activate the invoker.
 *
 * A real reader presses the key itself (VoiceOver through the browser's keyboard), which is a
 * trusted event and therefore a real click. The virtual reader's `press` only dispatches a
 * synthetic key event, and a synthetic `keydown` never activates a button in the DOM, so there the
 * click is made directly - the reader then reports what the overlay did to the page.
 *
 * @param {HTMLElement} invoker
 */
async function activateInvoker(invoker) {
  if (activeReader === 'virtual') {
    invoker.click();
    return;
  }
  await sr.press('Enter');
}

describe('<lion-dialog> screen reader', () => {
  before(async () => {
    activeReader = await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces the dialog and its content when the invoker opens it', async () => {
    const el = await fixtureDialog();
    const invoker = /** @type {HTMLElement} */ (el.querySelector('button[slot="invoker"]'));
    const content = /** @type {HTMLElement} */ (el.querySelector('[slot="content"]'));

    await anchorOnInvoker();
    await activateInvoker(invoker);
    // The overlay moves the focus into the dialog - that is what a user gets, and what every reader
    // follows; `opened` itself is not part of the public surface here.
    await waitUntil(
      () => content === document.activeElement || content.contains(document.activeElement),
      'the focus moves into the dialog',
    );
    // Walk to the innermost content: the dialog's own phrase comes before it, and `contains` wants
    // them in order.
    await walkUntilSpoken('Hey there');

    // The overlay, not the test, decides what the reader is told: a dialog with its accessible name.
    expect(content.getAttribute('role')).to.equal('dialog');
    expect(content.getAttribute('aria-label')).to.equal('Popup');

    // Anchor inside the dialog, which is also where the overlay put the focus: a real reader says what
    // it is *on*, and VoiceOver - unlike its promise for a modal - does not follow the focus move into
    // an overlay rendered outside the test's own subtree (in CI it stayed on the invoker and said
    // "Popup button button" while the dialog was already open and focused).
    await sr.focus('div[slot="content"]');

    await sr.expect({
      virtual: contains('dialog, Popup', 'Hey there'),
      // NVDA announces the new dialog itself ("dialog", the role), which is the part a user needs to
      // know the page changed; the following phrasing differs per reader and per run.
      nvda: containsLike('dialog'),
      voiceover: containsLike('Hey there'),
    });
  });

  it('gives the focus back to the invoker when the dialog closes', async () => {
    const el = await fixtureDialog();
    const invoker = /** @type {HTMLElement} */ (el.querySelector('button[slot="invoker"]'));
    const content = /** @type {HTMLElement} */ (el.querySelector('[slot="content"]'));

    await anchorOnInvoker();
    await activateInvoker(invoker);
    await waitUntil(
      () => content === document.activeElement || content.contains(document.activeElement),
      'the focus moves into the dialog',
    );

    await sr.press('Escape');
    await waitUntil(() => document.activeElement === invoker, 'the focus returns to the invoker');

    await anchorOnInvoker();
    await sr.expect({
      virtual: contains('button, Popup button'),
      nvda: containsLike('Popup button'),
      voiceover: containsLike('Popup button'),
    });
  });
});
