import { html } from 'lit/static-html.js';
import { unsafeStatic, expect, fixture } from '@open-wc/testing';
import { LionRadio } from '@lion/ui/radio-group.js';
import '@lion/ui/define/lion-radio.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

/**
 * @typedef {import('@lion/ui/types/test-suites.js').SuiteElement} SuiteElement
 */

/**
 * Runs the `lion-radio` behavioural suite, moved out of `test/lion-radio.test.js` so a Subclasser can run
 * the same guarantees against its own element. Pass your own tag names to point it at them
 * (see docs/guides/principles/test-suites.md).
 * `tagString`, `klass` and the older role tag keys are deprecated: pass `classes` instead (Lion
 * itself uses `classes` everywhere).
 * @param {import('@lion/ui/types/test-suites.js').SuiteConfig<{host: SuiteElement}>} [customConfig]
 */
export function runRadioSuite({
  classes: { host = LionRadio } = {},
  tagString: legacyTagString,
} = {}) {
  const tag = unsafeStatic(resolveSuiteTag(host, legacyTagString));

  describe('<lion-radio>', () => {
    it('should have type = radio', async () => {
      const el = await fixture(html`
        <${tag} name="radio" .choiceValue="${'male'}"></${tag}>
      `);
      expect(el.getAttribute('type')).to.equal('radio');
    });

    it('can be reset when unchecked by default', async () => {
      const el = /**  @type {LionRadio} */ (
        await fixture(html` <${tag} name="radio" .choiceValue=${'male'}></${tag}> `)
      );
      expect(el._initialModelValue).to.deep.equal({ value: 'male', checked: false });
      el.checked = true;
      expect(el.modelValue).to.deep.equal({ value: 'male', checked: true });

      el.reset();
      expect(el.modelValue).to.deep.equal({ value: 'male', checked: false });
    });

    it('can be reset when checked by default', async () => {
      const el = /**  @type {LionRadio} */ (
        await fixture(html` <${tag} name="radio" .choiceValue=${'male'} checked></${tag}> `)
      );
      expect(el._initialModelValue).to.deep.equal({ value: 'male', checked: true });
      el.checked = false;
      expect(el.modelValue).to.deep.equal({ value: 'male', checked: false });

      el.reset();
      expect(el.modelValue).to.deep.equal({ value: 'male', checked: true });
    });
  });
}
