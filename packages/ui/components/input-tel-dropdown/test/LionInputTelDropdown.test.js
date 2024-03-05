import { runInputTelSuite } from '@lion/ui/input-tel-test-suites.js';
import { repeat } from 'lit/directives/repeat.js';
import { ref } from 'lit/directives/ref.js';
import { aTimeout, expect, fixture, html } from '@open-wc/testing';
import { LionInputTelDropdown } from '@lion/ui/input-tel-dropdown.js';
import { LionOption } from '@lion/ui/listbox.js';
import { LionSelectRich } from '@lion/ui/select-rich.js';
import { runInputTelDropdownSuite } from '@lion/ui/input-tel-dropdown-test-suites.js';
import { ScopedElementsMixin } from '../../core/src/ScopedElementsMixin.js';

/**
 * @typedef {import('lit').TemplateResult} TemplateResult
 * @typedef {HTMLSelectElement|HTMLElement & {modelValue:string}} DropdownElement
 * @typedef {import('../types/index.js').TemplateDataForDropdownInputTel} TemplateDataForDropdownInputTel
 * @typedef {import('../types/index.js').RegionMeta} RegionMeta
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
            regionMeta =>
              html` <lion-option .choiceValue="${regionMeta.regionCode}"> </lion-option> `,
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
                regionMeta =>
                  html` <lion-option .choiceValue="${regionMeta.regionCode}"> </lion-option> `,
              )}
            </lion-select-rich>
          `;
        },
      };
    }
    customElements.define('input-tel-dropdown-mac', InputTelDropdownMac);
    const el = /** @type {LionInputTelDropdown} */ (
      await fixture(
        html`
          <input-tel-dropdown-mac
            .allowedRegions="${['NL', 'BE']}"
            .modelValue="${'+31612345678'}"
          ></input-tel-dropdown-mac>
        `,
      )
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
      expect(el._inputNode).to.equal(document.activeElement);
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
                regionMeta =>
                  html` <lion-option .choiceValue="${regionMeta.regionCode}"> </lion-option> `,
              )}
            </lion-select-rich>
          `;
        },
      };
    }
    customElements.define('input-tel-dropdown-windows', InputTelDropdownWindows);
    const el = /** @type {LionInputTelDropdown} */ (
      await fixture(
        html`
          <input-tel-dropdown-windows
            .allowedRegions="${['NL', 'BE']}"
            .modelValue="${'+31612345678'}"
          ></input-tel-dropdown-windows>
        `,
      )
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
      expect(el._inputNode).to.not.equal(document.activeElement);
    }
  });
});
