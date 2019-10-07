/* eslint-env mocha */
import { LionSelectRich, LionSelectInvoker } from '@lion/select-rich';
import { expect, fixture, html } from '@open-wc/testing';
import { LionButton } from '@lion/button';
import { LionOption } from '@lion/option';
import {
  ModalDialogController,
  DynamicOverlayController,
  BottomSheetController,
} from '@lion/overlays';
import IngLogo from '../../logo/src/ing-logo.svg.js';
import '../../../ing-select-account.js';
import { formatAmountHtml } from '../../localize/formatAmountHtml.js';

const accounts = [
  {
    value: {
      alias: 'ING Savings Account',
      currencyAmount: 2040,
      currency: 'EUR',
      IBAN: 'DE89370400440532013000',
      bankIcon: IngLogo,
    },
    checked: false,
  },
  {
    value: {
      alias: 'ING Debit Account',
      currencyAmount: 1236,
      currency: 'EUR',
      IBAN: 'BE68539007547034',
      bankIcon: IngLogo,
    },
    checked: false,
  },
];

const basicTemplate = html`
  <ing-select-account
    name="foo"
    .contentTemplate="${() => html`
      <ing-options>
        ${accounts.map(
          account => html`
            <ing-option-account .modelValue=${account}></ing-option-account>
          `,
        )}
      </ing-options>
    `}"
  >
  </ing-select-account>
`;

// karma-viewport plugin exposes global viewport variable
const mockedViewport = window.viewport;

afterEach(() => {
  mockedViewport.reset();
});

describe('ing-select-account', () => {
  it('is an instance of LionRichSelect', async () => {
    const el = await fixture(basicTemplate);

    expect(el).to.be.an.instanceOf(LionSelectRich);
  });

  it('has a DynamicOverlayController consisting of ModalDialog and BottomSheet', async () => {
    const el = await fixture(basicTemplate);

    expect(el._ctrl).to.be.an.instanceOf(DynamicOverlayController);
    expect(el._ctrl.list.length).to.equal(2);
    expect(el._ctrl.list[0]).to.be.an.instanceOf(ModalDialogController);
    expect(el._ctrl.list[1]).to.be.an.instanceOf(BottomSheetController);
  });

  it('opens a Bottom Sheet when clicking the invoker, when viewport width is below 600px', async () => {
    const el = await fixture(basicTemplate);
    mockedViewport.set(599);
    await el.show();
    expect(el._ctrl.list[1].isShown).to.be.true;
    await el._hide();
  });

  it('open a Modal Dialog when clicking the invoker, when viewport width is 600px or more', async () => {
    const el = await fixture(basicTemplate);
    mockedViewport.set(600);
    await el.show();
    expect(el._ctrl.list[0].isShown).to.be.true;
    await el._hide();
  });

  describe('ing-select-account-invoker', () => {
    it('has an invoker that extends lion-select-invoker which is an extension of lion-button', async () => {
      const el = await fixture(basicTemplate);

      expect(el._invoker).to.be.an.instanceOf(LionSelectInvoker);
      expect(el._invoker).to.be.an.instanceOf(LionButton);
    });

    it('has an invoker which has content of the selected option', async () => {
      const el = await fixture(basicTemplate);

      // Very very rough pseudocode
      const ingOption = el.querySelector('ing-option');
      expect(el._invoker).dom.equal(ingOption);
    });

    // TODO: what's diff with prev?
    // it('displays the currently selected option in the invoker', async () => {

    // });

    it('displays the first option by default when no option has yet been selected', async () => {
      const el = await fixture(basicTemplate);

      // Very very rough pseudocode
      const ingOption = el.querySelector('ing-option');
      expect(el._invoker).dom.equal(ingOption);
    });
  });

  // TOOD: distinct file. Can also be consumed by listbox component
  describe('ing-option-account', () => {
    it('renders several account "keys"', async () => {
      const el = await fixture(basicTemplate);
      const optionEl = el.querySelector('ing-option-acocount');

      // Pretty specific queries, just to ensure we have the same idea about the DOM structure of option
      const bankIconEl = optionEl.shadowRoot.querySelector('.option-account__icon');
      const amountEl = optionEl.shadowRoot.querySelector('.option-account__amount');
      const ibanEl = optionEl.shadowRoot.querySelector('.option-account__iban');
      const chevronEl = optionEl.shadowRoot.querySelector('.option-account__chevron');

      expect(bankIconEl).to.be.defined;
      expect(amountEl).to.be.defined;
      expect(ibanEl).to.be.defined;
      expect(chevronEl).to.be.defined;
    });

    it('has a response icon in the invoker that is removed when viewport width is below 375px', async () => {
      mockedViewport.set(375);
      const el = await fixture(basicTemplate);
      const optionEl = el.querySelector('ing-option-acocount');
      const iconEl = optionEl.shadowRoot.querySelector('.option-account__icon');
      expect(iconEl).to.be.defined;
      mockedViewport.set(374);
      expect(iconEl).to.be.undefined;
    });

    it('extends lion-select-option(s)', async () => {
      const el = await fixture(basicTemplate);
      const ingOptionEls = el.querySelectorAll('ing-option-account');
      Array.from(ingOptionEls).forEeach(optionEl => {
        expect(optionEl).to.be.instance.of(LionOption);
      });
    });

    it('formats the IBAN number', async () => {
      const el = await fixture(basicTemplate);

      const ibanEl = el.shadowRoot.querySelector('.option-account__iban');
      expect(ibanEl).dom.equal('DE89370400440532013000'); // but then fromatted
    });

    it('formats the amount', async () => {
      const el = await fixture(basicTemplate);
      const amountEl = el.shadowRoot.querySelector('.option-account__amount');
      expect(amountEl).dom.equal(formatAmountHtml(accounts[0].amount).outerHTML); // but then fromatted
    });

    describe('Accessibility', () => {
      // All of this should be covered in lion-option?
    });
  });
});
