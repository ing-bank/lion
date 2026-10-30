import { expect, fixture as _fixture } from '@open-wc/testing';
import { getInputMembers } from '@lion/ui/input-test-helpers.js';
import '@lion/ui/define/lion-input-email.js';
import { LionInputEmail } from '@lion/ui/input-email.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

/**
 * @typedef {import('@lion/ui/types/test-suites.js').SuiteElement} SuiteElement
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult|string) => Promise<LionInputEmail>} */ (_fixture);

/**
 * Runs the `lion-input-email` behavioural suite, moved out of `test/lion-input-email.test.js` so a Subclasser can run
 * the same guarantees against its own element. Pass `tagString` to point it at your
 * registered tag; see docs/guides/principles/test-suites.md.
 * `tagString`, `klass` and the older role tag keys are deprecated: pass `classes` instead (Lion
 * itself uses `classes` everywhere).
 * @param {import('@lion/ui/types/test-suites.js').SuiteConfig<{host: SuiteElement}>} [customConfig]
 */
export function runInputEmailSuite({
  classes: { host = LionInputEmail } = {},
  tagString: legacyTagString,
} = {}) {
  const tagString = resolveSuiteTag(host, legacyTagString);

  describe('<lion-input-email>', () => {
    it('has a type = text', async () => {
      const el = await fixture(`<${tagString}></${tagString}>`);
      const { _inputNode } = getInputMembers(el);
      expect(_inputNode.type).to.equal('text');
    });

    it('sets autocomplete to "email"', async () => {
      const el = await fixture(`<${tagString}></${tagString}>`);
      // @ts-expect-error [allow-protected] inside tests
      expect(el._inputNode.getAttribute('autocomplete')).to.equal('email');
    });

    it('has validator "IsEmail" applied by default', async () => {
      // More elaborate tests can be found in lion-validate/test/StringValidators.test.js
      const el = await fixture(`<${tagString}></${tagString}>`);
      el.modelValue = 'foo@bar@example.com';
      expect(el.hasFeedbackFor).to.deep.equal(['error']);
      expect(el.validationStates.error.IsEmail).to.be.true;
    });

    it('is accessible', async () => {
      const lionInputEmail = await fixture(
        `<${tagString}><label slot="label">Label</label></${tagString}>`,
      );
      await expect(lionInputEmail).to.be.accessible();
    });

    it('is accessible when readonly', async () => {
      const lionInputEmail = await fixture(
        `<${tagString} readonly><label slot="label">Label</label></${tagString}>`,
      );
      await expect(lionInputEmail).to.be.accessible();
    });

    it('is accessible when disabled', async () => {
      const lionInputEmail = await fixture(
        `<${tagString} disabled><label slot="label">Label</label></${tagString}>`,
      );
      await expect(lionInputEmail).to.be.accessible();
    });
  });
}
