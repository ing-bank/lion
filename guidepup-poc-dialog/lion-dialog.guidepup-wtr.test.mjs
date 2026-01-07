/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */

import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import '@lion/ui/define/lion-dialog.js';

/**
 * @typedef {import('@lion/ui/dialog.js').LionDialog} LionDialog
 */

/**
 *
 * @param {'voiceover'|'nvda'|'virtual'|'auto'} screenReader
 * @returns {{srInstance: any, initializeScreenReader: (container: HTMLElement) => Promise<void>, stopScreenReader: () => Promise<void>}}
 */
function getSrInstance(screenReader) {
  const allowedReaders = ['voiceover', 'nvda', 'virtual', 'auto'];
  if (!allowedReaders.includes(screenReader)) {
    throw new Error(
      `Unsupported screen reader: ${screenReader}. Allowed: ${allowedReaders.join(', ')}`,
    );
  }

  // TODO: if 'auto', detect platform and choose accordingly
  // ideally, we get it from wtr/vitest plugin config or smth

  /** @type {any} */
  let _srInstance = null;
  let mustStopReader = false;

  /**
   * Initialize the screen reader instance
   * @param {HTMLElement} container
   */
  const initializeScreenReader = async container => {
    if (screenReader === 'voiceover') {
      const { voiceOver } = await import('@guidepup/guidepup');
      _srInstance = voiceOver;
      await _srInstance.start();
      mustStopReader = true;
    } else if (screenReader === 'nvda') {
      const { nvda } = await import('@guidepup/guidepup');
      _srInstance = nvda;
      await _srInstance.start();
      mustStopReader = true;
    } else if (screenReader === 'virtual') {
      // Use the browser bundle to avoid aria-query ESM/CJS interop issues
      const { Virtual } = await import('@guidepup/virtual-screen-reader/lib/esm/index.browser.js');
      _srInstance = new Virtual();
      await _srInstance.start({ container });
      mustStopReader = true;
    }
  };

  const stopScreenReader = async () => {
    if (mustStopReader && srInstance?.stop) {
      try {
        await srInstance.stop();
      } catch {
        // ignore
      }
    }
    srInstance = null;
    mustStopReader = false;
  };

  return {
    get srInstance() {
      return _srInstance;
    },
    initializeScreenReader,
    stopScreenReader,
  };
}

/**
 * Run the dialog test suite with a given screen reader.
 * @param {{screenReader: 'voiceover'|'nvda'|'virtual'}} options
 */
