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
      const appendBody = () => {
        const container = document.createElement('div');
        container.className = 'testContainer';
        container.innerHTML = `
          <p class="paragraph first">
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
          </p>
          <p class="paragraph second">
            Sagittis id consectetur purus ut faucibus pulvinar elementum integer. Ante in nibh
            mauris cursus. Et netus et malesuada fames ac turpis. Id eu nisl nunc mi ipsum. Sagittis
            orci a scelerisque purus. Placerat vestibulum lectus mauris ultrices eros in.
          </p>  
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
      const secondParagraph = /** @type {HTMLElement} */ (document.querySelector('.second'));
      const isSecondParagraphIntersectedPromise = new Promise(resolve => {
        const observer = new IntersectionObserver(
          entries => {
            if (entries[0].isIntersecting) {
              resolve(true);
            }
          },
          {
            root: null,
            threshold: [0, 0.01, 0.5, 1],
          },
        );
        observer.observe(secondParagraph);
      });

      invoker.click();
      await waitUntil(isDialogVisible);
      getCloseButton()?.click();
      await waitUntil(() => !isDialogVisible());

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

      const isSecondParagraphIntersected = await isSecondParagraphIntersectedPromise;
      expect(isSecondParagraphIntersected).to.equals(true);
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
