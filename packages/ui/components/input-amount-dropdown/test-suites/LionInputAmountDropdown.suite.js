import { mimicUserChangingDropdown } from '@lion/ui/input-amount-dropdown-test-helpers.js';
import { LionInputAmountDropdown } from '@lion/ui/input-amount-dropdown.js';
import sinon from 'sinon';
import {
  fixtureSync as _fixtureSync,
  fixture as _fixture,
  unsafeStatic,
  aTimeout,
  defineCE,
  expect,
  html,
} from '@open-wc/testing';

import { isActiveElement } from '../../core/test-helpers/isActiveElement.js';
import { CurrencyUtilManager } from '../src/CurrenciesManager.js';
import {
  mockCurrencyUtilManager,
  restoreCurrencyUtilManager,
} from '../test-helpers/mockCurrenciesManager.js';

/**
 * @typedef {import('../types/index.js').TemplateDataForDropdownInputAmount} TemplateDataForDropdownInputAmount
 * @typedef {HTMLSelectElement|HTMLElement & {modelValue:string}} DropdownElement
 * @typedef {import('lit').TemplateResult} TemplateResult
 */

const fixture = /** @type {(arg: string | TemplateResult) => Promise<LionInputAmountDropdown>} */ (
  _fixture
);
const fixtureSync = /** @type {(arg: string | TemplateResult) => LionInputAmountDropdown} */ (
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
 * @param {{ klass:LionInputAmountDropdown }} config
 */
// @ts-expect-error
export function runInputAmountDropdownSuite({ klass } = { klass: LionInputAmountDropdown }) {
  // @ts-ignore
  const tagName = defineCE(/** @type {* & HTMLElement} */ (class extends klass {}));
  const tag = unsafeStatic(tagName);

  describe('LionInputAmountDropdown', () => {
    beforeEach(async () => {
      // Wait till CurrencyUtilManager has been loaded
      await CurrencyUtilManager.loadComplete;
    });

    it('syncs value of dropdown on init if input has no value', async () => {
      const el = await fixture(html` <${tag}></${tag}> `);
      expect(el.value).to.equal("{ currency: 'GBP', amount: '123' }");
      expect(getDropdownValue(/** @type {DropdownElement} */ (el.refs.dropdown.value))).to.equal(
        "{ currency: 'GBP', amount: '123' }",
      );
    });

    it('syncs value of dropdown on reset if input has no value', async () => {
      const el = await fixture(html` <${tag}></${tag}> `);
      el.modelValue = "{ currency: 'EUR', amount: '123' }";
      await el.updateComplete;
      el.reset();
      await el.updateComplete;
      expect(el.modelValue).to.equal("{ currency: 'GBP', amount: '' }");
      expect(el.value).to.equal("{ currency: 'GBP', amount: '' }");
    });

    it('syncs value of dropdown on init if input has no value does not influence interaction states', async () => {
      const el = await fixture(html` <${tag}></${tag}> `);
      expect(el.dirty).to.be.false;
      expect(el.prefilled).to.be.false;
    });

    it('syncs value of dropdown on reset also resets interaction states', async () => {
      const el = await fixture(html` <${tag}></${tag}> `);
      el.modelValue = "{ currency: 'EUR', amount: '123' }";
      await el.updateComplete;

      expect(el.dirty).to.be.true;
      expect(el.prefilled).to.be.false;
      el.reset();
      await el.updateComplete;
      expect(el.dirty).to.be.false;
      expect(el.prefilled).to.be.false;
    });

    it('sets correct interaction states on init if input has a value', async () => {
      const el = await fixture(
        html` <${tag} .modelValue="${"{ currency: 'EUR', amount: '123' }"}"></${tag}> `,
      );
      expect(el.dirty).to.be.false;
      expect(el.prefilled).to.be.true;
    });

    describe('Dropdown display', () => {
      it('calls `templates.dropdown` with TemplateDataForDropdownInputAmount object', async () => {
        const el = fixtureSync(html` <${tag}
          .modelValue="${"{ currency: 'EUR', amount: '123' }"}"
          .allowedCurrencies="${['EUR', 'GBP']}"
          .preferredCurrencies="${['GBP']}"
          ></${tag}> `);
        const spy = sinon.spy(
          /** @type {typeof LionInputAmountDropdown} */ (el.constructor).templates,
          'dropdown',
        );
        await el.updateComplete;
        const dropdownNode = el.refs.dropdown.value;
        const templateDataForDropdown = /** @type {TemplateDataForDropdownInputAmount} */ (
          spy.args[0][0]
        );
        expect(templateDataForDropdown).to.eql(
          /** @type {TemplateDataForDropdownInputAmount} */ ({
            data: {
              currency: 'EUR',
              regionMetaList: [
                {
                  currencyCode: 'EUR',
                },
              ],
              regionMetaListPreferred: [
                {
                  currencyCode: 'GBP',
                },
              ],
            },
            refs: {
              dropdown: {
                labels: {
                  selectCountry: 'Select currency',
                  allCountries: 'All currencies',
                  preferredCountries: 'Suggested currencies',
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
              // @ts-expect-error [allow-protected]
              input: el._inputNode,
            },
          }),
        );
        spy.restore();
      });

      it('can override "all-countries-label"', async () => {
        const el = fixtureSync(html` <${tag}
          .preferredCurrencies="${['GBP']}"
          ></${tag}> `);
        const spy = sinon.spy(
          /** @type {typeof LionInputAmountDropdown} */ (el.constructor).templates,
          'dropdown',
        );
        // @ts-expect-error [allow-protected]
        el._allCurrenciesLabel = 'foo';
        await el.updateComplete;
        const templateDataForDropdown = /** @type {TemplateDataForDropdownInputAmount} */ (
          spy.args[0][0]
        );

        expect(templateDataForDropdown.refs.dropdown.labels.allCountries).to.eql('foo');
        spy.restore();
      });

      it('can override "preferred-countries-label"', async () => {
        const el = fixtureSync(html` <${tag}
          .preferredCurrencies="${['GBP']}"
          ></${tag}> `);
        const spy = sinon.spy(
          /** @type {typeof LionInputAmountDropdown} */ (el.constructor).templates,
          'dropdown',
        );
        // @ts-expect-error [allow-protected]
        el._preferredCountriesLabel = 'foo';
        await el.updateComplete;
        const templateDataForDropdown = /** @type {TemplateDataForDropdownInputAmount} */ (
          spy.args[0][0]
        );
        expect(templateDataForDropdown.refs.dropdown.labels.preferredCountries).to.eql('foo');
        spy.restore();
      });

      it('syncs dropdown value initially from activeRegion', async () => {
        const el = await fixture(html` <${tag} .allowedCurrencies="${['GBP']}"></${tag}> `);
        expect(getDropdownValue(/** @type {DropdownElement} */ (el.refs.dropdown.value))).to.equal(
          "{ currency: 'GBP', amount: '' }",
        );
      });

      it('syncs disabled attribute to dropdown', async () => {
        const el = await fixture(html` <${tag} disabled></${tag}> `);
        expect(/** @type {HTMLElement} */ (el.refs.dropdown.value)?.hasAttribute('disabled')).to.be
          .true;
      });

      it('disables dropdown on readonly', async () => {
        const el = await fixture(html` <${tag} readonly></${tag}> `);
        expect(/** @type {HTMLElement} */ (el.refs.dropdown.value)?.hasAttribute('disabled')).to.be
          .true;
      });

      it('renders to prefix slot in light dom', async () => {
        const el = await fixture(html` <${tag} .allowedCurrencies="${['GBP']}"></${tag}> `);
        const prefixSlot = /** @type {HTMLElement} */ (
          /** @type {HTMLElement} */ (el.refs.dropdown.value)
        );
        expect(prefixSlot.getAttribute('slot')).to.equal('prefix');
        expect(prefixSlot.slot).to.equal('prefix');
        expect(prefixSlot.parentElement).to.equal(el);
      });

      it('rerenders light dom when CurrencyUtil loaded', async () => {
        const { resolveLoaded } = mockCurrencyUtilManager();
        const el = await fixture(html` <${tag} .allowedCurrencies="${['GBP']}"></${tag}> `);
        // @ts-ignore
        const spy = sinon.spy(el, '__rerenderSlot');
        resolveLoaded(undefined);
        await aTimeout(0);
        expect(spy).to.have.been.calledWith('prefix');
        restoreCurrencyUtilManager();
        spy.restore();
      });
    });

    describe('On dropdown value change', () => {
      it('changes the currently active country code in the textbox', async () => {
        const el = await fixture(html`
          <${tag}
            .allowedCurrencies="${['GBP', 'EUR']}"
            .modelValue="{ currency: 'GBP', amount: '123' }"
          ></${tag}>
        `);
        // @ts-ignore
        mimicUserChangingDropdown(el.refs.dropdown.value, 'EUR');
        await el.updateComplete;
        expect(el.currency).to.equal('EUR');
        expect(el.modelValue).to.equal("{ currency: 'EUR', amount: '123' }");
        await el.updateComplete;
        expect(el.value).to.equal("{ currency: 'EUR', amount: '123' }");
      });

      it('changes the currently active country code in the textbox when empty', async () => {
        const el = await fixture(html` <${tag} .allowedCurrencies="${['GBP', 'EUR']}"></${tag}> `);
        el.value = '';
        // @ts-ignore
        mimicUserChangingDropdown(el.refs.dropdown.value, 'EUR');
        await el.updateComplete;
        await el.updateComplete;
        expect(el.value).to.equal("{ currency: 'EUR', amount: '' }");
      });

      it('changes the currently active country code in the textbox when invalid', async () => {
        const el = await fixture(html` <${tag} .allowedCurrencies="${['GBP', 'EUR']}"></${tag}> `);
        // @ts-ignore
        mimicUserChangingDropdown(el.refs.dropdown.value, 'JPY');
        await el.updateComplete;
        await el.updateComplete;
        expect(el.value).to.equal("{ currency: 'GBP', amount: '' }");
      });

      it('keeps focus on dropdownElement after selection if selected via unopened dropdown', async () => {
        const el = await fixture(
          html` <${tag} .allowedCurrencies="${[
            'GBP',
            'EUR',
          ]}" .modelValue="${"{ currency: 'GBP', amount: '123 }"}"></${tag}> `,
        );
        const dropdownElement = el.refs.dropdown.value;
        // @ts-ignore
        mimicUserChangingDropdown(dropdownElement, 'EUR');
        await el.updateComplete;
        // @ts-expect-error [allow-protected-in-tests]
        expect(isActiveElement(el._inputNode)).to.be.false;
      });
    });

    describe('On currency change', () => {
      it('updates dropdown value ', async () => {
        const el = await fixture(
          html` <${tag} .modelValue="${"{ currency: 'GBP', amount: '' }"}"></${tag}> `,
        );
        expect(el.currency).to.equal('EUR');
        // @ts-expect-error [allow protected]
        el._setActiveRegion('EUR');
        await el.updateComplete;
        expect(getDropdownValue(/** @type {DropdownElement} */ (el.refs.dropdown.value))).to.equal(
          'EUR',
        );
      });
    });
  });
}
