import { LitElement } from '@lion/core';
import '@lion/core/differentKeyEventNamesShimIE';
import { renderLitAsNode } from '@lion/helpers';
import { LionOption } from '@lion/listbox';
import '@lion/listbox/define';
import { getListboxMembers } from '@lion/listbox/test-helpers';
import { OverlayController } from '@lion/overlays';
import { mimicClick } from '@lion/overlays/test-helpers';
import { LionSelectInvoker, LionSelectRich } from '@lion/select-rich';
import '@lion/select-rich/define';
import {
  aTimeout,
  defineCE,
  expect,
  fixture as _fixture,
  html,
  nextFrame,
  unsafeStatic,
} from '@open-wc/testing';

/**
 * @typedef {import('@lion/listbox/src/LionOptions').LionOptions} LionOptions
 * @typedef {import('@lion/listbox/types/ListboxMixinTypes').ListboxHost} ListboxHost
 * @typedef {import('@lion/form-core/types/FormControlMixinTypes').FormControlHost} FormControlHost
 */

/**
 * @param { LionSelectRich } el
 */
function getSelectRichMembers(el) {
  const obj = getListboxMembers(el);
  // eslint-disable-next-line no-return-assign
  return {
    ...obj,
    // @ts-ignore [allow-protected] in test
    ...{ _invokerNode: el._invokerNode, _overlayCtrl: el._overlayCtrl },
  };
}

/**
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 */

const fixture = /** @type {(arg: TemplateResult) => Promise<LionSelectRich>} */ (_fixture);

