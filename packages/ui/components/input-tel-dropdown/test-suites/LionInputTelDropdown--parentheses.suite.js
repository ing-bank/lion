/**
 * The tests suites for the components that have `this.formatCountryCodeStyle = 'parentheses';`
 */

import { LionInputTelDropdown } from '@lion/ui/input-tel-dropdown.js';
import { PhoneUtilManager } from '@lion/ui/input-tel.js';
import { sendKeys, selectOption } from '@web/test-runner-commands';
import {
  expect,
  defineCE,
  unsafeStatic,
  fixture as _fixture,
  html,
  waitUntil,
} from '@open-wc/testing';

/**
 * @typedef {import('lit').TemplateResult} TemplateResult
 * @typedef {import('./types.js').TelDropdownConfig} TelDropdownConfig
 */

const fixture = /** @type {(arg: string | TemplateResult) => Promise<LionInputTelDropdown>} */ (
  _fixture
);

/**
 * @type {TelDropdownConfig}
 */
const telDropdownConfig = {
  getTelDropdownInvokerEl: el => el.querySelector('select'),
  selectNlOption: async () => {
    await selectOption({ selector: 'select', value: 'NL' });
  },
};

/**
 * @param {{ klass:LionInputTelDropdown, config: {} }} config
 */
export function runInputTelDropdownParenthesesSuite({
  // @ts-ignore
  klass = LionInputTelDropdown,
  config = telDropdownConfig,
}) {
  // @ts-ignore
  const tagName = defineCE(/** @type {* & HTMLElement} */ (class extends klass {}));
  const tag = unsafeStatic(tagName);

  describe('LionInputTelDropdown suite with `parentheses`', () => {
    /**
     * @type {LionInputTelDropdown}
     */
    let el;
    beforeEach(async () => {
      // Wait till PhoneUtilManager has been loaded
      await PhoneUtilManager.loadComplete;
      el = await fixture(html` <${tag} format-country-code-style="parentheses"></${tag}> `);
      await el.updateComplete;
    });

    describe('Dropdown value is in sync with text input', () => {
      it('should set correct active region when selecting a country from dropdown ', async () => {
        const dropdownInvoker = config.getTelDropdownInvokerEl(el);
        // @ts-ignore
        await waitUntil(() => dropdownInvoker?.checkVisibility());
        await config.selectNlOption(el);
        expect(el.activeRegion).to.equal('NL');
      });

      it('updates dropdown value', async () => {
        const dropdown = config.getTelDropdownInvokerEl(el);
        // @ts-ignore
        await waitUntil(() => dropdown?.checkVisibility());
        const input = el.querySelector('input');
        expect(input).to.exist;
        // @ts-ignore
        input.value = '';
        // @ts-ignore
        input.value = '(+91) 99451 46400';
        // @ts-ignore
        input.focus();
        /*
         * Remove characters from the input untile we get '(+91) 9'
         */
        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Backspace' });
        // @ts-ignore
        expect(input.value).to.equal('(+91) 99');
        expect(el.activeRegion).to.equal('IN');
        await sendKeys({ press: 'Backspace' });
        // @ts-ignore
        expect(input.value).to.equal('(+91) 9');
        expect(el.activeRegion).to.equal('IN');
      });
    });
  });
}
