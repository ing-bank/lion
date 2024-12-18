import {
  expect,
  fixture as _fixture,
  fixtureSync as _fixtureSync,
  html,
  defineCE,
  unsafeStatic,
  aTimeout,
} from '@open-wc/testing';
import sinon from 'sinon';
import { mimicUserInput } from '@lion/ui/form-core-test-helpers.js';
import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';
import { Unparseable } from '@lion/ui/form-core.js';
import { LionInputTel, PhoneNumber, PhoneUtilManager } from '@lion/ui/input-tel.js';
import { mockPhoneUtilManager, restorePhoneUtilManager } from '@lion/ui/input-tel-test-helpers.js';

/**
 * @typedef {import('lit').TemplateResult} TemplateResult
 * @typedef {import('../types/index.js').RegionCode} RegionCode
 */

const fixture = /** @type {(arg: string | TemplateResult) => Promise<LionInputTel>} */ (_fixture);
const fixtureSync = /** @type {(arg: string | TemplateResult) => LionInputTel} */ (_fixtureSync);

const getRegionCodeBasedOnLocale = () => {
  const localizeManager = getLocalizeManager();
  const localeSplitted = localizeManager.locale.split('-');
  return /** @type {RegionCode} */ (localeSplitted[localeSplitted.length - 1]).toUpperCase();
};

/**
 *
 * @param {{tag:{ '_$litStatic$': string;}; phoneUtilLoadedAfterInit?: boolean ;}} opts
 */
function runActiveRegionTests({ tag, phoneUtilLoadedAfterInit }) {
  describe('Computation of readonly accessor `.activeRegion`', () => {
    /** @type {(v:any) => void|undefined} */
    let resolvePhoneUtilLoaded;
    if (phoneUtilLoadedAfterInit) {
      beforeEach(() => {
        ({ resolveLoaded: resolvePhoneUtilLoaded } = mockPhoneUtilManager());
      });

      afterEach(() => {
        restorePhoneUtilManager();
      });
    }
    // 1. **allowed regions**: try to get the region from preconfigured allowed region (first entry)
    it('takes .allowedRegions[0] when only one allowed region configured', async () => {
      const el = await fixture(
        html` <${tag} .allowedRegions="${['DE']}" .modelValue="${'+31612345678'}" ></${tag}> `,
      );
      if (resolvePhoneUtilLoaded) {
        resolvePhoneUtilLoaded(undefined);
        await el.updateComplete;
      }
      await el.updateComplete;
      expect(el.activeRegion).to.equal('DE');
    });

    it('returns undefined when multiple .allowedRegions, but no modelValue match', async () => {
      // involve locale, so we are sure it does not fall back on locale
      const currentCode = getRegionCodeBasedOnLocale();
      const allowedRegions = ['BE', 'DE', 'CN'];
      const el = await fixture(
        html` <${tag} .modelValue="${'+31612345678'}" .allowedRegions="${allowedRegions.filter(
          ar => ar !== currentCode,
        )}"></${tag}> `,
      );
      if (resolvePhoneUtilLoaded) {
        resolvePhoneUtilLoaded(undefined);
        await el.updateComplete;
      }
      expect(el.activeRegion).to.equal(undefined);
    });

    // 2. **user input**: try to derive active region from user input
    it('deducts it from modelValue when provided', async () => {
      const el = await fixture(html` <${tag} .modelValue="${'+31612345678'}"></${tag}> `);
      if (resolvePhoneUtilLoaded) {
        resolvePhoneUtilLoaded(undefined);
        await el.updateComplete;
      }
      // Region code for country code '31' is 'NL'
      expect(el.activeRegion).to.equal('NL');
    });

    it('.modelValue takes precedence over .allowedRegions when both preconfigured and .modelValue updated', async () => {
      const el = await fixture(
        html` <${tag} .allowedRegions="${[
          'DE',
          'BE',
          'NL',
        ]}" .modelValue="${'+31612345678'}" ></${tag}> `,
      );
      if (resolvePhoneUtilLoaded) {
        resolvePhoneUtilLoaded(undefined);
        await el.updateComplete;
      }
      expect(el.activeRegion).to.equal('NL');
    });

    it('deducts it from value when modelValue is unparseable', async () => {
      const modelValue = new Unparseable('+316');
      const el = await fixture(html` <${tag} .modelValue=${modelValue}></${tag}> `);
      if (resolvePhoneUtilLoaded) {
        resolvePhoneUtilLoaded(undefined);
        await el.updateComplete;
      }
      // Region code for country code '31' is 'NL'
      expect(el.activeRegion).to.equal('NL');
    });

    it('deducts it from value when modelValue is unparseable and contains parentheses', async () => {
      const modelValue = new Unparseable('(+31)6');
      const el = await fixture(html` <${tag} .modelValue=${modelValue}></${tag}> `);
      if (resolvePhoneUtilLoaded) {
        resolvePhoneUtilLoaded(undefined);
        await el.updateComplete;
      }
      // Region code for country code '31' is 'NL'
      expect(el.activeRegion).to.equal('NL');
    });

    // 3. **locale**: try to get the region from locale (`html[lang]` attribute)
    it('automatically bases it on current locale when nothing preconfigured', async () => {
      const el = await fixture(html` <${tag}></${tag}> `);
      if (resolvePhoneUtilLoaded) {
        resolvePhoneUtilLoaded(undefined);
        await el.updateComplete;
      }
      const currentCode = getRegionCodeBasedOnLocale();
      expect(el.activeRegion).to.equal(currentCode);
    });

    it('returns undefined when locale not within allowed regions', async () => {
      const currentCode = getRegionCodeBasedOnLocale();
      const allowedRegions = ['NL', 'BE', 'DE'];
      const el = await fixture(
        html` <${tag} .allowedRegions="${allowedRegions.filter(
          ar => ar !== currentCode,
        )}"></${tag}> `,
      );
      if (resolvePhoneUtilLoaded) {
        resolvePhoneUtilLoaded(undefined);
        await el.updateComplete;
      }
      expect(el.activeRegion).to.equal(undefined);
    });
  });
}

