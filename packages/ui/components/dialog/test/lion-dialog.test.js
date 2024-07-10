/* eslint-disable lit-a11y/no-autofocus */
import { expect, fixture as _fixture, html, aTimeout } from '@open-wc/testing';
import '@lion/ui/define/lion-dialog.js';

/**
 * @typedef {import('../src/LionDialog.js').LionDialog} LionDialog
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult) => Promise<LionDialog>} */ (_fixture);

describe('lion-dialog', () => {
  it('should show content on invoker click', async () => {
    const el = await fixture(html`
      <lion-dialog>
        <div slot="content" class="dialog">Hey there</div>
        <button slot="invoker">Popup button</button>
      </lion-dialog>
    `);
    const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));
    invoker.click();
    expect(el.opened).to.be.true;
  });

  it('supports nested overlays', async () => {
    const el = await fixture(html`
      <lion-dialog>
        <div slot="content">
          open nested overlay:
          <lion-dialog>
            <div slot="content">Nested content</div>
            <button id="inner-invoker" slot="invoker">nested invoker button</button>
          </lion-dialog>
        </div>
        <button id="outer-invoker" slot="invoker">invoker button</button>
      </lion-dialog>
    `);

    /** @type {HTMLButtonElement} */ (el.querySelector('#outer-invoker')).click();
    expect(el.opened).to.be.true;

    const nestedDialogEl = /** @type {LionDialog} */ (el.querySelector('lion-dialog'));
    // @ts-expect-error you're not allowed to call protected _overlayInvokerNode in public context, but for testing it's okay
    nestedDialogEl?.querySelector('#inner-invoker').click();
    expect(nestedDialogEl.opened).to.be.true;
  });

  it('sets focus on autofocused element', async () => {
    const el = await fixture(html`
      <lion-dialog>
        <button slot="invoker">invoker button</button>
        <div slot="content">
          <label for="myInput">Label</label>
          <input id="myInput" autofocus />
        </div>
      </lion-dialog>
    `);
    const invokerNode = /** @type {HTMLButtonElement} */ (el.querySelector('button[slot=invoker]'));
    invokerNode.focus();
    invokerNode.click();
    await aTimeout(300);
    const input = el.querySelector('input');
    expect(document.activeElement).to.equal(input);
  });
});
