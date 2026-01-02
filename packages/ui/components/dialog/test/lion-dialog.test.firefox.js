/* eslint-disable lit-a11y/no-autofocus */
import { expect, fixture as _fixture, html, unsafeStatic, defineCE } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { LitElement } from 'lit';
import { isActiveElement } from '../../core/test-helpers/isActiveElement.js';
import '@lion/ui/define/lion-dialog.js';

/**
 * @typedef {import('../src/LionDialog.js').LionDialog} LionDialog
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult) => Promise<LionDialog>} */ (_fixture);

describe('lion-dialog', () => {
  // For some reason, globalRootNode is not cleared properly on disconnectedCallback from previous overlay test fixtures...
  // Not sure why this "bug" happens...
  beforeEach(() => {
    const globalRootNode = document.querySelector('.overlays');
    if (globalRootNode) {
      globalRootNode.innerHTML = '';
    }
  });

  describe('Dialog in Firefox', () => {
    it('should focus on the button inside the dialog', async () => {
      class DialogContent extends LitElement {
        render() {
          return html`<slot name="content"></slot>`;
        }
      }
      const tagString = defineCE(DialogContent);
      const dialogContentTag = unsafeStatic(tagString);
      const el = await fixture(html`
        <lion-dialog>
          ${html`<${dialogContentTag} slot="content" style="border: 1px solid;">
            <div slot="content">
              <p>Dialog content</p>
              <button class="ok-button">ok</button>
            </div>          
          </${dialogContentTag}>`}
          <button slot="invoker">Popup button</button>
        </lion-dialog>
      `);
      const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));
      const okButton = el.querySelector('.ok-button');
      invoker.focus();
      await sendKeys({ press: 'Enter' });
      expect(isActiveElement(el)).to.equal(true);
      await sendKeys({ press: 'Tab' });
      expect(isActiveElement(okButton)).to.equal(true);
      await sendKeys({ press: 'Tab' });
      // for some reason with the headless firefox setup,
      // once we focus on `okButton`, any further Tab presses keeps the focus on `okButton`
      expect(isActiveElement(okButton)).to.equal(true);
    });
  });
});
