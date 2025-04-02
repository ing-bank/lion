import { mimicUserChangingDropdown } from '@lion/ui/input-amount-dropdown-test-helpers.js';
import { runInputAmountDropdownSuite } from '@lion/ui/input-amount-dropdown-test-suites.js';
import { LionInputAmountDropdown } from '@lion/ui/input-amount-dropdown.js';
import { aTimeout, expect, fixture } from '@open-wc/testing';
import { LionSelectRich } from '@lion/ui/select-rich.js';
import { repeat } from 'lit/directives/repeat.js';
import { LionOption } from '@lion/ui/listbox.js';
import { ref } from 'lit/directives/ref.js';
import { html } from 'lit';

import {
  mockCurrencyUtilManager,
  restoreCurrencyUtilManager,
} from '@lion/ui/input-amount-test-helpers.js';
import { isActiveElement } from '../../core/test-helpers/isActiveElement.js';
import { ScopedElementsMixin } from '../../core/src/ScopedElementsMixin.js';
import '@lion/ui/define/lion-input-amount-dropdown.js';

/**
 * @typedef {import('../types/index.js').TemplateDataForDropdownInputAmount} TemplateDataForDropdownInputAmount
 * @typedef {HTMLSelectElement|HTMLElement & {modelValue:string}} DropdownElement
 * @typedef {import('../types/index.js').RegionMeta} RegionMeta
 * @typedef {import('lit').TemplateResult} TemplateResult
 */

class WithFormControlInputAmountDropdown extends ScopedElementsMixin(LionInputAmountDropdown) {
  /**
   * @configure ScopedElementsMixin
   */
  static scopedElements = {
    ...super.scopedElements,
    'lion-select-rich': LionSelectRich,
    'lion-option': LionOption,
  };

  static templates = {
    ...(super.templates || {}),
    /**
     * @param {TemplateDataForDropdownInputAmount} templateDataForDropdown
     */
    dropdown: templateDataForDropdown => {
      const { refs, data } = templateDataForDropdown;
      // TODO: once spread directive available, use it per ref (like ref(refs?.dropdown?.ref))
      return html`
        <lion-select-rich
          ${ref(refs?.dropdown?.ref)}
          label="${refs?.dropdown?.labels?.country}"
          label-sr-only
          @model-value-changed="${refs?.dropdown?.listeners['model-value-changed']}"
          style="${refs?.dropdown?.props?.style}"
        >
          ${repeat(
            data.regionMetaList,
            regionMeta => regionMeta.regionCode,
            regionMeta => html`
              <lion-option .choiceValue="${regionMeta.regionCode}"> </lion-option>
            `,
          )}
        </lion-select-rich>
      `;
    },
  };
}

// @ts-expect-error
runInputAmountDropdownSuite();

