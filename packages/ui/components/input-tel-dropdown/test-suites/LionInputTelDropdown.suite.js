import { PhoneUtilManager } from '@lion/ui/input-tel.js';
import { mockPhoneUtilManager, restorePhoneUtilManager } from '@lion/ui/input-tel-test-helpers.js';
import {
  aTimeout,
  defineCE,
  expect,
  fixture as _fixture,
  fixtureSync as _fixtureSync,
  html,
  unsafeStatic,
} from '@open-wc/testing';
import sinon from 'sinon';
import { LionInputTelDropdown } from '@lion/ui/input-tel-dropdown.js';

/**
 * @typedef {import('lit').TemplateResult} TemplateResult
 * @typedef {HTMLSelectElement|HTMLElement & {modelValue:string}} DropdownElement
 * @typedef {import('../types/index.js').TemplateDataForDropdownInputTel} TemplateDataForDropdownInputTel
 */

const fixture = /** @type {(arg: string | TemplateResult) => Promise<LionInputTelDropdown>} */ (
  _fixture
);
const fixtureSync = /** @type {(arg: string | TemplateResult) => LionInputTelDropdown} */ (
  _fixtureSync
);

/**
 * @param {DropdownElement | HTMLSelectElement} dropdownEl
 * @returns {string}
 */
function getDropdownValue(dropdownEl) {
  if ('modelValue' in dropdownEl) {
    return dropdownEl.modelValue;
  }
  return dropdownEl.value;
}

/**
 * @param {DropdownElement} dropdownEl
 * @param {string} value
 */
function mimicUserChangingDropdown(dropdownEl, value) {
  if ('modelValue' in dropdownEl) {
    // eslint-disable-next-line no-param-reassign
    dropdownEl.modelValue = value;
    dropdownEl.dispatchEvent(
      new CustomEvent('model-value-changed', { detail: { isTriggeredByUser: true } }),
    );
  } else {
    // eslint-disable-next-line no-param-reassign
    dropdownEl.value = value;
    dropdownEl.dispatchEvent(new Event('change'));
  }
}

/**
 * @param {{ klass:LionInputTelDropdown }} config
 */
