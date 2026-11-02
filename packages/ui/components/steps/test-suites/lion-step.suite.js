import { html } from 'lit/static-html.js';
import { unsafeStatic, expect, fixture, oneEvent } from '@open-wc/testing';
import '@lion/ui/define/lion-step.js';
import { LionStep } from '@lion/ui/steps.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

/**
 * @typedef {import('@lion/ui/types/test-suites.js').SuiteElement} SuiteElement
 */

/**
 * Runs the `lion-step` behavioural suite, moved out of `test/lion-step.test.js` so a Subclasser can run
 * the same guarantees against its own element. Pass `tagString` to point it at your
 * registered tag; see docs/guides/principles/test-suites.md.
 * `tagString`, `klass` and the older role tag keys are deprecated: pass `classes` instead (Lion
 * itself uses `classes` everywhere).
 * @param {import('@lion/ui/types/test-suites.js').SuiteConfig<{host: SuiteElement}>} [customConfig]
 */
export function runStepSuite({
  classes: { host = LionStep } = {},
  tagString: legacyTagString,
} = {}) {
  const tag = unsafeStatic(resolveSuiteTag(host, legacyTagString));

  describe('lion-step', () => {
    it('has a condition which allows it to become active (condition is true by default)', async () => {
      const el = await fixture(html`
        <fake-lion-steps>
          <${tag}>Step 1</${tag}>
        </fake-lion-steps>
      `);
      expect(/** @type {LionStep} */ (el.children[0]).condition()).to.equal(true);
      expect(/** @type {LionStep} */ (el.children[0]).passesCondition()).to.equal(true);
    });

    it('does not invert condition by default', async () => {
      const el = await fixture(html`
        <fake-lion-steps>
          <${tag}>Step 1</${tag}>
        </fake-lion-steps>
      `);
      expect(/** @type {LionStep} */ (el.children[0]).invertCondition).to.equal(false);
      expect(/** @type {LionStep} */ (el.children[0]).passesCondition()).to.equal(true);
    });

    it('can invert its condition', async () => {
      const el = await fixture(html`
        <fake-lion-steps>
          <${tag}>Step 1</${tag}>
        </fake-lion-steps>
      `);
      /** @type {LionStep} */ (el.children[0]).condition = () => true;
      /** @type {LionStep} */ (el.children[0]).invertCondition = true;
      expect(/** @type {LionStep} */ (el.children[0]).condition()).to.equal(true);
      expect(/** @type {LionStep} */ (el.children[0]).passesCondition()).to.equal(false);
    });

    it('has "untouched" status by default', async () => {
      const el = await fixture(html`
        <fake-lion-steps>
          <${tag}>Step 1</${tag}>
        </fake-lion-steps>
      `);
      expect(/** @type {LionStep} */ (el.children[0]).status).to.equal('untouched');
    });

    it('is hidden when attribute hidden is true', async () => {
      const el = await fixture(html`
        <fake-lion-steps>
          <${tag} hidden>Step 1</${tag}>
        </fake-lion-steps>
      `);
      expect(el.children[0]).not.to.be.displayed;
    });

    it('communicates with a parent steps controller to handles actions', async () => {
      const el = await fixture(html`
        <fake-lion-steps>
          <${tag}>Step 1</${tag}>
        </fake-lion-steps>
      `);
      expect(/** @type {LionStep} */ (el.children[0]).controller).to.equal(el);
    });

    describe('navigation', () => {
      it('can be entered', async () => {
        const el = await fixture(html`
          <fake-lion-steps>
            <${tag}>Step 1</${tag}>
          </fake-lion-steps>
        `);
        setTimeout(() => /** @type {LionStep} */ (el.children[0]).enter(), 0);
        await oneEvent(el.children[0], 'enter');
        expect(/** @type {LionStep} */ (el.children[0]).status).to.equal('entered');
      });

      it('can be left', async () => {
        const el = await fixture(html`
          <fake-lion-steps>
            <${tag}>Step 1</${tag}>
          </fake-lion-steps>
        `);
        setTimeout(() => /** @type {LionStep} */ (el.children[0]).leave(), 0);
        await oneEvent(el.children[0], 'leave');
        expect(/** @type {LionStep} */ (el.children[0]).status).to.equal('left');
      });

      it('can be skipped', async () => {
        const el = await fixture(html`
          <fake-lion-steps>
            <${tag}>Step 1</${tag}>
          </fake-lion-steps>
        `);
        setTimeout(() => /** @type {LionStep} */ (el.children[0]).skip(), 0);
        await oneEvent(el.children[0], 'skip');
        expect(/** @type {LionStep} */ (el.children[0]).status).to.equal('skipped');
      });
    });
  });
}
