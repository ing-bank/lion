import { expect, html, fixture, aTimeout } from '@open-wc/testing';
import '@lion/ui/define/lion-dialog.js';
import '@lion/ui/define/lion-button.js';
import '@lion/ui/define/lion-input.js';
import '@lion/ui/define/lion-input-date.js';
import '@lion/ui/define/lion-textarea.js';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-checkbox.js';
import '@lion/ui/define/lion-radio-group.js';
import '@lion/ui/define/lion-radio.js';
import { Required, MinLength } from '@lion/ui/form-core.js';

/**
 * @typedef {import('../src/LionDialog.js').LionDialog} LionDialog
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
// const fixture = /** @type {(arg: TemplateResult) => Promise<LionDialog>} */ (_fixture);

describe('lion-dialog scroll position bug #2558', () => {
  beforeEach(() => {
    const globalRootNode = document.querySelector('.overlays');
    if (globalRootNode) {
      globalRootNode.innerHTML = '';
    }
  });

  it('should restore original scroll position after closing dialog with form elements', async () => {
    // Create sufficient page height to allow scrolling
    const parentNode = document.createElement('div');
    parentNode.style.height = '2000px';
    parentNode.style.width = '100%';
    parentNode.innerHTML = `
      <p>↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓<br>
      ↓↓↓↓↓</p>`;
    document.body.appendChild(parentNode);

    await fixture(
      html` <lion-dialog id="test-dialog">
        <button id="test-dialog-invoker" slot="invoker">Open Form Dialog</button>
        <div slot="content">
          <h2>Form Dialog</h2>
          <lion-input
            name="firstName"
            label="First Name"
            .validators="${[new Required()]}"
          ></lion-input>
          <lion-input-date
            name="date"
            label="Date of application"
            .modelValue="${new Date('2000-12-12')}"
          ></lion-input-date>
          <lion-textarea
            name="bio"
            label="Biography"
            .validators="${[new MinLength(10)]}"
            help-text="Please enter at least 10 characters"
          ></lion-textarea>
          <lion-checkbox-group
            label="What do you like?"
            name="checkers"
            .validators="${[new Required()]}"
          >
            <lion-checkbox .choiceValue="${'foo'}" label="I like foo"></lion-checkbox>
            <lion-checkbox .choiceValue="${'bar'}" label="I like bar"></lion-checkbox>
          </lion-checkbox-group>
          <lion-radio-group name="options" label="Choose option" .validators="${[new Required()]}">
            <lion-radio .choiceValue="${'option1'}" label="Option 1"></lion-radio>
            <lion-radio .choiceValue="${'option2'}" label="Option 2"></lion-radio>
          </lion-radio-group>
        </div>
      </lion-dialog>`,
      { parentNode },
    );
    const dialog = /** @type {LionDialog} */ (parentNode.querySelector('lion-dialog'));
    const invoker = /** @type {HTMLElement} */ (parentNode.querySelector('#test-dialog-invoker'));
    invoker.scrollIntoView();
    await aTimeout(50); // Wait for scroll to settle
    // Store original scroll position (pixels from top of document)
    const originalScroll = window.pageYOffset;
    // Ensure the page actually scrolled
    expect(originalScroll).to.be.above(0);

    // Open dialog
    invoker.click();
    // @ts-expect-error [allow-protected-in-tests]
    await dialog._overlayCtrl._showComplete;
    expect(dialog.opened).to.be.true;

    // Close dialog
    dialog.opened = false;
    // @ts-expect-error [allow-protected-in-tests]
    await dialog._overlayCtrl._hideComplete;
    await aTimeout(50); // Wait for scroll restoration

    // ASSERTION: check scroll restored to original position
    // Bug #2558 caused the scroll to be reset to 0 or an incorrect value
    expect(window.pageYOffset).to.equal(
      originalScroll,
      'Scroll position should be restored to original value after dialog close',
    );
  });
});