describe('WithFormControlInputAmountDropdown', () => {
  // @ts-expect-error
  // Runs it for LionSelectRich, which uses .modelValue/@model-value-changed instead of .value/@change
  runInputAmountDropdownSuite({ klass: WithFormControlInputAmountDropdown });

  it("it doesn't set the country as modelValue, only as viewValue", async () => {
    const el = /** @type {LionInputAmountDropdown} */ (
      await fixture(html`
        <lion-input-amount-dropdown ..allowedCurrencies="${['EUR']}"></lion-input-amount-dropdown>
      `)
    );

    // @ts-expect-error [allow-protected-in-tests]
    expect(el._inputNode.value).to.equal('+31');
    expect(el.modelValue).to.equal('');
  });

  it('focuses the textbox right after selection if selected via opened dropdown if interaction-mode is mac', async () => {
    class InputAmountDropdownMac extends LionInputAmountDropdown {
      static templates = {
        ...(super.templates || {}),
        /**
         * @param {TemplateDataForDropdownInputAmount} templateDataForDropdown
         */
        dropdown: templateDataForDropdown => {
          const { refs, data } = templateDataForDropdown;
          // TODO: once spread directive available, use it per ref (like ref(refs?.dropdown?.ref))
          return html`
            <lion-select-rich
              ${ref(refs?.dropdown?.ref)}
              label="${refs?.dropdown?.labels?.country}"
              label-sr-only
              @model-value-changed="${refs?.dropdown?.listeners['model-value-changed']}"
              style="${refs?.dropdown?.props?.style}"
              interaction-mode="mac"
            >
              ${repeat(
                data.regionMetaList,
                regionMeta => regionMeta.currencyCode,
                regionMeta => html`
                  <lion-option .choiceValue="${regionMeta.currencyCode}"> </lion-option>
                `,
              )}
            </lion-select-rich>
          `;
        },
      };
    }
    customElements.define('input-amount-dropdown-mac', InputAmountDropdownMac);
    const el = /** @type {LionInputAmountDropdown} */ (
      await fixture(html`
        <input-amount-dropdown-mac
          .allowedCurrencies="${['GBP', 'EUR']}"
          .modelValue="{ currency: 'GBP', amount: '123' }"
        ></input-amount-dropdown-mac>
      `)
    );
    const dropdownElement = el.refs.dropdown.value;
    // @ts-expect-error [allow-protected-in-tests]
    if (dropdownElement?._overlayCtrl) {
      // @ts-expect-error [allow-protected-in-tests]
      dropdownElement._overlayCtrl.show();
      mimicUserChangingDropdown(dropdownElement, 'EUR');
      await el.updateComplete;
      await aTimeout(0);
      // @ts-expect-error [allow-protected-in-tests]
      expect(isActiveElement(el._inputNode)).to.be.true;
    }
  });

  it('does not focus the textbox right after selection if selected via opened dropdown if interaction-mode is windows/linux', async () => {
    class InputAmountDropdownWindows extends LionInputAmountDropdown {
      static templates = {
        ...(super.templates || {}),
        /**
         * @param {TemplateDataForDropdownInputAmount} templateDataForDropdown
         */
        dropdown: templateDataForDropdown => {
          const { refs, data } = templateDataForDropdown;
          // TODO: once spread directive available, use it per ref (like ref(refs?.dropdown?.ref))
          return html`
            <lion-select-rich
              ${ref(refs?.dropdown?.ref)}
              label="${refs?.dropdown?.labels?.country}"
              label-sr-only
              @model-value-changed="${refs?.dropdown?.listeners['model-value-changed']}"
              style="${refs?.dropdown?.props?.style}"
              interaction-mode="windows/linux"
            >
              ${repeat(
                data.regionMetaList,
                regionMeta => regionMeta.currencyCode,
                regionMeta => html`
                  <lion-option .choiceValue="${regionMeta.currencyCode}"> </lion-option>
                `,
              )}
            </lion-select-rich>
          `;
        },
      };
    }
    customElements.define('input-amount-dropdown-windows', InputAmountDropdownWindows);
    const el = /** @type {LionInputAmountDropdown} */ (
      await fixture(html`
        <input-amount-dropdown-windows
          .allowedCurrencies="${['GBP', 'EUR']}"
          .modelValue="{ currency: 'GBP', amount: '123' }"
        ></input-amount-dropdown-windows>
      `)
    );
    const dropdownElement = el.refs.dropdown.value;
    // @ts-expect-error [allow-protected-in-tests]
    if (dropdownElement?._overlayCtrl) {
      // @ts-expect-error [allow-protected-in-tests]
      dropdownElement._overlayCtrl.show();
      mimicUserChangingDropdown(dropdownElement, 'EUR');
      await el.updateComplete;
      await aTimeout(0);
      // @ts-expect-error [allow-protected-in-tests]
      expect(isActiveElement(el._inputNode)).to.be.false;
    }
  });

  describe('defaultValidators', () => {
    /** @type {(value:any) => void} */
    let resolveLoaded;
    beforeEach(() => {
      ({ resolveLoaded } = mockCurrencyUtilManager());
    });

    afterEach(() => {
      restoreCurrencyUtilManager();
    });

    it('without interaction are not called', async () => {
      const el = /** @type {LionInputAmountDropdown} */ (
        await fixture(html`
          <lion-input-amount-dropdown ..allowedCurrencies="${['EUR']}"></lion-input-amount-dropdown>
        `)
      );
      resolveLoaded(undefined);
      await aTimeout(0);
      expect(el.hasFeedbackFor).to.deep.equal([]);
    });

    it('with interaction are called', async () => {
      const el = /** @type {LionInputAmountDropdown} */ (
        await fixture(html`
          <lion-input-amount-dropdown ..allowedCurrencies="${['GBP']}"></lion-input-amount-dropdown>
        `)
      );
      el.modelValue = 'GBP';

      resolveLoaded(undefined);
      await aTimeout(0);
      expect(el.hasFeedbackFor).to.deep.equal(['error']);
    });
  });
});
