/* eslint-disable lit-a11y/no-autofocus */
import { expect, fixture as _fixture, html, waitUntil } from '@open-wc/testing';
import { sendKeys, setViewport } from '@web/test-runner-commands';
import '@lion/ui/define/lion-dialog.js';

/**
 * @typedef {import('../src/LionDialog.js').LionDialog} LionDialog
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult) => Promise<LionDialog>} */ (_fixture);

describe('lion-dialog', () => {
  describe('when dialog is opened and then closed', () => {
    it('should scroll the page vertically', async () => {
      const container = document.createElement('div');
      const appendBody = () => {
        container.className = 'testContainer';
        container.innerHTML = `
          Lorem ipsum dolor sit amet<br />
          Lorem ipsum dolor sit amet<br />
          Lorem ipsum dolor sit amet<br />
          Lorem ipsum dolor sit amet<br />
          Lorem ipsum dolor sit amet<br />
          Lorem ipsum dolor sit amet<br />
          Lorem ipsum dolor sit amet<br />
          Lorem ipsum dolor sit amet<br />
          Lorem ipsum dolor sit amet<br />
          Lorem ipsum dolor sit amet<br />
          Lorem ipsum dolor sit amet<br />
          Lorem ipsum dolor sit amet<br />
        `;
        document.body.append(container);
      };

      await setViewport({ width: 500, height: 200 });
      /**
       *
       * @param {Event} e
       * @returns
       */
      const closeButtonHandler = e =>
        e.target?.dispatchEvent(new Event('close-overlay', { bubbles: true }));
      const el = await fixture(html`
        <lion-dialog>
          <div slot="content" class="dialog">
            Hey there
            <button class="close-button" @click="${closeButtonHandler}">⨯</button>
          </div>
          <button slot="invoker">Popup button</button>
        </lion-dialog>
      `);
      appendBody();

      /**
       * @returns { Element | null | undefined }
       */
      const getDialog = () => el?.shadowRoot?.querySelector('dialog');
      // @ts-ignore
      const isDialogVisible = () => getDialog()?.checkVisibility() === true;
      /**
       * @returns { HTMLElement | null }
       */
      const getCloseButton = () => el?.querySelector('.close-button');
      const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));
      invoker.click();
      await waitUntil(isDialogVisible);
      getCloseButton()?.click();
      await waitUntil(() => !isDialogVisible());
      const containerYPositionBeforeScroll = container.getBoundingClientRect().y;

      // Scroll up until we can see the second paragraph.
      await sendKeys({
        press: 'ArrowDown',
      });
      await sendKeys({
        press: 'ArrowDown',
      });
      await sendKeys({
        press: 'ArrowDown',
      });
      await sendKeys({
        press: 'ArrowDown',
      });

      await waitUntil(() => containerYPositionBeforeScroll !== container.getBoundingClientRect().y);
      // If the code flow reaches this line it means the page got scrolled and the test is passed
      const hasScrolled = true;
      expect(hasScrolled).to.equals(true);
    });

    it('should remove "overlays-scroll-lock" CSS class from "body"', async () => {
      /**
       *
       * @param {Event} e
       * @returns
       */
      const closeButtonHandler = e =>
        e.target?.dispatchEvent(new Event('close-overlay', { bubbles: true }));
      const el = await fixture(html`
        <lion-dialog>
          <div slot="content" class="dialog">
            Hey there
            <button class="close-button" @click="${closeButtonHandler}">⨯</button>
          </div>
          <button slot="invoker">Popup button</button>
        </lion-dialog>
      `);
      /**
       * @returns { HTMLElement | null }
       */
      const getCloseButton = () => el?.querySelector('.close-button');
      /**
       * @returns { Element | null | undefined }
       */
      const getDialog = () => el?.shadowRoot?.querySelector('dialog');
      // @ts-ignore
      const isDialogVisible = () => getDialog()?.checkVisibility() === true;
      const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));
      invoker.click();
      await waitUntil(isDialogVisible);
      getCloseButton()?.click();
      await waitUntil(() => !isDialogVisible());
      expect(document.body.classList.contains('overlays-scroll-lock')).to.equals(false);
    });
  });
});