// @ts-expect-error
export function runInputTelDropdownSuite({ klass } = { klass: LionInputTelDropdown }) {
  // @ts-ignore
  const tagName = defineCE(/** @type {* & HTMLElement} */ (class extends klass {}));
  const tag = unsafeStatic(tagName);

  describe('LionInputTelDropdown', () => {
    beforeEach(async () => {
      // Wait till PhoneUtilManager has been loaded
      await PhoneUtilManager.loadComplete;
    });

    it('syncs value of dropdown on init if input has no value', async () => {
      const el = await fixture(html` <${tag}></${tag}> `);
      // await el.updateComplete;
      expect(el.activeRegion).to.equal('GB');
      expect(el.value).to.equal('+44');
      expect(getDropdownValue(/** @type {DropdownElement} */ (el.refs.dropdown.value))).to.equal(
        'GB',
      );
    });

    it('syncs value of dropdown on reset if input has no value', async () => {
      const el = await fixture(html` <${tag}></${tag}> `);
      el.modelValue = '+31612345678';
      await el.updateComplete;
      expect(el.activeRegion).to.equal('NL');
      el.reset();
      await el.updateComplete;
      expect(el.activeRegion).to.equal('GB');
      expect(el.value).to.equal('+44');
    });

    it('syncs value of dropdown on init if input has no value does not influence interaction states', async () => {
      const el = await fixture(html` <${tag}></${tag}> `);
      // TODO find out why its get dirty again
      expect(el.dirty).to.be.false;
      expect(el.prefilled).to.be.false;
    });

    it('syncs value of dropdown on reset also resets interaction states', async () => {
      const el = await fixture(html` <${tag}></${tag}> `);
      el.modelValue = '+31612345678';
      await el.updateComplete;

      expect(el.dirty).to.be.true;
      expect(el.prefilled).to.be.false;
      el.reset();
      await el.updateComplete;
      expect(el.dirty).to.be.false;
      expect(el.prefilled).to.be.false;
    });

    it('sets correct interaction states on init if input has a value', async () => {
      const el = await fixture(html` <${tag} .modelValue="${'+31612345678'}"></${tag}> `);
      expect(el.dirty).to.be.false;
      expect(el.prefilled).to.be.true;
    });

    describe('Dropdown display', () => {
      it('calls `templates.dropdown` with TemplateDataForDropdownInputTel object', async () => {
        const el = fixtureSync(html` <${tag}
          .modelValue="${'+31612345678'}"
          .allowedRegions="${['NL', 'PH']}"
          .preferredRegions="${['PH']}"
          ></${tag}> `);
        const spy = sinon.spy(
          /** @type {typeof LionInputTelDropdown} */ (el.constructor).templates,
          'dropdown',
        );
        await el.updateComplete;
        const dropdownNode = el.refs.dropdown.value;
        const templateDataForDropdown = /** @type {TemplateDataForDropdownInputTel} */ (
          spy.args[0][0]
        );
        expect(templateDataForDropdown).to.eql(
          /** @type {TemplateDataForDropdownInputTel} */ ({
            data: {
              activeRegion: 'NL',
              regionMetaList: [
                {
                  countryCode: 31,
                  flagSymbol: '🇳🇱',
                  nameForLocale: 'Netherlands',
                  nameForRegion: 'Nederland',
                  regionCode: 'NL',
                },
              ],
              regionMetaListPreferred: [
                {
                  countryCode: 63,
                  flagSymbol: '🇵🇭',
                  nameForLocale: 'Philippines',
                  nameForRegion: 'Philippines',
                  regionCode: 'PH',
                },
              ],
            },
            refs: {
              dropdown: {
                labels: {
                  selectCountry: 'Select country',
                  allCountries: 'All countries',
                  preferredCountries: 'Suggested countries',
                },
                listeners: {
                  // @ts-expect-error [allow-protected]
                  change: el._onDropdownValueChange,
                  // @ts-expect-error [allow-protected]
                  'model-value-changed': el._onDropdownValueChange,
                },
                props: { style: 'height: 100%;' },
                ref: { value: dropdownNode },
              },
            },
          }),
        );
        spy.restore();
      });

      it('can override "all-countries-label"', async () => {
        const el = fixtureSync(html` <${tag}
          .preferredRegions="${['PH']}"
          ></${tag}> `);
        const spy = sinon.spy(
          /** @type {typeof LionInputTelDropdown} */ (el.constructor).templates,
          'dropdown',
        );
        // @ts-expect-error [allow-protected]
        el._allCountriesLabel = 'foo';
        await el.updateComplete;
        const templateDataForDropdown = /** @type {TemplateDataForDropdownInputTel} */ (
          spy.args[0][0]
        );

        expect(templateDataForDropdown.refs.dropdown.labels.allCountries).to.eql('foo');
        spy.restore();
      });

      it('can override "preferred-countries-label"', async () => {
        const el = fixtureSync(html` <${tag}
          .preferredRegions="${['PH']}"
          ></${tag}> `);
        const spy = sinon.spy(
          /** @type {typeof LionInputTelDropdown} */ (el.constructor).templates,
          'dropdown',
        );
        // @ts-expect-error [allow-protected]
        el._preferredCountriesLabel = 'foo';
        await el.updateComplete;
        const templateDataForDropdown = /** @type {TemplateDataForDropdownInputTel} */ (
          spy.args[0][0]
        );
        expect(templateDataForDropdown.refs.dropdown.labels.preferredCountries).to.eql('foo');
        spy.restore();
      });

      it('syncs dropdown value initially from activeRegion', async () => {
        const el = await fixture(html` <${tag} .allowedRegions="${['DE']}"></${tag}> `);
        expect(getDropdownValue(/** @type {DropdownElement} */ (el.refs.dropdown.value))).to.equal(
          'DE',
        );
      });

      it('syncs disabled attribute to dropdown', async () => {
        const el = await fixture(html` <${tag} disabled></${tag}> `);
        expect(el.refs.dropdown.value?.hasAttribute('disabled')).to.be.true;
      });

      it('disables dropdown on readonly', async () => {
        const el = await fixture(html` <${tag} readonly></${tag}> `);
        expect(el.refs.dropdown.value?.hasAttribute('disabled')).to.be.true;
      });

      it('renders to prefix slot in light dom', async () => {
        const el = await fixture(html` <${tag} .allowedRegions="${['DE']}"></${tag}> `);
        const prefixSlot = /** @type {HTMLElement} */ (
          /** @type {HTMLElement} */ (el.refs.dropdown.value).parentElement
        );
        expect(prefixSlot.getAttribute('slot')).to.equal('prefix');
        expect(prefixSlot.slot).to.equal('prefix');
        expect(prefixSlot.parentElement).to.equal(el);
      });

      it('rerenders light dom when PhoneUtil loaded', async () => {
        const { resolveLoaded } = mockPhoneUtilManager();
        const el = await fixture(html` <${tag} .allowedRegions="${['DE']}"></${tag}> `);
        // @ts-ignore
        const spy = sinon.spy(el, '__rerenderSlot');
        resolveLoaded(undefined);
        await aTimeout(0);
        expect(spy).to.have.been.calledWith('prefix');
        restorePhoneUtilManager();
        spy.restore();
      });
    });

    describe('On dropdown value change', () => {
      it('changes the currently active country code in the textbox', async () => {
        const el = await fixture(html`
          <${tag}
            .allowedRegions="${['NL', 'BE']}"
            .modelValue="${'+31612345678'}"
          ></${tag}>
        `);
        // @ts-ignore
        mimicUserChangingDropdown(el.refs.dropdown.value, 'BE');
        await el.updateComplete;
        expect(el.activeRegion).to.equal('BE');
        expect(el.modelValue).to.equal('+32612345678');
        await el.updateComplete;
        expect(el.value).to.equal('+32612345678');
      });

      it('changes the currently active country code in the textbox when empty', async () => {
        const el = await fixture(html` <${tag} .allowedRegions="${['NL', 'BE']}"></${tag}> `);
        el.value = '';
        // @ts-ignore
        mimicUserChangingDropdown(el.refs.dropdown.value, 'BE');
        await el.updateComplete;
        await el.updateComplete;
        expect(el.value).to.equal('+32');
      });

      it('changes the currently active country code in the textbox when empty with parentheses', async () => {
        const el = await fixture(
          html` <${tag} format-country-code-style="parentheses" .allowedRegions="${[
            'NL',
            'BE',
          ]}"></${tag}> `,
        );
        el.value = '';
        // @ts-ignore
        mimicUserChangingDropdown(el.refs.dropdown.value, 'BE');
        await el.updateComplete;
        await el.updateComplete;
        expect(el.value).to.equal('(+32)');
      });

      it('changes the currently active country code in the textbox when invalid', async () => {
        const el = await fixture(html` <${tag} .allowedRegions="${['NL', 'BE']}"></${tag}> `);
        el.value = '+3';
        // @ts-ignore
        mimicUserChangingDropdown(el.refs.dropdown.value, 'BE');
        await el.updateComplete;
        await el.updateComplete;
        expect(el.value).to.equal('+32');
      });

      it('changes the currently active country code in the textbox when invalid and small part of phone number', async () => {
        const el = await fixture(html` <${tag} .allowedRegions="${['NL', 'BE']}"></${tag}> `);
        el.value = '+3 2';
        // @ts-ignore
        mimicUserChangingDropdown(el.refs.dropdown.value, 'BE');
        await el.updateComplete;
        await el.updateComplete;
        expect(el.value).to.equal('+32 2');
      });

      it('changes the currently active country code in the textbox when invalid and bigger part of phone number', async () => {
        const el = await fixture(html` <${tag} .allowedRegions="${['NL', 'BE']}"></${tag}> `);
        el.value = '+3 612345678';
        // @ts-ignore
        mimicUserChangingDropdown(el.refs.dropdown.value, 'BE');
        await el.updateComplete;
        await el.updateComplete;

        expect(el.value).to.equal('+32 612345678');
      });

      it('changes the currently phonenumber completely in the textbox when not sure what to replace', async () => {
        const el = await fixture(html` <${tag} .allowedRegions="${['NL', 'BE']}""></${tag}> `);
        el.value = '+9912345678';
        // @ts-ignore
        mimicUserChangingDropdown(el.refs.dropdown.value, 'BE');
        await el.updateComplete;
        await el.updateComplete;
        expect(el.value).to.equal('+32');
      });

      it('focuses the textbox right after selection if selected via opened dropdown', async () => {
        const el = await fixture(
          html` <${tag} .allowedRegions="${[
            'NL',
            'BE',
          ]}" .modelValue="${'+31612345678'}"></${tag}> `,
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

      it('keeps focus on dropdownElement after selection if selected via unopened dropdown', async () => {
        const el = await fixture(
          html` <${tag} .allowedRegions="${[
            'NL',
            'BE',
          ]}" .modelValue="${'+31612345678'}"></${tag}> `,
        );
        const dropdownElement = el.refs.dropdown.value;
        // @ts-ignore
        mimicUserChangingDropdown(dropdownElement, 'BE');
        await el.updateComplete;
        // @ts-expect-error [allow-protected-in-tests]
        expect(el._inputNode).to.not.equal(document.activeElement);
      });
    });

    describe('On activeRegion change', () => {
      it('updates dropdown value ', async () => {
        const el = await fixture(html` <${tag} .modelValue="${'+31612345678'}"></${tag}> `);
        expect(el.activeRegion).to.equal('NL');
        // @ts-expect-error [allow protected]
        el._setActiveRegion('BE');
        await el.updateComplete;
        expect(getDropdownValue(/** @type {DropdownElement} */ (el.refs.dropdown.value))).to.equal(
          'BE',
        );
      });

      it('keeps dropdown value if countryCode is the same', async () => {
        const el = await fixture(html` <${tag} .modelValue="${'+12345678901'}"></${tag}> `);
        expect(el.activeRegion).to.equal('US');
        // @ts-expect-error [allow-protected-in test]
        el._setActiveRegion('AG'); // Also +1
        await el.updateComplete;
        expect(getDropdownValue(/** @type {DropdownElement} */ (el.refs.dropdown.value))).to.equal(
          'US',
        );
      });
    });

    describe('is empthy', () => {
      it('ignores initial countrycode', async () => {
        const el = await fixture(html` <${tag}></${tag}> `);
        // @ts-ignore
        expect(el._isEmpty()).to.be.true;
      });

      it('ignores initial countrycode with parentheses', async () => {
        const el = await fixture(html` <${tag} format-country-code-style="parentheses"></${tag}> `);
        // @ts-ignore
        expect(el._isEmpty()).to.be.true;
      });
    });
  });
}
