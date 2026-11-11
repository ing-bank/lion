import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import '@lion/ui/define/lion-dialog.js';

/** @typedef {import('../../dialog/src/LionDialog.js').LionDialog} LionDialog */

describe('Overlay invoker compatibility', () => {
  it('opens from an unregistered custom invoker host', async () => {
    const el = /** @type {LionDialog} */ (
      await fixture(html`
        <lion-dialog>
          <custom-invoker slot="invoker">Open</custom-invoker>
          <div slot="content">Content</div>
        </lion-dialog>
      `)
    );
    const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));
    invoker.click();
    await waitUntil(() => el.opened);
    expect(el.opened).to.be.true;
  });

  it('keeps targeting a focusable descendant when the invoker wraps a button', async () => {
    const el = /** @type {LionDialog} */ (
      await fixture(html`
        <lion-dialog>
          <div slot="invoker"><button>Open</button></div>
          <div slot="content">Content</div>
        </lion-dialog>
      `)
    );
    const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
    button.click();
    await waitUntil(() => el.opened);
    expect(el.opened).to.be.true;
    // @ts-expect-error Accessing the protected controller to verify invoker resolution.
    expect(el._overlayCtrl.invokerNode).to.equal(button);
  });
});
