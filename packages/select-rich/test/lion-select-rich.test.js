import { LitElement } from '@lion/core';
// @ts-expect-error
import { renderLitAsNode } from '@lion/helpers';
import { OverlayController } from '@lion/overlays';
import { LionOption } from '@lion/listbox';
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

/**
 * @param {LionSelectRich} lionSelectEl
 */
function getProtectedMembers(lionSelectEl) {
  // @ts-ignore protected members allowed in test
  const {
    _invokerNode: invoker,
    _feedbackNode: feedback,
    _labelNode: label,
    _helpTextNode: helpText,
    _listboxNode: listbox,
  } = lionSelectEl;
  return {
    invoker,
    feedback,
    label,
    helpText,
    listbox,
  };
}

describe('lion-select-rich', () => {
  it('clicking the label should focus the invoker', async () => {
    const el = /** @type {LionSelectRich} */ (await fixture(
      html` <lion-select-rich label="foo"> </lion-select-rich> `,
    ));
    expect(document.activeElement === document.body).to.be.true;
    el._labelNode.click();

    // @ts-ignore allow protected access in tests
    expect(document.activeElement === el._invokerNode).to.be.true;
  });

  it('checks the first enabled option', async () => {
    const el = /** @type {LionSelectRich} */ (await fixture(html`
      <lion-select-rich>
        <lion-option .choiceValue=${'Red'}></lion-option>
        <lion-option .choiceValue=${'Hotpink'}></lion-option>
        <lion-option .choiceValue=${'Blue'}></lion-option>
      </lion-select-rich>
    `));
    expect(el.activeIndex).to.equal(0);
    expect(el.checkedIndex).to.equal(0);
  });

  it('still has a checked value while disabled', async () => {
    const el = /** @type {LionSelectRich} */ (await fixture(html`
      <lion-select-rich disabled>
        <lion-option .choiceValue=${'Red'}>Red</lion-option>
        <lion-option .choiceValue=${'Hotpink'}>Hotpink</lion-option>
        <lion-option .choiceValue=${'Blue'}>Blue</lion-option>
      </lion-select-rich>
    `));

    expect(el.modelValue).to.equal('Red');
  });

  it('supports having no default selection initially', async () => {
    const el = /** @type {LionSelectRich} */ (await fixture(html`
      <lion-select-rich id="color" name="color" label="Favorite color" has-no-default-selected>
        <lion-option .choiceValue=${'red'}>Red</lion-option>
        <lion-option .choiceValue=${'hotpink'}>Hotpink</lion-option>
        <lion-option .choiceValue=${'teal'}>Teal</lion-option>
      </lion-select-rich>
    `));
    const { invoker } = getProtectedMembers(el);
    expect(invoker.selectedElement).to.be.undefined;
    expect(el.modelValue).to.equal('');
  });

  describe('Invoker', () => {
    it('generates an lion-select-invoker if no invoker is provided', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(
        html` <lion-select-rich> </lion-select-rich> `,
      ));

      // @ts-ignore allow protected access in tests
      expect(el._invokerNode).to.exist;
      // @ts-ignore allow protected access in tests
      expect(el._invokerNode.tagName).to.include('LION-SELECT-INVOKER');
    });

    it('sets the first option as the selectedElement if no option is checked', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(html`
        <lion-select-rich name="foo">
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
        </lion-select-rich>
      `));
      const options = el.formElements;
      // @ts-ignore allow protected access in tests
      expect(el._invokerNode.selectedElement).dom.to.equal(options[0]);
    });

    it('syncs the selected element to the invoker', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(html`
        <lion-select-rich name="foo">
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20} checked>Item 2</lion-option>
        </lion-select-rich>
      `));
      const options = el.querySelectorAll('lion-option');
      // @ts-ignore allow protected access in tests
      expect(el._invokerNode.selectedElement).dom.to.equal(options[1]);

      el.checkedIndex = 0;
      await el.updateComplete;
      // @ts-ignore allow protected access in tests
      expect(el._invokerNode.selectedElement).dom.to.equal(options[0]);
    });

    it('delegates readonly to the invoker', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(html`
        <lion-select-rich readonly>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
        </lion-select-rich>
      `));

      expect(el.hasAttribute('readonly')).to.be.true;
      // @ts-ignore allow protected access in tests
      expect(el._invokerNode.hasAttribute('readonly')).to.be.true;
    });

    it('delegates singleOption to the invoker', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(html`
        <lion-select-rich>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
        </lion-select-rich>
      `));

      expect(el.singleOption).to.be.true;
      // @ts-ignore allow protected access in tests
      expect(el._invokerNode.hasAttribute('single-option')).to.be.true;
    });

    it('updates the invoker when the selected element is the same but the modelValue was updated asynchronously', async () => {
      const tag = defineCE(
        class LionCustomOption extends LionOption {
          render() {
            return html`${this.modelValue.value}`;
          }

          createRenderRoot() {
            return this;
          }
        },
      );
      const tagString = unsafeStatic(tag);

      const firstOption = renderLitAsNode(
        html`<${tagString} checked .choiceValue=${10}></${tagString}>`,
      );

      const el = /** @type {LionSelectRich} */ (await fixture(html`
        <lion-select-rich>
          ${firstOption}
          <${tagString} .choiceValue=${20}></${tagString}>
        </lion-select-rich>
      `));

      // @ts-ignore allow protected access in tests
      expect(el._invokerNode.shadowRoot.firstElementChild.textContent).to.equal('10');

      firstOption.modelValue = { value: 30, checked: true };
      await firstOption.updateComplete;
      await el.updateComplete;
      // @ts-ignore allow protected access in tests
      expect(el._invokerNode.shadowRoot.firstElementChild.textContent).to.equal('30');
    });

    it('inherits the content width including arrow width', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(html`
        <lion-select-rich>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${10}>Item 2 with long label</lion-option>
        </lion-select-rich>
      `));
      el.opened = true;
      const options = el.formElements;
      await el.updateComplete;
      expect(el._invokerNode.clientWidth).to.equal(options[1].clientWidth);

      const newOption = /** @type {LionOption} */ (document.createElement('lion-option'));
      newOption.choiceValue = 30;
      newOption.textContent = '30 with longer label';

      el._inputNode.appendChild(newOption);
      await el.updateComplete;
      expect(el._invokerNode.clientWidth).to.equal(options[2].clientWidth);

      el._inputNode.removeChild(newOption);
      await el.updateComplete;
      expect(el._invokerNode.clientWidth).to.equal(options[1].clientWidth);
    });
  });

  describe('overlay', () => {
    it('should be closed by default', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(
        html` <lion-select-rich></lion-select-rich> `,
      ));
      expect(el.opened).to.be.false;
    });

    it('shows/hides the listbox via opened attribute', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(
        html` <lion-select-rich></lion-select-rich> `,
      ));
      el.opened = true;
      await el.updateComplete;
      // @ts-ignore allow protected access in tests
      expect(el._overlayCtrl.isShown).to.be.true;

      el.opened = false;
      await el.updateComplete;
      await el.updateComplete; // safari takes a little longer
      // @ts-ignore allow protected access in tests
      expect(el._overlayCtrl.isShown).to.be.false;
    });

    it('syncs opened state with overlay shown', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(
        html` <lion-select-rich .opened=${true}></lion-select-rich> `,
      ));
      const outerEl = /** @type {HTMLButtonElement} */ (await fixture(
        '<button>somewhere</button>',
      ));

      expect(el.opened).to.be.true;
      // a click on the button will trigger hide on outside click
      // which we then need to sync back to "opened"
      outerEl.click();
      await aTimeout(0);
      expect(el.opened).to.be.false;
    });

    it('will focus the listbox on open and invoker on close', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(
        html` <lion-select-rich></lion-select-rich> `,
      ));
      // @ts-ignore allow protected access in tests
      await el._overlayCtrl.show();
      await el.updateComplete;
      // @ts-ignore allow protected access in tests
      expect(document.activeElement === el._listboxNode).to.be.true;
      // @ts-ignore allow protected access in tests
      expect(document.activeElement === el._invokerNode).to.be.false;

      el.opened = false;
      await el.updateComplete;
      await el.updateComplete; // safari takes a little longer
      // @ts-ignore allow protected access in tests
      expect(document.activeElement === el._listboxNode).to.be.false;
      // @ts-ignore allow protected access in tests
      expect(document.activeElement === el._invokerNode).to.be.true;
    });

    it('opens the listbox with checked option as active', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(html`
        <lion-select-rich>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20} checked>Item 2</lion-option>
        </lion-select-rich>
      `));
      // @ts-ignore allow protected access in tests
      await el._overlayCtrl.show();
      await el.updateComplete;
      const options = el.formElements;

      expect(options[1].active).to.be.true;
      expect(options[1].checked).to.be.true;
    });

    it('stays closed on click if it is disabled or readonly or has a single option', async () => {
      const elReadOnly = /** @type {LionSelectRich} */ (await fixture(html`
        <lion-select-rich readonly>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20} checked>Item 2</lion-option>
        </lion-select-rich>
      `));

      const elDisabled = /** @type {LionSelectRich} */ (await fixture(html`
        <lion-select-rich disabled>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20} checked>Item 2</lion-option>
        </lion-select-rich>
      `));

      const elSingleoption = /** @type {LionSelectRich} */ (await fixture(html`
        <lion-select-rich>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
        </lion-select-rich>
      `));

      // @ts-ignore allow protected access in tests
      elReadOnly._invokerNode.click();
      await elReadOnly.updateComplete;
      expect(elReadOnly.opened).to.be.false;

      // @ts-ignore allow protected access in tests
      elDisabled._invokerNode.click();
      await elDisabled.updateComplete;
      expect(elDisabled.opened).to.be.false;

      // @ts-ignore allow protected access in tests
      elSingleoption._invokerNode.click();
      await elSingleoption.updateComplete;
      expect(elSingleoption.opened).to.be.false;
    });

    it('sets inheritsReferenceWidth to min by default', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(html`
        <lion-select-rich name="favoriteColor" label="Favorite color">
          <lion-option .choiceValue=${'red'}>Red</lion-option>
          <lion-option .choiceValue=${'hotpink'}>Hotpink</lion-option>
          <lion-option .choiceValue=${'teal'}>Teal</lion-option>
        </lion-select-rich>
      `));

      // @ts-ignore allow protected access in tests
      expect(el._overlayCtrl.inheritsReferenceWidth).to.equal('min');
      el.opened = true;
      await el.updateComplete;

      // @ts-ignore allow protected access in tests
      expect(el._overlayCtrl.inheritsReferenceWidth).to.equal('min');
    });

    it('should override the inheritsWidth prop when no default selected feature is used', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(html`
        <lion-select-rich name="favoriteColor" label="Favorite color" has-no-default-selected>
          <lion-option .choiceValue=${'red'}>Red</lion-option>
          <lion-option .choiceValue=${'hotpink'}>Hotpink</lion-option>
          <lion-option .choiceValue=${'teal'}>Teal</lion-option>
        </lion-select-rich>
      `));

      // The default is min, so we override that behavior here
      // @ts-ignore allow protected access in tests
      el._overlayCtrl.updateConfig({ inheritsReferenceWidth: 'full' });
      el._initialInheritsReferenceWidth = 'full';

      // @ts-ignore allow protected access in tests
      expect(el._overlayCtrl.inheritsReferenceWidth).to.equal('full');
      el.opened = true;
      await el.updateComplete;
      // Opens while hasNoDefaultSelected = true, so we expect an override
      // @ts-ignore allow protected access in tests
      expect(el._overlayCtrl.inheritsReferenceWidth).to.equal('min');

      // Emulate selecting hotpink, it closing, and opening it again
      el.modelValue = 'hotpink';
      el.opened = false;
      await el.updateComplete; // necessary for overlay controller to actually close and re-open
      await el.updateComplete; // safari takes a little longer
      el.opened = true;
      await el.updateComplete;
      await el.updateComplete; // safari takes a little longer

      // noDefaultSelected will now flip the override back to what was the initial reference width
      // @ts-ignore allow protected access in tests
      expect(el._overlayCtrl.inheritsReferenceWidth).to.equal('full');
    });

    it('should have singleOption only if there is exactly one option', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(html`
        <lion-select-rich>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
        </lion-select-rich>
      `));
      expect(el.singleOption).to.be.false;
      // @ts-ignore allow protected access in tests
      expect(el._invokerNode.singleOption).to.be.false;

      const optionELm = el.formElements[0];
      // @ts-ignore allow protected access in tests
      optionELm.parentNode.removeChild(optionELm);
      el.requestUpdate();
      await el.updateComplete;
      expect(el.singleOption).to.be.true;
      // @ts-ignore allow protected access in tests
      expect(el._invokerNode.singleOption).to.be.true;

      const newOption = /** @type {LionOption} */ (document.createElement('lion-option'));
      newOption.choiceValue = 30;
      el._inputNode.appendChild(newOption);
      el.requestUpdate();
      await el.updateComplete;
      expect(el.singleOption).to.be.false;
      // @ts-ignore allow protected access in tests
      expect(el._invokerNode.singleOption).to.be.false;
    });
  });

  describe('interaction-mode', () => {
    it('allows to specify an interaction-mode which determines other behaviors', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(html`
        <lion-select-rich interaction-mode="mac"> </lion-select-rich>
      `));
      expect(el.interactionMode).to.equal('mac');
    });
  });

  describe('Keyboard navigation', () => {
    it('opens the listbox with [Enter] key via click handler', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(
        html` <lion-select-rich> </lion-select-rich> `,
      ));
      // @ts-ignore allow protected access in tests
      el._invokerNode.click();
      await aTimeout(0);
      expect(el.opened).to.be.true;
    });

    it('opens the listbox with [ ](Space) key via click handler', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(
        html` <lion-select-rich> </lion-select-rich> `,
      ));
      // @ts-ignore allow protected access in tests
      el._invokerNode.click();
      await aTimeout(0);
      expect(el.opened).to.be.true;
    });

    it('closes the listbox with [Escape] key once opened', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(
        html` <lion-select-rich opened> </lion-select-rich> `,
      ));
      // @ts-ignore allow protected access in tests
      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(el.opened).to.be.false;
    });

    it('closes the listbox with [Tab] key once opened', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(
        html` <lion-select-rich opened> </lion-select-rich> `,
      ));
      // tab can only be caught via keydown
      // @ts-ignore allow protected access in tests
      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
      expect(el.opened).to.be.false;
    });
  });

  describe('Mouse navigation', () => {
    it('opens the listbox via click on invoker', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(
        html` <lion-select-rich> </lion-select-rich> `,
      ));
      expect(el.opened).to.be.false;
      // @ts-ignore allow protected access in tests
      el._invokerNode.click();
      await nextFrame(); // reflection of click takes some time
      expect(el.opened).to.be.true;
    });

    it('closes the listbox when an option gets clicked', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(html`
        <lion-select-rich opened>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
        </lion-select-rich>
      `));
      expect(el.opened).to.be.true;
      el.formElements[0].click();
      expect(el.opened).to.be.false;
    });
  });

  describe('Keyboard navigation Windows', () => {
    it('closes the listbox with [Enter] key once opened', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(
        html` <lion-select-rich opened> </lion-select-rich> `,
      ));
      // @ts-ignore allow protected access in tests
      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(el.opened).to.be.false;
    });
  });

  describe('Keyboard navigation Mac', () => {
    it('checks active item and closes the listbox with [Enter] key via click handler once opened', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(html`
        <lion-select-rich opened interaction-mode="mac">
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
        </lion-select-rich>
      `));

      // changes active but not checked
      el.activeIndex = 1;
      expect(el.checkedIndex).to.equal(0);
      // @ts-ignore allow protected access in tests
      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(el.opened).to.be.false;
      expect(el.checkedIndex).to.equal(1);
    });

    it('opens the listbox with [ArrowUp] key', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(html`
        <lion-select-rich interaction-mode="mac"> </lion-select-rich>
      `));
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
      await el.updateComplete;
      expect(el.opened).to.be.true;
    });

    it('opens the listbox with [ArrowDown] key', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(html`
        <lion-select-rich interaction-mode="mac"> </lion-select-rich>
      `));
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' }));
      await el.updateComplete;
      expect(el.opened).to.be.true;
    });
  });

  describe('Accessibility', () => {
    it('has the right references to its inner elements', async () => {
      const el = /** @type {LionSelectRich} */ (await fixture(html`
        <lion-select-rich label="age">
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
        </lion-select-rich>
      `));
      const { invoker, feedback, label, helpText } = getProtectedMembers(el);

      expect(invoker.getAttribute('aria-labelledby')).to.contain(label.id);
      expect(invoker.getAttribute('aria-labelledby')).to.contain(invoker.id);
      expect(invoker.getAttribute('aria-describedby')).to.contain(helpText.id);
      expect(invoker.getAttribute('aria-describedby')).to.contain(feedback.id);
      expect(invoker.getAttribute('aria-haspopup')).to.equal('listbox');
    });

    it('notifies when the listbox is expanded or not', async () => {
      // smoke test for overlay functionality
      const el = /** @type {LionSelectRich} */ (await fixture(
        html` <lion-select-rich> </lion-select-rich> `,
      ));
      const { invoker } = getProtectedMembers(el);

      expect(invoker.getAttribute('aria-expanded')).to.equal('false');
      el.opened = true;
      await el.updateComplete;
      await el.updateComplete; // need 2 awaits as overlay.show is an async function

      expect(invoker.getAttribute('aria-expanded')).to.equal('true');
    });
  });

  describe('Use cases', () => {
    it('keeps showing the selected item after a new item has been added in the selectedIndex position', async () => {
      const mySelectContainerTagString = defineCE(
        // @ts-expect-error
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
                ${this.colorList.map(
                  colorObj => html`
                    <lion-option .modelValue=${{ value: colorObj.value, checked: colorObj.checked }}
                      >${colorObj.label}</lion-option
                    >
                  `,
                )}
              </lion-select-rich>
            `;
          }
        },
      );
      const mySelectContainerTag = unsafeStatic(mySelectContainerTagString);
      const el = /** @type {LionSelectRich} */ (await fixture(html`
        <${mySelectContainerTag}></${mySelectContainerTag}>
      `));

      const selectRich = /** @type {LionSelectRich} */ (
        /** @type {ShadowRoot} */ (el.shadowRoot).querySelector('lion-select-rich')
      );

      const { invoker, listbox } = getProtectedMembers(selectRich);

      expect(selectRich.checkedIndex).to.equal(1);
      expect(selectRich.modelValue).to.equal('hotpink');
      expect(/** @type {LionOption} */ (invoker.selectedElement).value).to.equal('hotpink');

      const newOption = /** @type {LionOption} */ (document.createElement('lion-option'));
      newOption.modelValue = { checked: false, value: 'blue' };
      newOption.textContent = 'Blue';
      const hotpinkEl = listbox.children[1];
      hotpinkEl.insertAdjacentElement('beforebegin', newOption);

      expect(selectRich.checkedIndex).to.equal(2);
      expect(selectRich.modelValue).to.equal('hotpink');
      expect(/** @type {LionOption} */ (invoker.selectedElement).value).to.equal('hotpink');
    });
  });

  describe('Subclassers', () => {
    it('allows to override the type of overlay', async () => {
      const mySelectTagString = defineCE(
        class MySelect extends LionSelectRich {
          // @ts-expect-error
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

      const el = /** @type {LionSelectRich} */ (await fixture(html`
        <${mySelectTag} label="Favorite color" name="color">

            ${Array(2).map(
              (_, i) => html`
                <lion-option .modelValue="${{ value: i, checked: false }}">value ${i}</lion-option>
              `,
            )}

        </${mySelectTag}>
      `));
      await el.updateComplete;
      // @ts-ignore allow protected member access in tests
      expect(el._overlayCtrl.placementMode).to.equal('global');
      el.dispatchEvent(new Event('switch'));
      // @ts-ignore allow protected member access in tests
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

      const el = /** @type {LionSelectRich} */ (await fixture(html`
        <${selectTag} id="color" name="color" label="Favorite color" has-no-default-selected>

            <lion-option .choiceValue=${'red'}>Red</lion-option>
            <lion-option .choiceValue=${'hotpink'} disabled>Hotpink</lion-option>
            <lion-option .choiceValue=${'teal'}>Teal</lion-option>

        </${selectTag}>
      `));
      const { invoker } = getProtectedMembers(el);

      expect(
        /** @type {ShadowRoot} */ (invoker.shadowRoot).getElementById('content-wrapper'),
      ).dom.to.equal(`<div id="content-wrapper">Please select an option..</div>`);
      expect(el.modelValue).to.equal('');
    });
  });
});