/**
 * @param {{ klass:LionInputTel }} config
 */
// @ts-ignore
export function runInputTelSuite({ klass = LionInputTel } = {}) {
  // @ts-ignore
  const tagName = defineCE(/** @type {* & HTMLElement} */ (class extends klass {}));
  const tag = unsafeStatic(tagName);

  describe('LionInputTel', () => {
    beforeEach(async () => {
      // Wait till PhoneUtilManager has been loaded
      await PhoneUtilManager.loadComplete;
    });

    describe('Readonly accessor `.activePhoneNumberType`', () => {
      const types = [
        { type: 'fixed-line', number: '030 1234567', allowedRegions: ['NL'] },
        { type: 'mobile', number: '06 12345678', allowedRegions: ['NL'] },
        // { type: 'fixed-line-or-mobile', number: '030 1234567' },
        // { type: 'pager', number: '06 12345678' },
        // { type: 'personal-number', number: '06 12345678' },
        // { type: 'premium-rate', number: '06 12345678' },
        // { type: 'shared-cost',   : '06 12345678' },
        // { type: 'toll-free', number: '06 12345678' },
        // { type: 'uan', number: '06 12345678' },
        // { type: 'voip', number: '06 12345678' },
        // { type: 'unknown', number: '06 12345678' },
      ];

      for (const { type, number, allowedRegions } of types) {
        it(`returns "${type}" for ${type} numbers`, async () => {
          const el = await fixture(html` <${tag} .allowedRegions="${allowedRegions}"></${tag}> `);
          mimicUserInput(el, number);
          await aTimeout(0);
          expect(el.activePhoneNumberType).to.equal(type);
        });
      }
    });

    describe('User interaction', () => {
      it('sets inputmode to "tel" for mobile keyboard', async () => {
        const el = await fixture(html` <${tag}></${tag}> `);
        // @ts-expect-error [allow-protected] inside tests
        expect(el._inputNode.inputMode).to.equal('tel');
      });

      it('formats according to locale', async () => {
        const el = await fixture(
          html` <${tag} .modelValue="${'+31612345678'}" .allowedRegions="${['NL']}"></${tag}> `,
        );
        await aTimeout(0);
        expect(el.formattedValue).to.equal('+31 6 12345678');
      });

      it('does not reflect back formattedValue after activeRegion change when input still focused', async () => {
        const el = await fixture(html` <${tag} .modelValue="${'+639608920056'}"></${tag}> `);
        expect(el.activeRegion).to.equal('PH');
        el.focus();
        mimicUserInput(el, '+31612345678');
        await el.updateComplete;
        await el.updateComplete;
        expect(el.activeRegion).to.equal('NL');
        expect(el.formattedValue).to.equal('+31 6 12345678');
        expect(el.value).to.equal('+31612345678');
      });
    });

    // https://www.npmjs.com/package/google-libphonenumber
    // https://en.wikipedia.org/wiki/E.164
    describe('Values', () => {
      it('stores a modelValue in E164 format', async () => {
        const el = await fixture(html` <${tag} .allowedRegions="${['NL']}"></${tag}> `);
        mimicUserInput(el, '612345678');
        await aTimeout(0);
        expect(el.modelValue).to.equal('+31612345678');
      });

      it('stores a serializedValue in E164 format', async () => {
        const el = await fixture(html` <${tag} .allowedRegions="${['NL']}"></${tag}> `);
        mimicUserInput(el, '612345678');
        await aTimeout(0);
        expect(el.serializedValue).to.equal('+31612345678');
      });

      it('stores a formattedValue according to format strategy', async () => {
        const el = await fixture(
          html` <${tag} format-strategy="national" .allowedRegions="${['NL']}"></${tag}> `,
        );
        mimicUserInput(el, '612345678');
        await aTimeout(0);
        expect(el.formattedValue).to.equal('06 12345678');
      });

      describe('Format strategies', () => {
        it('supports "national" strategy', async () => {
          const el = await fixture(
            html` <${tag} format-strategy="national" .allowedRegions="${['NL']}"></${tag}> `,
          );
          mimicUserInput(el, '612345678');
          await aTimeout(0);
          expect(el.formattedValue).to.equal('06 12345678');
        });

        it('supports "international" strategy', async () => {
          const el = await fixture(
            html` <${tag} format-strategy="international" .allowedRegions="${['NL']}"></${tag}> `,
          );
          mimicUserInput(el, '612345678');
          await aTimeout(0);
          expect(el.formattedValue).to.equal('+31 6 12345678');
        });

        it('supports "e164" strategy', async () => {
          const el = await fixture(
            html` <${tag} format-strategy="e164" .allowedRegions="${['NL']}"></${tag}> `,
          );
          mimicUserInput(el, '612345678');
          await aTimeout(0);
          expect(el.formattedValue).to.equal('+31612345678');
        });

        it('supports "rfc3966" strategy', async () => {
          const el = await fixture(
            html` <${tag} format-strategy="rfc3966" .allowedRegions="${['NL']}"></${tag}> `,
          );
          mimicUserInput(el, '612345678');
          await aTimeout(0);
          expect(el.formattedValue).to.equal('tel:+31-6-12345678');
        });

        it('supports "significant" strategy', async () => {
          const el = await fixture(
            html` <${tag} format-strategy="significant" .allowedRegions="${['NL']}"></${tag}> `,
          );
          mimicUserInput(el, '612345678');
          await aTimeout(0);
          expect(el.formattedValue).to.equal('612345678');
        });

        it('formats according to formatCountryCodeStyle', async () => {
          const el = await fixture(
            html` <${tag} format-country-code-style="parentheses" .modelValue="${'+31612345678'}" .allowedRegions="${[
              'NL',
            ]}"></${tag}> `,
          );
          await aTimeout(0);
          expect(el.formattedValue).to.equal('(+31) 6 12345678');
        });
      });

      // TODO: this should be allowed for in FormatMixin =>
      // in _onModelValueChanged we can add a hook '_checkModelValueFormat'. This needs to be
      // called whenever .modelValue is supplied by devleloper (not when being internal result
      // of parser call).
      // Alternatively, we could be forgiving by attempting to treat it as a view value and
      // correct the format (although strictness will be preferred...)
      it.skip('does not allow modelValues in non E164 format', async () => {
        const el = await fixture(
          html` <${tag} .modelValue="${'612345678'}" .allowedRegions="${['NL']}"></${tag}> `,
        );
        expect(el.modelValue).to.equal(undefined);
      });
    });

    describe('Validation', () => {
      it('applies PhoneNumber as default validator', async () => {
        const el = await fixture(html` <${tag}></${tag}> `);
        expect(el.defaultValidators.find(v => v instanceof PhoneNumber)).to.be.not.undefined;
      });

      it('configures PhoneNumber with regionCode before first validation', async () => {
        const el = fixtureSync(
          html` <${tag} .allowedRegions="${['NL']}" .modelValue="${'612345678'}"></${tag}> `,
        );
        const spy = sinon.spy(el, 'validate');
        const validatorInstance = /** @type {PhoneNumber} */ (
          el.defaultValidators.find(v => v instanceof PhoneNumber)
        );
        await el.updateComplete;
        expect(validatorInstance.param).to.equal('NL');
        expect(spy).to.have.been.called;
        spy.restore();
      });

      it('updates PhoneNumber param on regionCode change', async () => {
        const el = await fixture(
          html` <${tag} .allowedRegions="${['NL']}" .modelValue="${'612345678'}"></${tag}> `,
        );
        const validatorInstance = /** @type {PhoneNumber} */ (
          el.defaultValidators.find(v => v instanceof PhoneNumber)
        );
        // @ts-expect-error allow protected in tests
        el._setActiveRegion('DE');
        await el.updateComplete;
        expect(validatorInstance.param).to.equal('DE');
      });
    });

    describe('User interaction', () => {
      it('sets inputmode to "tel" for mobile keyboard', async () => {
        const el = await fixture(html` <${tag}></${tag}> `);
        // @ts-expect-error [allow-protected] inside tests
        expect(el._inputNode.inputMode).to.equal('tel');
      });

      it('formats according to locale', async () => {
        const el = await fixture(html` <${tag} .allowedRegions="${['NL']}"></${tag}> `);
        await PhoneUtilManager.loadComplete;
        await el.updateComplete;
        el.modelValue = '612345678';
        expect(el.formattedValue).to.equal('+31 6 12345678');
      });
    });

    describe('Live format', () => {
      it('calls .preprocessor on keyup', async () => {
        const el = await fixture(html` <${tag} .allowedRegions="${['NL']}"></${tag}> `);
        mimicUserInput(el, '+316');
        await aTimeout(0);
        expect(el.value).to.equal('+31 6');
      });
    });

    describe('Accessibility', () => {
      describe('Audit', () => {
        it('passes a11y audit', async () => {
          const el = await fixture(html`<${tag} label="tel" .modelValue=${'0123456789'}></${tag}>`);
          await expect(el).to.be.accessible();
        });

        it('passes a11y audit when readonly', async () => {
          const el = await fixture(
            html`<${tag} label="tel" readonly .modelValue=${'0123456789'}></${tag}>`,
          );
          await expect(el).to.be.accessible();
        });

        it('passes a11y audit when disabled', async () => {
          const el = await fixture(
            html`<${tag} label="tel" disabled .modelValue=${'0123456789'}></${tag}>`,
          );
          await expect(el).to.be.accessible();
        });
      });
    });

    describe('Lazy loading awesome-phonenumber', () => {
      /** @type {(value:any) => void} */
      let resolveLoaded;
      beforeEach(() => {
        ({ resolveLoaded } = mockPhoneUtilManager());
      });

      afterEach(() => {
        restorePhoneUtilManager();
      });

      it('reformats once lib has been loaded', async () => {
        const el = await fixture(
          html` <${tag} .modelValue="${'612345678'}" .allowedRegions="${['NL']}"></${tag}> `,
        );
        expect(el.formattedValue).to.equal('612345678');
        resolveLoaded(undefined);
        await aTimeout(0);
        expect(el.formattedValue).to.equal('+31 6 12345678');
      });

      it('validates once lib has been loaded', async () => {
        const el = await fixture(
          html` <${tag} .modelValue="${'+31612345678'}" .allowedRegions="${['DE']}"></${tag}> `,
        );
        expect(el.hasFeedbackFor).to.eql([]);
        resolveLoaded(undefined);
        await aTimeout(0);
        expect(el.hasFeedbackFor).to.eql(['error']);
      });
    });

    describe('Region codes', () => {
      describe('When PhoneUtilManager has loaded before init', () => {
        runActiveRegionTests({ tag });
      });

      describe('When PhoneUtilManager is resolved after init', () => {
        runActiveRegionTests({ tag, phoneUtilLoadedAfterInit: true });
      });

      it('can preconfigure the region code via prop', async () => {
        const currentCode = getRegionCodeBasedOnLocale();
        const newCode = currentCode === 'DE' ? 'NL' : 'DE';
        const el = await fixture(html` <${tag} .allowedRegions="${[newCode]}"></${tag}> `);
        expect(el.activeRegion).to.equal(newCode);
      });

      it.skip('reformats when region code is changed on the fly', async () => {
        const el = await fixture(
          html` <${tag} .allowedRegions="${['NL']}" .modelValue="${'+31612345678'}"></${tag}> `,
        );
        await el.updateComplete;
        expect(el.formattedValue).to.equal('+31 6 12345678');
        el.allowedRegions = ['NL'];
        await el.updateComplete;
        expect(el.formattedValue).to.equal('612345678');
      });
    });
  });
}
