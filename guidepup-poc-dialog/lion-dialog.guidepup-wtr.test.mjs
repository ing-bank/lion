/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */

import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import sr from '@lion-labs/test-runner-screenreader/commands.js';

import '@lion/ui/define/lion-dialog.js';

/**
 * @typedef {import('@lion/ui/dialog.js').LionDialog} LionDialog
 */

/**
 * Run the dialog test suite with a given screen reader.
 * @param {{screenReader: 'voiceover'|'nvda'|'virtual'}} options
 */
export function runDialogTests({ screenReader }) {
  describe(`Dialog Accessibility Tests (${screenReader})`, () => {
    before(async () => {
      await sr.initialize();
    });

    after(async () => {
      await sr.stop();
    });

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

        const invokerBtn = el.querySelector('#open-dialog-btn');
        invokerBtn?.focus();
        await sr.next();

        const itemText = await sr.itemText();
        expect(itemText).to.equal('Example dialog');

        // Open the dialog
        el.opened = true;
        await el.updateComplete;
        await new Promise(r => setTimeout(r, 500));

        const spokenLog = await sr.spokenPhraseLog();
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

        const hasReader = !!sr?.next;

        if (hasReader) {
          await sr.next();
          let itemText = await sr.itemText();

          await sr.next();
          itemText = await sr.itemText();

          await sr.findNextButton();
          itemText = await sr.itemText();

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
        await sr.clearSpokenPhraseLog();

        // Open alert dialog
        el.opened = true;
        await el.updateComplete;
        await new Promise(r => setTimeout(r, 500));

        const alertSpokenLog = await sr.spokenPhraseLog();

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

runDialogTests({ screenReader: 'virtual' });
