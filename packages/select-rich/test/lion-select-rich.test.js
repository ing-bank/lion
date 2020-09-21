import { LitElement } from '@lion/core';
import { OverlayController } from '@lion/overlays';
import {
  aTimeout,
  defineCE,
  expect,
  html,
  nextFrame,
  unsafeStatic,
  fixture,
} from '@open-wc/testing';
import { LionSelectInvoker, LionSelectRich } from '../index.js';

import '@lion/core/src/differentKeyEventNamesShimIE.js';
import '@lion/listbox/lion-option.js';
import '@lion/listbox/lion-options.js';
import '../lion-select-rich.js';

describe('lion-select-rich', () => {
  it('clicking the label should focus the invoker', async () => {
    const el = await fixture(html`
      <lion-select-rich label="foo">
        <lion-options slot="input"></lion-options>
      </lion-select-rich>
    `);
    expect(document.activeElement === document.body).to.be.true;
    el._labelNode.click();
    expect(document.activeElement === el._invokerNode).to.be.true;
  });

  it('checks the first enabled option', async () => {
    const el = await fixture(html`
      <lion-select-rich>
        <lion-options slot="input">
          <lion-option .choiceValue=${'Red'}></lion-option>
          <lion-option .choiceValue=${'Hotpink'}></lion-option>
          <lion-option .choiceValue=${'Blue'}></lion-option>
        </lion-options>
      </lion-select-rich>
    `);
    expect(el.activeIndex).to.equal(1);
    expect(el.checkedIndex).to.equal(1);
  });

  it('still has a checked value while disabled', async () => {
    const el = await fixture(html`
      <lion-select-rich disabled>
        <lion-options slot="input">
          <lion-option .choiceValue=${'Red'}>Red</lion-option>
          <lion-option .choiceValue=${'Hotpink'}>Hotpink</lion-option>
          <lion-option .choiceValue=${'Blue'}>Blue</lion-option>
        </lion-options>
      </lion-select-rich>
    `);

    expect(el.modelValue).to.equal('Red');
  });

  describe('Invoker', () => {
    it('generates an lion-select-invoker if no invoker is provided', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);

      expect(el._invokerNode).to.exist;
      expect(el._invokerNode.tagName).to.include('LION-SELECT-INVOKER');
    });

    it('sets the first option as the selectedElement if no option is checked', async () => {
      const el = await fixture(html`
        <lion-select-rich name="foo">
          <lion-options slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
            <lion-option .choiceValue=${20}>Item 2</lion-option>
          </lion-options>
        </lion-select-rich>
      `);
      const options = Array.from(el.querySelectorAll('lion-option'));
      expect(el._invokerNode.selectedElement).dom.to.equal(options[0]);
    });

    it('syncs the selected element to the invoker', async () => {
      const el = await fixture(html`
        <lion-select-rich name="foo">
          <lion-options slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
            <lion-option .choiceValue=${20} checked>Item 2</lion-option>
          </lion-options>
        </lion-select-rich>
      `);
      const options = el.querySelectorAll('lion-option');
      expect(el._invokerNode.selectedElement).dom.to.equal(options[1]);

      el.checkedIndex = 0;
      await el.updateComplete;
      expect(el._invokerNode.selectedElement).dom.to.equal(options[0]);
    });

    it('delegates readonly to the invoker', async () => {
      const el = await fixture(html`
        <lion-select-rich readonly>
          <lion-options slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
            <lion-option .choiceValue=${20}>Item 2</lion-option>
          </lion-options>
        </lion-select-rich>
      `);

      expect(el.hasAttribute('readonly')).to.be.true;
      expect(el._invokerNode.hasAttribute('readonly')).to.be.true;
    });

    it('delegates singleOption to the invoker', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
          </lion-options>
        </lion-select-rich>
      `);

      expect(el.singleOption).to.be.true;
      expect(el._invokerNode.hasAttribute('single-option')).to.be.true;
    });
  });

  describe('overlay', () => {
    it('should be closed by default', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      expect(el.opened).to.be.false;
    });

    it('shows/hides the listbox via opened attribute', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      el.opened = true;
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.be.true;

      el.opened = false;
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.be.false;
    });

    it('syncs opened state with overlay shown', async () => {
      const el = await fixture(html`
        <lion-select-rich .opened=${true}>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      const outerEl = await fixture('<button>somewhere</button>');

      expect(el.opened).to.be.true;
      // a click on the button will trigger hide on outside click
      // which we then need to sync back to "opened"
      outerEl.click();
      await aTimeout();
      expect(el.opened).to.be.false;
    });

    it('will focus the listbox on open and invoker on close', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      await el._overlayCtrl.show();
      await el.updateComplete;
      expect(document.activeElement === el._listboxNode).to.be.true;
      expect(document.activeElement === el._invokerNode).to.be.false;

      el.opened = false;
      await el.updateComplete;
      expect(document.activeElement === el._listboxNode).to.be.false;
      expect(document.activeElement === el._invokerNode).to.be.true;
    });

    it('opens the listbox with checked option as active', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
            <lion-option .choiceValue=${20} checked>Item 2</lion-option>
          </lion-options>
        </lion-select-rich>
      `);
      await el._overlayCtrl.show();
      await el.updateComplete;
      const options = Array.from(el.querySelectorAll('lion-option'));

      expect(options[1].active).to.be.true;
      expect(options[1].checked).to.be.true;
    });

    it('stays closed on click if it is disabled or readonly or has a single option', async () => {
      const elReadOnly = await fixture(html`
        <lion-select-rich readonly>
          <lion-options slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
            <lion-option .choiceValue=${20} checked>Item 2</lion-option>
          </lion-options>
        </lion-select-rich>
      `);

      const elDisabled = await fixture(html`
        <lion-select-rich disabled>
          <lion-options slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
            <lion-option .choiceValue=${20} checked>Item 2</lion-option>
          </lion-options>
        </lion-select-rich>
      `);

      const elSingleoption = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
          </lion-options>
        </lion-select-rich>
      `);

      elReadOnly._invokerNode.click();
      await elReadOnly.updateComplete;
      expect(elReadOnly.opened).to.be.false;

      elDisabled._invokerNode.click();
      await elDisabled.updateComplete;
      expect(elDisabled.opened).to.be.false;

      elSingleoption._invokerNode.click();
      await elSingleoption.updateComplete;
      expect(elSingleoption.opened).to.be.false;
    });

    it('sets inheritsReferenceWidth to min by default', async () => {
      const el = await fixture(html`
        <lion-select-rich name="favoriteColor" label="Favorite color">
          <lion-options slot="input">
            <lion-option .choiceValue=${'red'}>Red</lion-option>
            <lion-option .choiceValue=${'hotpink'}>Hotpink</lion-option>
            <lion-option .choiceValue=${'teal'}>Teal</lion-option>
          </lion-options>
        </lion-select-rich>
      `);

      expect(el._overlayCtrl.inheritsReferenceWidth).to.equal('min');
      el.opened = true;
      await el.updateComplete;
      expect(el._overlayCtrl.inheritsReferenceWidth).to.equal('min');
    });

    it('should override the inheritsWidth prop when no default selected feature is used', async () => {
      const el = await fixture(html`
        <lion-select-rich name="favoriteColor" label="Favorite color" has-no-default-selected>
          <lion-options slot="input">
            <lion-option .choiceValue=${'red'}>Red</lion-option>
            <lion-option .choiceValue=${'hotpink'}>Hotpink</lion-option>
            <lion-option .choiceValue=${'teal'}>Teal</lion-option>
          </lion-options>
        </lion-select-rich>
      `);

      // The default is min, so we override that behavior here
      el._overlayCtrl.updateConfig({ inheritsReferenceWidth: 'full' });
      el._initialInheritsReferenceWidth = 'full';

      expect(el._overlayCtrl.inheritsReferenceWidth).to.equal('full');
      el.opened = true;
      await el.updateComplete;
      // Opens while hasNoDefaultSelected = true, so we expect an override
      expect(el._overlayCtrl.inheritsReferenceWidth).to.equal('min');

      // Emulate selecting hotpink, it closing, and opening it again
      el.modelValue = 'hotpink';
      el.opened = false;
      await el.updateComplete; // necessary for overlay controller to actually close and re-open
      el.opened = true;
      await el.updateComplete;

      // noDefaultSelected will now flip the override back to what was the initial reference width
      expect(el._overlayCtrl.inheritsReferenceWidth).to.equal('full');
    });

    it('should set singleOption to true when options change dynamically to 1 option', async () => {
      const elSingleoption = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
            <lion-option .choiceValue=${20}>Item 2</lion-option>
          </lion-options>
        </lion-select-rich>
      `);

      elSingleoption._invokerNode.click();
      await elSingleoption.updateComplete;
      expect(elSingleoption.singleOption).to.be.false;

      const optionELm = elSingleoption.querySelectorAll('lion-option')[0];
      optionELm.parentNode.removeChild(optionELm);
      elSingleoption.requestUpdate();

      elSingleoption._invokerNode.click();
      await elSingleoption.updateComplete;
      expect(elSingleoption.singleOption).to.be.true;
    });
  });

  describe('interaction-mode', () => {
    it('allows to specify an interaction-mode which determines other behaviors', async () => {
      const el = await fixture(html`
        <lion-select-rich interaction-mode="mac">
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      expect(el.interactionMode).to.equal('mac');
    });
  });

  describe('Keyboard navigation', () => {
    it('opens the listbox with [Enter] key via click handler', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      el._invokerNode.click();
      await aTimeout();
      expect(el.opened).to.be.true;
    });

    it('opens the listbox with [ ](Space) key via click handler', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      el._invokerNode.click();
      await aTimeout();
      expect(el.opened).to.be.true;
    });

    it('closes the listbox with [Escape] key once opened', async () => {
      const el = await fixture(html`
        <lion-select-rich opened>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(el.opened).to.be.false;
    });

    it('closes the listbox with [Tab] key once opened', async () => {
      const el = await fixture(html`
        <lion-select-rich opened>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      // tab can only be caught via keydown
      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
      expect(el.opened).to.be.false;
    });
  });

  describe('Mouse navigation', () => {
    it('opens the listbox via click on invoker', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      expect(el.opened).to.be.false;
      el._invokerNode.click();
      await nextFrame(); // reflection of click takes some time
      expect(el.opened).to.be.true;
    });

    it('closes the listbox when an option gets clicked', async () => {
      const el = await fixture(html`
        <lion-select-rich opened>
          <lion-options slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
          </lion-options>
        </lion-select-rich>
      `);
      expect(el.opened).to.be.true;
      el.querySelector('lion-option').click();
      expect(el.opened).to.be.false;
    });
  });

  describe('Keyboard navigation Windows', () => {
    it('closes the listbox with [Enter] key once opened', async () => {
      const el = await fixture(html`
        <lion-select-rich opened>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(el.opened).to.be.false;
    });
  });

  describe('Keyboard navigation Mac', () => {
    it('checks active item and closes the listbox with [Enter] key via click handler once opened', async () => {
      const el = await fixture(html`
        <lion-select-rich opened interaction-mode="mac">
          <lion-options slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
            <lion-option .choiceValue=${20}>Item 2</lion-option>
          </lion-options>
        </lion-select-rich>
      `);

      // changes active but not checked
      el.activeIndex = 1;
      expect(el.checkedIndex).to.equal(0);

      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(el.opened).to.be.false;
      expect(el.checkedIndex).to.equal(1);
    });

    it('opens the listbox with [ArrowUp] key', async () => {
      const el = await fixture(html`
        <lion-select-rich interaction-mode="mac">
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
      await el.updateComplete;
      expect(el.opened).to.be.true;
    });

    it('opens the listbox with [ArrowDown] key', async () => {
      const el = await fixture(html`
        <lion-select-rich interaction-mode="mac">
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' }));
      await el.updateComplete;
      expect(el.opened).to.be.true;
    });
  });

  describe('Accessibility', () => {
    it('has the right references to its inner elements', async () => {
      const el = await fixture(html`
        <lion-select-rich label="age">
          <lion-options slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
            <lion-option .choiceValue=${20}>Item 2</lion-option>
          </lion-options>
        </lion-select-rich>
      `);
      expect(el._invokerNode.getAttribute('aria-labelledby')).to.contain(el._labelNode.id);
      expect(el._invokerNode.getAttribute('aria-labelledby')).to.contain(el._invokerNode.id);
      expect(el._invokerNode.getAttribute('aria-describedby')).to.contain(el._helpTextNode.id);
      expect(el._invokerNode.getAttribute('aria-describedby')).to.contain(el._feedbackNode.id);
      expect(el._invokerNode.getAttribute('aria-haspopup')).to.equal('listbox');
    });

    it('notifies when the listbox is expanded or not', async () => {
      // smoke test for overlay functionality
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      expect(el._invokerNode.getAttribute('aria-expanded')).to.equal('false');
      el.opened = true;
      await el.updateComplete;
      await el.updateComplete; // need 2 awaits as overlay.show is an async function

      expect(el._invokerNode.getAttribute('aria-expanded')).to.equal('true');
    });
  });

  describe('Use cases', () => {
    it('keeps showing the selected item after a new item has been added in the selectedIndex position', async () => {
      const mySelectContainerTagString = defineCE(
        class extends LitElement {
          static get properties() {
            return {
              colorList: Array,
            };
          }

          constructor() {
            super();
            this.colorList = [
              {
                label: 'Red',
                value: 'red',
                checked: false,
              },
              {
                label: 'Hotpink',
                value: 'hotpink',
                checked: true,
              },
              {
                label: 'Teal',
                value: 'teal',
                checked: false,
              },
            ];
          }

          render() {
            return html`
              <lion-select-rich label="Favorite color" name="color">
                <lion-options slot="input">
                  ${this.colorList.map(
                    colorObj => html`
                      <lion-option
                        .modelValue=${{ value: colorObj.value, checked: colorObj.checked }}
                        >${colorObj.label}</lion-option
                      >
                    `,
                  )}
                </lion-options>
              </lion-select-rich>
            `;
          }
        },
      );
      const mySelectContainerTag = unsafeStatic(mySelectContainerTagString);
      const el = await fixture(html`
        <${mySelectContainerTag}></${mySelectContainerTag}>
      `);

      const selectRich = el.shadowRoot.querySelector('lion-select-rich');
      const invoker = selectRich._invokerNode;

      expect(selectRich.checkedIndex).to.equal(1);
      expect(selectRich.modelValue).to.equal('hotpink');
      expect(invoker.selectedElement.value).to.equal('hotpink');

      const newOption = document.createElement('lion-option');
      newOption.modelValue = { checked: false, value: 'blue' };
      newOption.textContent = 'Blue';
      const hotpinkEl = selectRich._listboxNode.children[1];
      hotpinkEl.insertAdjacentElement('beforebegin', newOption);

      expect(selectRich.checkedIndex).to.equal(2);
      expect(selectRich.modelValue).to.equal('hotpink');
      expect(invoker.selectedElement.value).to.equal('hotpink');
    });
  });

  describe('Subclassers', () => {
    it('allows to override the type of overlay', async () => {
      const mySelectTagString = defineCE(
        class MySelect extends LionSelectRich {
          _defineOverlay({ invokerNode, contentNode, contentWrapperNode }) {
            const ctrl = new OverlayController({
              placementMode: 'global',
              contentNode,
              contentWrapperNode,
              invokerNode,
            });
            this.addEventListener('switch', () => {
              ctrl.updateConfig({ placementMode: 'local' });
            });
            return ctrl;
          }
        },
      );

      const mySelectTag = unsafeStatic(mySelectTagString);

      const el = await fixture(html`
        <${mySelectTag} label="Favorite color" name="color">
          <lion-options slot="input">
            ${Array(2).map(
              (_, i) => html`
                <lion-option .modelValue="${{ value: i, checked: false }}">value ${i}</lion-option>
              `,
            )}
          </lion-options>
        </${mySelectTag}>
      `);
      await el.updateComplete;
      expect(el._overlayCtrl.placementMode).to.equal('global');
      el.dispatchEvent(new Event('switch'));
      expect(el._overlayCtrl.placementMode).to.equal('local');
    });

    it('supports putting a placeholder template when there is no default selection initially', async () => {
      const invokerTagName = defineCE(
        class extends LionSelectInvoker {
          _noSelectionTemplate() {
            return html` Please select an option.. `;
          }
        },
      );
      const invokerTag = unsafeStatic(invokerTagName);

      const selectTagName = defineCE(
        class extends LionSelectRich {
          get slots() {
            return {
              ...super.slots,
              invoker: () => document.createElement(invokerTag.d),
            };
          }
        },
      );
      const selectTag = unsafeStatic(selectTagName);

      const el = await fixture(html`
        <${selectTag} id="color" name="color" label="Favorite color" has-no-default-selected>
          <lion-options slot="input">
            <lion-option .choiceValue=${'red'}>Red</lion-option>
            <lion-option .choiceValue=${'hotpink'} disabled>Hotpink</lion-option>
            <lion-option .choiceValue=${'teal'}>Teal</lion-option>
          </lion-options>
        </${selectTag}>
      `);

      expect(el._invokerNode.shadowRoot.getElementById('content-wrapper')).dom.to.equal(
        `<div id="content-wrapper">Please select an option..</div>`,
      );
      expect(el.modelValue).to.equal('');
    });
  });
});
