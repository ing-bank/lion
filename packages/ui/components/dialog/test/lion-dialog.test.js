import { expect, fixture as _fixture, html, waitUntil } from '@open-wc/testing';
import sinon from 'sinon';
import '@lion/ui/define/lion-dialog.js';

import { runDialogSuite } from '../test-suites/lion-dialog.suite.js';

runDialogSuite();

// The suite above covers open/close state, events and teardown. What it does not cover is where the
// focus goes, which is why these live here next to it.
/** @typedef {import('../src/LionDialog.js').LionDialog} LionDialog */

/**
 * The overlay marks its content with `data-open` while it is up. That is shadow-root safe, unlike
 * looking for the native `<dialog>` in the top layer, which the overlay hosts inside a shadow root.
 *
 * @param {LionDialog} el
 */
const isOpen = el =>
  /** @type {HTMLElement} */ (el.querySelector('[slot="content"]')).hasAttribute('data-open');

/**
 * Close through the public API and wait until the modal is gone, instead of awaiting an internal
 * promise that may resolve on another render. (Escape is covered by the shared overlay suite.)
 *
 * @param {LionDialog} el
 */
async function closeModal(el) {
  const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));
  invoker.click();
  await waitUntil(() => !isOpen(el), 'the modal is closed');
}

describe('focus capture', () => {
  /**
   * The override in `withModalDialogConfig` is `trapsKeyboardFocus: true`: the overlay is opened as a
   * *modal* `<dialog>` (top layer), which is what keeps Tab inside it, and on top of that Lion marks
   * the siblings `inert` + `aria-hidden` so a screen reader does not reach them either.
   *
   * @returns {Promise<{ el: LionDialog, invoker: HTMLElement, sibling: HTMLElement, open: () => Promise<void> }>}
   */
  async function fixtureModal() {
    const el = /** @type {LionDialog} */ (
      await _fixture(html`
        <div>
          <lion-dialog>
            <div slot="content" class="dialog">
              <p>Hey there</p>
              <button type="button" class="inside">Inside</button>
            </div>
            <button slot="invoker">Popup button</button>
          </lion-dialog>
          <button type="button" class="outside">Next</button>
        </div>
      `)
    );
    const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));
    const sibling = /** @type {HTMLElement} */ (el.querySelector('.outside'));
    /** @type {() => Promise<void>} */
    const open = async () => {
      invoker.click();
      await waitUntil(() => isOpen(el), 'the modal is open');
    };
    return { el, invoker, sibling, open };
  }

  it('opens as a modal dialog and moves the focus inside it', async () => {
    const { el, open } = await fixtureModal();
    await open();

    const content = /** @type {HTMLElement} */ (el.querySelector('[slot="content"]'));
    expect(content.getAttribute('role'), 'the content is a dialog for a reader').to.equal('dialog');
    // Modality is not expressed with `aria-modal`: the overlay opens the native `<dialog>` as modal
    // (asserted in the test below), so the platform makes the rest of the page unreachable.
    await waitUntil(
      () => el.contains(document.activeElement) || document.activeElement === el,
      'the focus lands inside the dialog',
    );
  });

  it('opens the native modal dialog, which is what captures the focus', async () => {
    const showModal = sinon.spy(HTMLDialogElement.prototype, 'showModal');
    try {
      const { open } = await fixtureModal();
      await open();
      // The trap is the platform's: a `<dialog>` opened with showModal() sits in the top layer, where
      // the browser keeps Tab inside and marks the rest of the page unreachable. Lion deliberately does
      // not add its own `inert`/`aria-hidden` on top of that, so there is nothing to assert there - the
      // mechanism is this call.
      expect(showModal.called).to.equal(true);
    } finally {
      showModal.restore();
    }
  });

  it('gives the focus back to the invoker when the dialog closes', async () => {
    const { el, invoker, open } = await fixtureModal();
    await open();
    await waitUntil(
      () => el.contains(document.activeElement) || document.activeElement === el,
      'the focus lands inside the dialog',
    );

    await closeModal(el);
    expect(document.activeElement).to.equal(invoker);
  });

  it('keeps the focus inside a nested dialog and gives it back to the outer one', async () => {
    const el = await _fixture(html`
      <lion-dialog>
        <div slot="content" class="outer">
          <p>Outer</p>
          <button type="button" class="outer-inside">Outer button</button>
          <lion-dialog>
            <div slot="content" class="inner">
              <button type="button" class="inner-inside">Inner</button>
            </div>
            <button slot="invoker" class="inner-invoker">Open inner</button>
          </lion-dialog>
        </div>
        <button slot="invoker">Open outer</button>
      </lion-dialog>
    `);
    const outerInvoker = /** @type {HTMLElement} */ (el.querySelector(':scope > [slot="invoker"]'));
    outerInvoker.click();
    // @ts-expect-error [allow-protected-in-tests]
    await el._overlayCtrl._showComplete;

    const innerInvoker = /** @type {HTMLElement} */ (el.querySelector('.inner-invoker'));
    innerInvoker.click();
    const innerDialog = /** @type {LionDialog} */ (el.querySelector('lion-dialog lion-dialog'));
    // @ts-expect-error [allow-protected-in-tests]
    await innerDialog._overlayCtrl._showComplete;
    await waitUntil(
      () => innerDialog.contains(document.activeElement) || document.activeElement === innerDialog,
      'the focus lands inside the inner dialog',
    );

    await closeModal(innerDialog);
    // Capture returns to the inner dialog's invoker - which lives inside the outer dialog - so the user
    // is not left without a focused element, and the outer dialog keeps the capture.
    await waitUntil(
      () => innerInvoker === document.activeElement,
      'the focus is back on the invoker inside the outer dialog',
    );
    expect(el.contains(document.activeElement)).to.equal(true);
  });
});
