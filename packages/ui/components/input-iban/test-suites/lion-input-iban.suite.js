import { html } from 'lit/static-html.js';
import { unsafeStatic, expect, fixture as _fixture } from '@open-wc/testing';
import { getInputMembers } from '@lion/ui/input-test-helpers.js';
import { IsCountryIBAN, formatIBAN, parseIBAN } from '@lion/ui/input-iban.js';
import '@lion/ui/define/lion-input-iban.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

/**
 * @typedef {import('../src/LionInputIban.js').LionInputIban} LionInputIban
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult|string) => Promise<LionInputIban>} */ (_fixture);

/**
 * Runs the `lion-input-iban` behavioural suite, moved out of `test/lion-input-iban.test.js` so a Subclasser can run
 * the same guarantees against its own element. Pass `tagString` to point it at your
 * registered tag; see docs/guides/principles/test-suites.md.
 * @param {{ classes?: Record<string, CustomElementConstructor>, tagString?: string }} [customConfig]
 */
export function runInputIbanSuite(customConfig = {}) {
  const cfg = {
    classes: /** @type {Record<string, CustomElementConstructor>} */ ({}),
    tagString: 'lion-input-iban',
    ...customConfig,
  };
  cfg.tagString = resolveSuiteTag(cfg.classes['input-iban'], cfg.tagString, 'lion-input-iban');
  const tag = unsafeStatic(cfg.tagString);

  describe('<lion-input-iban>', () => {
    it('uses formatIBAN for formatting', async () => {
      const el = await fixture(`<${cfg.tagString}></${cfg.tagString}>`);
      expect(el.formatter).to.equal(formatIBAN);
    });

    it('uses parseIBAN for parsing', async () => {
      const el = await fixture(`<${cfg.tagString}></${cfg.tagString}>`);
      expect(el.parser).to.equal(parseIBAN);
    });

    it('has a type = text', async () => {
      const el = await fixture(`<${cfg.tagString}></${cfg.tagString}>`);
      const { _inputNode } = getInputMembers(el);
      expect(_inputNode.type).to.equal('text');
    });

    it('has validator "IsIBAN" applied by default', async () => {
      const el = await fixture(`<${cfg.tagString}></${cfg.tagString}>`);
      el.modelValue = 'FOO';
      expect(el.hasFeedbackFor).to.include('error');
      expect(el.validationStates).to.have.property('error');
      expect(el.validationStates.error).to.have.property('IsIBAN');
      el.modelValue = 'DE89370400440532013000';
      expect(el.hasFeedbackFor).not.to.include('error');
      expect(el.validationStates).to.have.property('error');
      expect(el.validationStates.error).not.to.have.property('IsIBAN');
    });

    it('can apply validator "IsCountryIBAN" to restrict countries', async () => {
      const el = await fixture(html`
        <${tag} .validators=${[new IsCountryIBAN('NL')]}> </${tag}>
      `);
      el.modelValue = 'DE89370400440532013000';
      expect(el.hasFeedbackFor).to.include('error');
      expect(el.validationStates).to.have.property('error');
      expect(el.validationStates.error).to.have.property('IsCountryIBAN');
      el.modelValue = 'NL17INGB0002822608';
      expect(el.hasFeedbackFor).not.to.include('error');
      expect(el.validationStates).to.have.property('error');
      expect(el.validationStates.error).not.to.have.property('IsCountryIBAN');
      el.modelValue = 'FOO';
      expect(el.hasFeedbackFor).to.include('error');
      expect(el.validationStates).to.have.property('error');
      expect(el.validationStates.error).to.have.property('IsIBAN');
      expect(el.validationStates.error).to.have.property('IsCountryIBAN');
    });

    it('is accessible', async () => {
      const el = await fixture(
        `<${cfg.tagString}><label slot="label">Label</label></${cfg.tagString}>`,
      );
      await expect(el).to.be.accessible();
    });

    it('is accessible when readonly', async () => {
      const el = await fixture(
        `<${cfg.tagString} readonly><label slot="label">Label</label></${cfg.tagString}>`,
      );
      await expect(el).to.be.accessible();
    });

    it('is accessible when disabled', async () => {
      const el = await fixture(
        `<${cfg.tagString} disabled><label slot="label">Label</label></${cfg.tagString}>`,
      );
      await expect(el).to.be.accessible();
    });
  });
}