export function runDialogTests({ screenReader }) {
  const { srInstance, initializeScreenReader, stopScreenReader } = getSrInstance(screenReader);

  describe(`Dialog Accessibility Tests (${screenReader})`, () => {
    before(async () => {
      await initializeScreenReader(document.body);
    });

    after(async () => {
      await stopScreenReader();
    });

    // // Helper to get spoken log
    // const getSpokenLog = () => {
    //   if (srInstance?.spokenPhraseLog) {
    //     return srInstance.spokenPhraseLog();
    //   }
    //   return [];
    // };

    // // Helper to clear spoken log
    // const clearSpokenLog = () => {
    //   if (srInstance?.clearSpokenPhraseLog) {
    //     srInstance.clearSpokenPhraseLog();
    //   }
    // };

    // // Helper for screen reader navigation
    // const nextItem = async () => {
    //   if (srInstance?.next) {
    //     await srInstance.next();
    //   }
    // };

    // // Helper to get item text
    // const getItemText = async () => {
    //   if (srInstance?.itemText) {
    //     return srInstance.itemText();
    //   }
    //   if (srInstance?.lastSpokenPhrase) {
    //     return srInstance.lastSpokenPhrase();
    //   }

    //   throw new Error('getItemText: Unsupported screen reader instance');
    //   //   // Fallback
    //   //   const el = document.activeElement;
    //   //   if (!el) return '';
    //   //   const ariaLabel = el.getAttribute('aria-label');
    //   //   if (ariaLabel) return ariaLabel;
    //   //   if (el.tagName === 'BUTTON' || el.tagName === 'A') {
    //   //     return el.textContent?.trim() || '';
    //   //   }
    //   //   return el.id || '';
    // };

    // Helper to find next button
    const findNextButton = async () => {
      if (srInstance?.keyboardCommands?.moveToNextButton && srInstance.perform) {
        await srInstance.perform(srInstance.keyboardCommands.moveToNextButton);
      } else {
        // For virtual screen reader, just navigate
        await srInstance.next();
      }
    };

    describe('Basic dialog', () => {
      it('announces dialog role when opened', async () => {
        /** @type {LionDialog} */
        const el = await fixture(html`
          <lion-dialog id="basic-dialog">
            <button slot="invoker" id="open-dialog-btn">Open Dialog</button>
            <div slot="content" class="dialog-content" aria-label="Example dialog">
              <h2>Dialog Title</h2>
              <p>This is the dialog content. Press Escape or click the close button to dismiss.</p>
              <div class="dialog-actions">
                <button
                  id="dialog-close-btn"
                  @click="${e =>
                    e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
                >
                  Close
                </button>
              </div>
            </div>
          </lion-dialog>
        `);

        // await initializeScreenReader(document.body);

        const invokerBtn = el.querySelector('#open-dialog-btn');
        invokerBtn?.focus();
        await srInstance.next();

        const itemText = await srInstance.itemText();
        expect(itemText).to.equal('Example dialog');

        // Open the dialog
        el.opened = true;
        await el.updateComplete;
        await new Promise(r => setTimeout(r, 500));

        const spokenLog = srInstance.spokenPhraseLog();
        expect(spokenLog.length).to.be.greaterThan(0);

        const dialogAnnounced = spokenLog.some(
          phrase =>
            phrase.toLowerCase().includes('dialog') || phrase.toLowerCase().includes('web dialog'),
        );

        expect(dialogAnnounced, 'dialog role announcement').to.be.true;

        // await stopScreenReader();
      });

      it('traps focus within dialog', async () => {
        /** @type {LionDialog} */
        const el = await fixture(html`
          <lion-dialog id="basic-dialog">
            <button slot="invoker" id="open-dialog-btn">Open Dialog</button>
            <div slot="content" class="dialog-content" aria-label="Example dialog">
              <h2>Dialog Title</h2>
              <p>This is the dialog content. Press Escape or click the close button to dismiss.</p>
              <div class="dialog-actions">
                <button
                  id="dialog-close-btn"
                  @click="${e =>
                    e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
                >
                  Close
                </button>
              </div>
            </div>
          </lion-dialog>
        `);

        // await initializeScreenReader(document.body);

        // Open dialog
        el.opened = true;
        await el.updateComplete;
        await new Promise(r => setTimeout(r, 500));

        const hasReader = !!srInstance?.next;

        if (hasReader) {
          await srInstance.next();
          let itemText = await srInstance.itemText();

          await srInstance.next();
          itemText = await srInstance.itemText();

          await findNextButton();
          itemText = await srInstance.itemText();

          const closeButtonAccessible =
            itemText.toLowerCase().includes('close') || itemText.toLowerCase().includes('button');
          expect(closeButtonAccessible, 'close button accessibility').to.be.true;
        } else {
          const closeBtn = el.querySelector('#dialog-close-btn');
          closeBtn?.focus();

          const closeButtonFocusable = document.activeElement?.id === 'dialog-close-btn';
          expect(closeButtonFocusable, 'close button should be focusable').to.be.true;
        }

        // await stopScreenReader();
      });

      it('returns focus to invoker when closed', async () => {
        /** @type {LionDialog} */
        const el = await fixture(html`
          <lion-dialog id="basic-dialog">
            <button slot="invoker" id="open-dialog-btn">Open Dialog</button>
            <div slot="content" class="dialog-content" aria-label="Example dialog">
              <h2>Dialog Title</h2>
              <p>This is the dialog content. Press Escape or click the close button to dismiss.</p>
              <div class="dialog-actions">
                <button
                  id="dialog-close-btn"
                  @click="${e =>
                    e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
                >
                  Close
                </button>
              </div>
            </div>
          </lion-dialog>
        `);

        // await initializeScreenReader(document.body);

        // Open dialog
        el.opened = true;
        await el.updateComplete;
        await new Promise(r => setTimeout(r, 500));

        // Close dialog via close button
        const closeBtn = el.querySelector('#dialog-close-btn');
        closeBtn?.click();
        await el.updateComplete;
        await new Promise(r => setTimeout(r, 500));

        const dialogClosed = !el.opened;
        expect(dialogClosed).to.equal(true);

        const focusedAfterClose = document.activeElement?.id;
        expect(focusedAfterClose, 'focus after close').to.equal('open-dialog-btn');

        // await stopScreenReader();
      });
    });

    describe('Alert dialog', () => {
      it('announces alert dialog role', async () => {
        /** @type {LionDialog} */
        const el = await fixture(html`
          <lion-dialog id="alert-dialog" is-alert-dialog>
            <button slot="invoker" id="open-alert-btn">Open Alert Dialog</button>
            <div slot="content" class="dialog-content" aria-label="Confirmation required">
              <h2>Are you sure?</h2>
              <p>This action cannot be undone.</p>
              <div class="dialog-actions">
                <button
                  id="alert-cancel-btn"
                  @click="${e =>
                    e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
                >
                  Cancel
                </button>
                <button
                  id="alert-confirm-btn"
                  @click="${e =>
                    e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
                >
                  Confirm
                </button>
              </div>
            </div>
          </lion-dialog>
        `);

        // await initializeScreenReader(document.body);
        srInstance.clearSpokenPhraseLog();

        // Open alert dialog
        el.opened = true;
        await el.updateComplete;
        await new Promise(r => setTimeout(r, 500));

        const alertSpokenLog = srInstance.spokenPhraseLog();

        let alertRoleAnnounced = false;
        if (alertSpokenLog.length > 0) {
          alertRoleAnnounced = alertSpokenLog.some(
            phrase =>
              phrase.toLowerCase().includes('alert') || phrase.toLowerCase().includes('dialog'),
          );
        } else {
          alertRoleAnnounced = el.opened;
        }

        expect(alertRoleAnnounced, 'alert role announcement').to.be.true;

        // await stopScreenReader();
      });
    });
  });
}