describe('lion-select-rich', () => {
  it('clicking the label should focus the invoker', async () => {
    const el = await fixture(html` <lion-select-rich label="foo"> </lion-select-rich> `);
    expect(document.activeElement === document.body).to.be.true;
    const { _labelNode, _invokerNode } = getSelectRichMembers(el);
    _labelNode.click();

    expect(document.activeElement === _invokerNode).to.be.true;
  });

  it('checks the first enabled option', async () => {
    const el = await fixture(html`
      <lion-select-rich>
        <lion-option .choiceValue=${'Red'}></lion-option>
        <lion-option .choiceValue=${'Hotpink'}></lion-option>
        <lion-option .choiceValue=${'Blue'}></lion-option>
      </lion-select-rich>
    `);
    expect(el.activeIndex).to.equal(0);
    expect(el.checkedIndex).to.equal(0);
  });

  it('still has a checked value while disabled', async () => {
    const el = await fixture(html`
      <lion-select-rich disabled>
        <lion-option .choiceValue=${'Red'}>Red</lion-option>
        <lion-option .choiceValue=${'Hotpink'}>Hotpink</lion-option>
        <lion-option .choiceValue=${'Blue'}>Blue</lion-option>
      </lion-select-rich>
    `);

    expect(el.modelValue).to.equal('Red');
  });

  it('supports having no default selection initially', async () => {
    const el = await fixture(html`
      <lion-select-rich id="color" name="color" label="Favorite color" has-no-default-selected>
        <lion-option .choiceValue=${'red'}>Red</lion-option>
        <lion-option .choiceValue=${'hotpink'}>Hotpink</lion-option>
        <lion-option .choiceValue=${'teal'}>Teal</lion-option>
      </lion-select-rich>
    `);
    const { _invokerNode } = getSelectRichMembers(el);
    expect(_invokerNode.selectedElement).to.be.undefined;
    expect(el.modelValue).to.equal('');
  });

  describe('Invoker', () => {
    it('generates an lion-select-invoker if no invoker is provided', async () => {
      const el = await fixture(html` <lion-select-rich> </lion-select-rich> `);
      const { _invokerNode } = getSelectRichMembers(el);

      expect(_invokerNode).to.exist;
      expect(_invokerNode).to.be.instanceOf(LionSelectInvoker);
    });

    it('sets the first option as the selectedElement if no option is checked', async () => {
      const el = await fixture(html`
        <lion-select-rich name="foo">
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
        </lion-select-rich>
      `);
      const { _invokerNode } = getSelectRichMembers(el);
      const options = el.formElements;
      expect(_invokerNode.selectedElement).dom.to.equal(options[0]);
    });

    it('syncs the selected element to the invoker', async () => {
      const el = await fixture(html`
        <lion-select-rich name="foo">
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20} checked>Item 2</lion-option>
        </lion-select-rich>
      `);
      const { _invokerNode } = getSelectRichMembers(el);
      const options = el.querySelectorAll('lion-option');
      expect(_invokerNode.selectedElement).dom.to.equal(options[1]);

      el.checkedIndex = 0;
      await el.updateComplete;
      expect(_invokerNode.selectedElement).dom.to.equal(options[0]);
    });

    it('delegates readonly to the invoker', async () => {
      const el = await fixture(html`
        <lion-select-rich readonly>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
        </lion-select-rich>
      `);
      const { _invokerNode } = getSelectRichMembers(el);
      expect(el.hasAttribute('readonly')).to.be.true;
      expect(_invokerNode.hasAttribute('readonly')).to.be.true;
    });

    it('delegates singleOption to the invoker', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
        </lion-select-rich>
      `);
      const { _invokerNode } = getSelectRichMembers(el);
      expect(el.singleOption).to.be.true;
      expect(_invokerNode.hasAttribute('single-option')).to.be.true;
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

      const firstOption = /** @type {LionOption} */ (
        renderLitAsNode(html`<${tagString} checked .choiceValue=${10}></${tagString}>`)
      );

      const el = await fixture(html`
        <lion-select-rich>
          ${firstOption}
          <${tagString} .choiceValue=${20}></${tagString}>
        </lion-select-rich>
      `);

      const { _invokerNode } = getSelectRichMembers(el);
      const firstChild = /** @type {HTMLElement} */ (
        /** @type {ShadowRoot} */ (_invokerNode.shadowRoot).firstElementChild
      );
      expect(firstChild.textContent).to.equal('10');

      firstOption.modelValue = { value: 30, checked: true };
      await firstOption.updateComplete;
      await el.updateComplete;
      expect(firstChild.textContent).to.equal('30');
    });

    // FIXME: wrong values in safari/webkit even though this passes in the "real" debug browsers
    it.skip('inherits the content width including arrow width', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${10}>Item 2 with long label</lion-option>
        </lion-select-rich>
      `);
      el.opened = true;
      const options = el.formElements;
      await el.updateComplete;
      const { _invokerNode, _inputNode } = getSelectRichMembers(el);

      expect(_invokerNode.clientWidth).to.equal(options[1].clientWidth);

      const newOption = /** @type {LionOption} */ (document.createElement('lion-option'));
      newOption.choiceValue = 30;
      newOption.textContent = '30 with longer label';

      _inputNode.appendChild(newOption);
      await el.updateComplete;
      expect(_invokerNode.clientWidth).to.equal(options[2].clientWidth);

      _inputNode.removeChild(newOption);
      await el.updateComplete;
      expect(_invokerNode.clientWidth).to.equal(options[1].clientWidth);
    });
  });

  describe('overlay', () => {
    it('should be closed by default', async () => {
      const el = await fixture(html` <lion-select-rich></lion-select-rich> `);
      expect(el.opened).to.be.false;
    });

    it('shows/hides the listbox via opened attribute', async () => {
      const el = await fixture(html` <lion-select-rich></lion-select-rich> `);
      const { _overlayCtrl } = getSelectRichMembers(el);

      el.opened = true;
      await el.updateComplete;
      expect(_overlayCtrl.isShown).to.be.true;

      el.opened = false;
      await el.updateComplete;
      await el.updateComplete; // safari takes a little longer
      expect(_overlayCtrl.isShown).to.be.false;
    });

    it('syncs opened state with overlay shown', async () => {
      const el = await fixture(html` <lion-select-rich .opened=${true}></lion-select-rich> `);
      const outerEl = /** @type {HTMLButtonElement} */ (
        await _fixture('<button>somewhere</button>')
      );

      expect(el.opened).to.be.true;

      mimicClick(outerEl);
      await aTimeout(0);
      expect(el.opened).to.be.false;
    });

    it('will focus the listbox on open and invoker on close', async () => {
      const el = await fixture(html` <lion-select-rich></lion-select-rich> `);
      const { _overlayCtrl, _listboxNode, _invokerNode } = getSelectRichMembers(el);

      await _overlayCtrl.show();
      await el.updateComplete;
      expect(document.activeElement === _listboxNode).to.be.true;
      expect(document.activeElement === _invokerNode).to.be.false;

      el.opened = false;
      await el.updateComplete;
      await el.updateComplete; // safari takes a little longer
      expect(document.activeElement === _listboxNode).to.be.false;
      expect(document.activeElement === _invokerNode).to.be.true;
    });

    it('opens the listbox with checked option as active', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20} checked>Item 2</lion-option>
        </lion-select-rich>
      `);
      const { _overlayCtrl } = getSelectRichMembers(el);

      await _overlayCtrl.show();
      await el.updateComplete;
      const options = el.formElements;

      expect(options[1].active).to.be.true;
      expect(options[1].checked).to.be.true;
    });

    it('stays closed on click if it is disabled or readonly or has a single option', async () => {
      const elReadOnly = await fixture(html`
        <lion-select-rich readonly>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20} checked>Item 2</lion-option>
        </lion-select-rich>
      `);
      const { _invokerNode: _invokerNodeReadOnly } = getSelectRichMembers(elReadOnly);

      const elDisabled = await fixture(html`
        <lion-select-rich disabled>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20} checked>Item 2</lion-option>
        </lion-select-rich>
      `);
      const { _invokerNode: _invokerNodeDisabled } = getSelectRichMembers(elDisabled);

      const elSingleoption = await fixture(html`
        <lion-select-rich>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
        </lion-select-rich>
      `);
      const { _invokerNode: _invokerNodeSingleOption } = getSelectRichMembers(elSingleoption);

      _invokerNodeReadOnly.click();
      await elReadOnly.updateComplete;
      expect(elReadOnly.opened).to.be.false;

      _invokerNodeDisabled.click();
      await elDisabled.updateComplete;
      expect(elDisabled.opened).to.be.false;

      _invokerNodeSingleOption.click();
      await elSingleoption.updateComplete;
      expect(elSingleoption.opened).to.be.false;
    });

    it('sets inheritsReferenceWidth to min by default', async () => {
      const el = await fixture(html`
        <lion-select-rich name="favoriteColor" label="Favorite color">
          <lion-option .choiceValue=${'red'}>Red</lion-option>
          <lion-option .choiceValue=${'hotpink'}>Hotpink</lion-option>
          <lion-option .choiceValue=${'teal'}>Teal</lion-option>
        </lion-select-rich>
      `);
      const { _overlayCtrl } = getSelectRichMembers(el);

      expect(_overlayCtrl.inheritsReferenceWidth).to.equal('min');
      el.opened = true;
      await el.updateComplete;

      expect(_overlayCtrl.inheritsReferenceWidth).to.equal('min');
    });

    it('should override the inheritsWidth prop when no default selected feature is used', async () => {
      const el = await fixture(html`
        <lion-select-rich name="favoriteColor" label="Favorite color" has-no-default-selected>
          <lion-option .choiceValue=${'red'}>Red</lion-option>
          <lion-option .choiceValue=${'hotpink'}>Hotpink</lion-option>
          <lion-option .choiceValue=${'teal'}>Teal</lion-option>
        </lion-select-rich>
      `);

      const { _overlayCtrl } = getSelectRichMembers(el);

      // The default is min, so we override that behavior here
      _overlayCtrl.updateConfig({ inheritsReferenceWidth: 'full' });
      el._initialInheritsReferenceWidth = 'full';

      expect(_overlayCtrl.inheritsReferenceWidth).to.equal('full');
      el.opened = true;
      await el.updateComplete;
      // Opens while hasNoDefaultSelected = true, so we expect an override
      expect(_overlayCtrl.inheritsReferenceWidth).to.equal('min');

      // Emulate selecting hotpink, it closing, and opening it again
      el.modelValue = 'hotpink';
      el.opened = false;
      await el.updateComplete; // necessary for overlay controller to actually close and re-open
      await el.updateComplete; // safari takes a little longer
      el.opened = true;
      await el.updateComplete;
      await el.updateComplete; // safari takes a little longer
      await _overlayCtrl._showComplete;

      // noDefaultSelected will now flip the override back to what was the initial reference width
      expect(_overlayCtrl.inheritsReferenceWidth).to.equal('full');
    });

    it('should have singleOption only if there is exactly one option', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
        </lion-select-rich>
      `);

      const { _inputNode, _invokerNode } = getSelectRichMembers(el);

      expect(el.singleOption).to.be.false;
      expect(_invokerNode.singleOption).to.be.false;

      const optionElm = el.formElements[0];
      optionElm.parentNode.removeChild(optionElm);
      // @ts-ignore [test] we don't need args in this case
      el.requestUpdate();
      await el.updateComplete;
      expect(el.singleOption).to.be.true;
      expect(_invokerNode.singleOption).to.be.true;

      const newOption = /** @type {LionOption} */ (document.createElement('lion-option'));
      newOption.choiceValue = 30;
      _inputNode.appendChild(newOption);
      // @ts-ignore [test] allow to not provide args for testing purposes
      el.requestUpdate();
      await el.updateComplete;
      expect(el.singleOption).to.be.false;
      expect(_invokerNode.singleOption).to.be.false;
    });
  });

  describe('interaction-mode', () => {
    it('allows to specify an interaction-mode which determines other behaviors', async () => {
      const el = await fixture(html`
        <lion-select-rich interaction-mode="mac"> </lion-select-rich>
      `);
      expect(el.interactionMode).to.equal('mac');
    });
  });

  describe('Keyboard navigation', () => {
    it('opens the listbox with [Enter] key via click handler', async () => {
      const el = await fixture(html` <lion-select-rich> </lion-select-rich> `);
      const { _invokerNode } = getSelectRichMembers(el);
      _invokerNode.click();
      await aTimeout(0);
      expect(el.opened).to.be.true;
    });

    it('opens the listbox with [ ](Space) key via click handler', async () => {
      const el = await fixture(html` <lion-select-rich> </lion-select-rich> `);
      const { _invokerNode } = getSelectRichMembers(el);
      _invokerNode.click();
      await aTimeout(0);
      expect(el.opened).to.be.true;
    });

    it('closes the listbox with [Escape] key once opened', async () => {
      const el = await fixture(html` <lion-select-rich opened> </lion-select-rich> `);
      const { _listboxNode } = getSelectRichMembers(el);
      _listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(el.opened).to.be.false;
    });

    it('closes the listbox with [Tab] key once opened', async () => {
      const el = await fixture(html` <lion-select-rich opened> </lion-select-rich> `);
      // tab can only be caught via keydown
      const { _listboxNode } = getSelectRichMembers(el);
      _listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
      expect(el.opened).to.be.false;
    });
  });

  describe('Mouse navigation', () => {
    it('opens the listbox via click on invoker', async () => {
      const el = await fixture(html` <lion-select-rich> </lion-select-rich> `);
      expect(el.opened).to.be.false;
      const { _invokerNode } = getSelectRichMembers(el);
      _invokerNode.click();
      await nextFrame(); // reflection of click takes some time
      expect(el.opened).to.be.true;
    });

    it('closes the listbox when an option gets clicked', async () => {
      const el = await fixture(html`
        <lion-select-rich opened>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
        </lion-select-rich>
      `);
      expect(el.opened).to.be.true;
      el.formElements[0].click();
      expect(el.opened).to.be.false;
    });
  });

  describe('Keyboard navigation Windows', () => {
    it('closes the listbox with [Enter] key once opened', async () => {
      const el = await fixture(html` <lion-select-rich opened> </lion-select-rich> `);
      const { _listboxNode } = getSelectRichMembers(el);
      _listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(el.opened).to.be.false;
    });
  });

  describe('Keyboard navigation Mac', () => {
    it('checks active item and closes the listbox with [Enter] key via click handler once opened', async () => {
      const el = await fixture(html`
        <lion-select-rich opened interaction-mode="mac">
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
        </lion-select-rich>
      `);
      const { _listboxNode } = getSelectRichMembers(el);

      // changes active but not checked
      el.activeIndex = 1;
      expect(el.checkedIndex).to.equal(0);
      _listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(el.opened).to.be.false;
      expect(el.checkedIndex).to.equal(1);
    });

    it('opens the listbox with [ArrowUp] key', async () => {
      const el = await fixture(html`
        <lion-select-rich interaction-mode="mac"> </lion-select-rich>
      `);
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
      await el.updateComplete;
      expect(el.opened).to.be.true;
    });

    it('opens the listbox with [ArrowDown] key', async () => {
      const el = await fixture(html`
        <lion-select-rich interaction-mode="mac"> </lion-select-rich>
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
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
        </lion-select-rich>
      `);
      const { _invokerNode, _feedbackNode, _labelNode, _helpTextNode } = getSelectRichMembers(el);

      expect(_invokerNode.getAttribute('aria-labelledby')).to.contain(_labelNode.id);
      expect(_invokerNode.getAttribute('aria-labelledby')).to.contain(_invokerNode.id);
      expect(_invokerNode.getAttribute('aria-describedby')).to.contain(_helpTextNode.id);
      expect(_invokerNode.getAttribute('aria-describedby')).to.contain(_feedbackNode.id);
      expect(_invokerNode.getAttribute('aria-haspopup')).to.equal('listbox');
    });

    it('notifies when the listbox is expanded or not', async () => {
      // smoke test for overlay functionality
      const el = await fixture(html` <lion-select-rich> </lion-select-rich> `);
      const { _invokerNode } = getSelectRichMembers(el);

      expect(_invokerNode.getAttribute('aria-expanded')).to.equal('false');
      el.opened = true;
      await el.updateComplete;
      await el.updateComplete; // need 2 awaits as overlay.show is an async function

      expect(_invokerNode.getAttribute('aria-expanded')).to.equal('true');
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
      const el = await fixture(html`
        <${mySelectContainerTag}></${mySelectContainerTag}>
      `);

      const selectRich = /** @type {LionSelectRich} */ (
        /** @type {ShadowRoot} */ (el.shadowRoot).querySelector('lion-select-rich')
      );

      const { _invokerNode, _listboxNode } = getSelectRichMembers(selectRich);

      expect(selectRich.checkedIndex).to.equal(1);
      expect(selectRich.modelValue).to.equal('hotpink');
      expect(/** @type {LionOption} */ (_invokerNode.selectedElement).value).to.equal('hotpink');

      const newOption = /** @type {LionOption} */ (document.createElement('lion-option'));
      newOption.modelValue = { checked: false, value: 'blue' };
      newOption.textContent = 'Blue';
      const hotpinkEl = _listboxNode.children[1];
      hotpinkEl.insertAdjacentElement('beforebegin', newOption);

      expect(selectRich.checkedIndex).to.equal(2);
      expect(selectRich.modelValue).to.equal('hotpink');
      expect(/** @type {LionOption} */ (_invokerNode.selectedElement).value).to.equal('hotpink');
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

      const el = await fixture(html`
        <${mySelectTag} label="Favorite color" name="color">

            ${Array(2).map(
              (_, i) => html`
                <lion-option .modelValue="${{ value: i, checked: false }}">value ${i}</lion-option>
              `,
            )}

        </${mySelectTag}>
      `);
      await el.updateComplete;
      const { _overlayCtrl } = getSelectRichMembers(el);

      expect(_overlayCtrl.placementMode).to.equal('global');
      el.dispatchEvent(new Event('switch'));
      expect(_overlayCtrl.placementMode).to.equal('local');
    });

    it('supports putting a placeholder template when there is no default selection initially', async () => {
      const invokerTagName = defineCE(
        class extends LionSelectInvoker {
          _noSelectionTemplate() {
            return html` Please select an option.. `;
          }
        },
      );
      // const invokerTag = unsafeStatic(invokerTagName);

      const selectTagName = defineCE(
        class extends LionSelectRich {
          get slots() {
            return {
              ...super.slots,
              invoker: () => document.createElement(invokerTagName),
            };
          }
        },
      );
      const selectTag = unsafeStatic(selectTagName);

      const el = await fixture(html`
        <${selectTag} id="color" name="color" label="Favorite color" has-no-default-selected>

            <lion-option .choiceValue=${'red'}>Red</lion-option>
            <lion-option .choiceValue=${'hotpink'} disabled>Hotpink</lion-option>
            <lion-option .choiceValue=${'teal'}>Teal</lion-option>

        </${selectTag}>
      `);
      const { _invokerNode } = getSelectRichMembers(el);

      expect(
        /** @type {ShadowRoot} */ (_invokerNode.shadowRoot).getElementById('content-wrapper'),
      ).dom.to.equal(`<div id="content-wrapper">Please select an option..</div>`);
      expect(el.modelValue).to.equal('');
    });
  });
});
