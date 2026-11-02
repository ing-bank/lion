import { html } from 'lit/static-html.js';
import { unsafeStatic, expect, fixture as _fixture, nextFrame } from '@open-wc/testing';
import '@lion/ui/define/lion-input-range.js';
import { LionInputRange } from '@lion/ui/input-range.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

/**
 * @typedef {import('@lion/ui/types/test-suites.js').SuiteElement} SuiteElement
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult|string) => Promise<LionInputRange>} */ (_fixture);

/**
 * Runs the `lion-input-range` behavioural suite, moved out of `test/lion-input-range.test.js` so a Subclasser can run
 * the same guarantees against its own element. Pass `tagString` to point it at your
 * registered tag; see docs/guides/principles/test-suites.md.
 * `tagString`, `klass` and the older role tag keys are deprecated: pass `classes` instead (Lion
 * itself uses `classes` everywhere).
 * @param {import('@lion/ui/types/test-suites.js').SuiteConfig<{host: SuiteElement}>} [customConfig]
 */
export function runInputRangeSuite({
  classes: { host = LionInputRange } = {},
  tagString: legacyTagString,
} = {}) {
  const tagString = resolveSuiteTag(host, legacyTagString);
  const tag = unsafeStatic(tagString);

  describe('<lion-input-range>', () => {
    it('has a type = range', async () => {
      const el = await fixture(`<${tagString}></${tagString}>`);
      expect(el._inputNode.type).to.equal('range');
    });

    it('displays the modelValue and unit', async () => {
      const el = await fixture(html`
        <${tag} .modelValue=${75} unit="${`%`}"></${tag}>
      `);
      expect(
        /** @type {HTMLElement} */ (
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelector('.input-range__value')
        ).innerText,
      ).to.equal('75');
      expect(
        /** @type {HTMLElement} */ (
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelector('.input-range__unit')
        ).innerText,
      ).to.equal('%');
    });

    it('displays 2 tick labels (min and max values) by default', async () => {
      const el = await fixture(`<${tagString} min="100" max="200"></${tagString}>`);
      expect(el.shadowRoot?.querySelectorAll('.input-range__limits span').length).to.equal(2);
      expect(
        /** @type {HTMLElement} */ (
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll(
            '.input-range__limits > div',
          )[0]
        ).textContent?.trim(),
      ).to.equal(`Minimum ${el.min.toString()}`);
      expect(
        /** @type {HTMLElement} */ (
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll(
            '.input-range__limits > div',
          )[1]
        ).textContent?.trim(),
      ).to.equal(`Maximum ${el.max.toString()}`);
    });

    it('update min and max attributes when min and max property change', async () => {
      const el = await fixture(`<${tagString} min="100" max="200"></${tagString}>`);
      el.min = 120;
      el.max = 220;
      await nextFrame(); // sync to native element takes some time
      expect(el._inputNode.min).to.equal(el.min.toString());
      expect(el._inputNode.max).to.equal(el.max.toString());
    });

    it('can hide the tick labels', async () => {
      const el = await fixture(
        `<${tagString} min="100" max="200" no-min-max-labels></${tagString}>`,
      );
      expect(el.shadowRoot?.querySelectorAll('.input-group__input')[0]).dom.to.equal(`
        <div class="input-group__input">
          <slot name="input"></slot>
        </div>
      `);
    });

    it('parser method should return a value parsed into a number format', async () => {
      const el = await fixture(html`
        <${tag} min="100" max="200" .modelValue=${150}></${tag}>
      `);
      expect(el.modelValue).to.equal(150);
      el._inputNode.value = '130';
      el._inputNode.dispatchEvent(new Event('input'));
      expect(el.modelValue).to.equal(130);
    });

    it('is accessible', async () => {
      const el = await fixture(`<${tagString} label="range"></${tagString}>`);
      await expect(el).to.be.accessible();
    });

    it('is accessible when disabled', async () => {
      const el = await fixture(`<${tagString} label="range" disabled></${tagString}>`);
      await expect(el).to.be.accessible();
    });

    describe('Custom min/max labels', () => {
      it('displays custom minLabel in the limits when provided', async () => {
        const el = await fixture(html`
          <${tag} min="0" max="100" min-label="Low" .modelValue=${50}></${tag}>
        `);
        const minDiv = /** @type {HTMLElement} */ (
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll(
            '.input-range__limits > div',
          )[0]
        );
        expect(minDiv.textContent?.trim()).to.equal('Minimum Low');
      });

      it('displays custom maxLabel in the limits when provided', async () => {
        const el = await fixture(html`
          <${tag} min="0" max="100" max-label="High" .modelValue=${50}></${tag}>
        `);
        const maxDiv = /** @type {HTMLElement} */ (
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll(
            '.input-range__limits > div',
          )[1]
        );
        expect(maxDiv.textContent?.trim()).to.equal('Maximum High');
      });

      it('displays custom minLabel as value display when value equals min', async () => {
        const el = await fixture(html`
          <${tag} min="0" max="100" min-label="Low" .modelValue=${0}></${tag}>
        `);
        const valueSpan = /** @type {HTMLElement} */ (
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelector('.input-range__value')
        );
        expect(valueSpan.innerText).to.equal('Low');
      });

      it('displays custom maxLabel as value display when value equals max', async () => {
        const el = await fixture(html`
          <${tag} min="0" max="100" max-label="High" .modelValue=${100}></${tag}>
        `);
        const valueSpan = /** @type {HTMLElement} */ (
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelector('.input-range__value')
        );
        expect(valueSpan.innerText).to.equal('High');
      });

      it('displays formatted number when value is between min and max', async () => {
        const el = await fixture(html`
          <${tag}
            min="0"
            max="100"
            min-label="Low"
            max-label="High"
            .modelValue=${50}
          ></${tag}>
        `);
        const valueSpan = /** @type {HTMLElement} */ (
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelector('.input-range__value')
        );
        expect(valueSpan.innerText).to.equal('50');
      });

      it('maintains numeric modelValue even when displaying custom label', async () => {
        const el = await fixture(html`
          <${tag} min="0" max="100" min-label="Low" .modelValue=${0}></${tag}>
        `);
        const valueSpan = /** @type {HTMLElement} */ (
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelector('.input-range__value')
        );
        // Display shows custom label
        expect(valueSpan.innerText).to.equal('Low');
        // But modelValue is still the number
        expect(el.modelValue).to.equal(0);
        expect(typeof el.modelValue).to.equal('number');
      });

      it('sets aria-valuetext to minLabel when modelValue equals min', async () => {
        const el = await fixture(html`
          <${tag} min="0" max="100" min-label="Low" .modelValue=${50}></${tag}>
        `);

        el.modelValue = 0;
        await nextFrame();

        expect(el._inputNode.getAttribute('aria-valuetext')).to.equal('Low');
      });

      it('sets aria-valuetext to maxLabel when modelValue equals max', async () => {
        const el = await fixture(html`
          <${tag} min="0" max="100" max-label="High" .modelValue=${50}></${tag}>
        `);

        el.modelValue = 100;
        await nextFrame();

        expect(el._inputNode.getAttribute('aria-valuetext')).to.equal('High');
      });

      it('removes aria-valuetext when modelValue is between min and max', async () => {
        const el = await fixture(html`
          <${tag}
            min="0"
            max="100"
            min-label="Low"
            max-label="High"
            .modelValue=${0}
          ></${tag}>
        `);

        await nextFrame();
        expect(el._inputNode.getAttribute('aria-valuetext')).to.equal('Low');

        el.modelValue = 50;
        await nextFrame();

        expect(el._inputNode.hasAttribute('aria-valuetext')).to.equal(false);
      });
    });
  });
}
