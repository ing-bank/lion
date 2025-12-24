import { describe, it } from 'vitest';
import { runInputTelDropdownSuite } from '@lion/ui/input-tel-dropdown-test-suites.js';
import { LionInputTelDropdown } from '@lion/ui/input-tel-dropdown.js';
import { runInputTelSuite } from '@lion/ui/input-tel-test-suites.js';
import { LionSelectRich } from '@lion/ui/select-rich.js';
import { repeat } from 'lit/directives/repeat.js';
import { LionOption } from '@lion/ui/listbox.js';
import { ref } from 'lit/directives/ref.js';
import { html } from 'lit';
import { aTimeout, fixture } from '@open-wc/testing-helpers';
import { mimicUserChangingDropdown } from '../../input-amount-dropdown/test-helpers/mimicUserChangingDropdown.js';
import {
  mockPhoneUtilManager,
  restorePhoneUtilManager,
} from '../../input-tel/test-helpers/mockPhoneUtilManager.js';
import { expect } from '../../../test-helpers.js';

import { isActiveElement } from '../../core/test-helpers/isActiveElement.js';
import { ScopedElementsMixin } from '../../core/src/ScopedElementsMixin.js';
import '@lion/ui/define/lion-input-tel-dropdown.js';

/**
 * @typedef {import('../types/index.js').TemplateDataForDropdownInputTel} TemplateDataForDropdownInputTel
 * @typedef {HTMLSelectElement|HTMLElement & {modelValue:string}} DropdownElement
 * @typedef {import('../types/index.js').RegionMeta} RegionMeta
 * @typedef {import('lit').TemplateResult} TemplateResult
 */

class WithFormControlInputTelDropdown extends ScopedElementsMixin(LionInputTelDropdown) {
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
     * @param {TemplateDataForDropdownInputTel} templateDataForDropdown
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
runInputTelSuite({ klass: LionInputTelDropdown });
runInputTelDropdownSuite();

describe('WithFormControlInputTelDropdown', () => {
  // @ts-expect-error
  // Runs it for LionSelectRich, which uses .modelValue/@model-value-changed instead of .value/@change
  runInputTelDropdownSuite({ klass: WithFormControlInputTelDropdown });

  it("it doesn't set the country as modelValue, only as viewValue", async () => {
    const el = /** @type {LionInputTelDropdown} */ (
      await fixture(html`
        <lion-input-tel-dropdown .allowedRegions="${['NL']}"></lion-input-tel-dropdown>
      `)
    );

    // @ts-expect-error [allow-protected-in-tests]
    expect(el._inputNode.value).to.equal('+31');
    expect(el.modelValue).to.equal('');
  });

  it('focuses the textbox right after selection if selected via opened dropdown if interaction-mode is mac', async () => {
    class InputTelDropdownMac extends LionInputTelDropdown {
      static templates = {
        ...(super.templates || {}),
        /**
         * @param {TemplateDataForDropdownInputTel} templateDataForDropdown
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
    customElements.define('input-tel-dropdown-mac', InputTelDropdownMac);
    const el = /** @type {LionInputTelDropdown} */ (
      await fixture(html`
        <input-tel-dropdown-mac
          .allowedRegions="${['NL', 'BE']}"
          .modelValue="${'+31612345678'}"
        ></input-tel-dropdown-mac>
      `)
    );
    const dropdownElement = el.refs.dropdown.value;
    // @ts-expect-error [allow-protected-in-tests]
    if (dropdownElement?._overlayCtrl) {
      // @ts-expect-error [allow-protected-in-tests]
      dropdownElement._overlayCtrl.show();
      mimicUserChangingDropdown(dropdownElement, 'BE');
      await el.updateComplete;
      await aTimeout(0);
      // @ts-expect-error [allow-protected-in-tests]
      expect(isActiveElement(el._inputNode)).to.be.true;
    }
  });

  it('does not focus the textbox right after selection if selected via opened dropdown if interaction-mode is windows/linux', async () => {
    class InputTelDropdownWindows extends LionInputTelDropdown {
      static templates = {
        ...(super.templates || {}),
        /**
         * @param {TemplateDataForDropdownInputTel} templateDataForDropdown
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
    customElements.define('input-tel-dropdown-windows', InputTelDropdownWindows);
    const el = /** @type {LionInputTelDropdown} */ (
      await fixture(html`
        <input-tel-dropdown-windows
          .allowedRegions="${['NL', 'BE']}"
          .modelValue="${'+31612345678'}"
        ></input-tel-dropdown-windows>
      `)
    );
    const dropdownElement = el.refs.dropdown.value;
    // @ts-expect-error [allow-protected-in-tests]
    if (dropdownElement?._overlayCtrl) {
      // @ts-expect-error [allow-protected-in-tests]
      dropdownElement._overlayCtrl.show();
      mimicUserChangingDropdown(dropdownElement, 'BE');
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
      ({ resolveLoaded } = mockPhoneUtilManager());
    });

    afterEach(() => {
      restorePhoneUtilManager();
    });

    it('without interaction are not called', async () => {
      const el = /** @type {LionInputTelDropdown} */ (
        await fixture(html`
          <lion-input-tel-dropdown .allowedRegions="${['NL']}"></lion-input-tel-dropdown>
        `)
      );
      resolveLoaded(undefined);
      await aTimeout(0);
      expect(el.hasFeedbackFor).to.deep.equal([]);
    });

    it('with interaction are called', async () => {
      const el = /** @type {LionInputTelDropdown} */ (
        await fixture(html`
          <lion-input-tel-dropdown .allowedRegions="${['NL']}"></lion-input-tel-dropdown>
        `)
      );
      el.modelValue = '+31 6';

      resolveLoaded(undefined);
      await aTimeout(0);
      expect(el.hasFeedbackFor).to.deep.equal(['error']);
    });
  });
});
