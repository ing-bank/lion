import { html } from 'lit/static-html.js';
import { unsafeStatic, expect, fixture as _fixture } from '@open-wc/testing';
import '@lion/ui/define/lion-progress-indicator.js';
import { LionProgressIndicator } from '@lion/ui/progress-indicator.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

/**
 * @typedef {import('@lion/ui/types/test-suites.js').SuiteElement} SuiteElement
 * @typedef {import('lit').TemplateResult} TemplateResult
 */

const fixture = /** @type {(arg: TemplateResult) => Promise<LionProgressIndicator>} */ (_fixture);

/**
 * Runs the `lion-progress-indicator` behavioural suite, moved out of `test/lion-progress-indicator.test.js` so a Subclasser can run
 * the same guarantees against its own element. Pass `tagString` to point it at your
 * registered tag; see docs/guides/principles/test-suites.md.
 * `tagString`, `klass` and the older role tag keys are deprecated: pass `classes` instead (Lion
 * itself uses `classes` everywhere).
 * @param {import('@lion/ui/types/test-suites.js').SuiteConfig<{host: SuiteElement}>} [customConfig]
 */
export function runProgressIndicatorSuite({
  classes: { host = LionProgressIndicator } = {},
  tagString: legacyTagString,
} = {}) {
  const tag = unsafeStatic(resolveSuiteTag(host, legacyTagString));

  describe('lion-progress-indicator', () => {
    describe('indeterminate', async () => {
      it('is indeterminate when has no value attribute', async () => {
        const el = await fixture(html` <${tag}></${tag}> `);
        expect(el.indeterminate).to.be.true;
      });

      it('adds a label by default', async () => {
        const el = await fixture(html` <${tag}></${tag}> `);
        await el.localizeNamespacesLoaded;
        expect(el.getAttribute('aria-label')).to.equal('Loading');
      });

      it('can override a label with "aria-label"', async () => {
        const el = await fixture(html`
          <${tag} aria-label="foo"></${tag}>
        `);
        await el.localizeNamespacesLoaded;
        expect(el.getAttribute('aria-label')).to.equal('foo');
        el.setAttribute('aria-label', 'bar');
        expect(el.getAttribute('aria-label')).to.equal('bar');
        el.removeAttribute('aria-label');
        await el.updateComplete;
        expect(el.getAttribute('aria-label')).to.equal('Loading');
      });

      it('can override a label with "aria-labelledby"', async () => {
        const el = await fixture(html`
          <${tag} aria-labelledby="foo-id"></${tag}>
        `);
        await el.localizeNamespacesLoaded;
        expect(el.getAttribute('aria-labelledby')).to.equal('foo-id');
        expect(el.hasAttribute('aria-label')).to.be.false;
        el.setAttribute('aria-labelledby', 'bar-id');
        expect(el.getAttribute('aria-labelledby')).to.equal('bar-id');
        expect(el.hasAttribute('aria-label')).to.be.false;
        el.removeAttribute('aria-labelledby');
        await el.updateComplete;
        expect(el.hasAttribute('aria-labelledby')).to.be.false;
        expect(el.getAttribute('aria-label')).to.equal('Loading');
      });

      it('loosses default aria-label when switch to determinate state', async () => {
        const el = await fixture(html` <${tag}></${tag}> `);
        await el.localizeNamespacesLoaded;
        expect(el.getAttribute('aria-label')).to.equal('Loading');
        el.setAttribute('value', '30');
        await el.updateComplete;
        expect(el.hasAttribute('aria-label')).to.be.false;
      });

      it('keeps own aria-label when switch to determinate state', async () => {
        const el = await fixture(html`
          <${tag} aria-label="foo"></${tag}>
        `);
        expect(el.getAttribute('aria-label')).to.equal('foo');
        el.setAttribute('value', '30');
        await el.updateComplete;
        expect(el.getAttribute('aria-label')).to.equal('foo');
      });
    });

    describe('determinate', async () => {
      it('is determinate when it has a value', async () => {
        const el = await fixture(html`
          <${tag} value="25" aria-label="foo"></${tag}>
        `);
        expect(el.indeterminate).to.be.false;
      });

      it('can update value', async () => {
        const el = await fixture(html`
          <${tag} value="25" aria-label="foo"></${tag}>
        `);
        expect(el.getAttribute('aria-valuenow')).to.equal('25');
        el.value = 30;
        await el.updateComplete;
        expect(el.getAttribute('aria-valuenow')).to.equal('30');
      });

      it('can update min', async () => {
        const el = await fixture(html`
          <${tag} value="50" aria-label="foo"></${tag}>
        `);
        expect(el.getAttribute('aria-valuemin')).to.equal('0');
        el.min = 30;
        await el.updateComplete;
        expect(el.getAttribute('aria-valuemin')).to.equal('30');
      });

      it('can update max', async () => {
        const el = await fixture(html`
          <${tag} value="50" aria-label="foo"></${tag}>
        `);
        expect(el.getAttribute('aria-valuemax')).to.equal('100');
        el.max = 70;
        await el.updateComplete;
        expect(el.getAttribute('aria-valuemax')).to.equal('70');
      });

      it('min & max limits value', async () => {
        const el = await fixture(html`
          <${tag} value="150" aria-label="foo"></${tag}>
        `);
        // sets to default max: 100
        expect(el.getAttribute('aria-valuenow')).to.equal('100');
        el.value = -20;
        await el.updateComplete;
        // sets to default min: 0
        expect(el.getAttribute('aria-valuenow')).to.equal('0');
      });

      // TODO make this feature available
      it.skip('supports valuetext', async () => {
        const el = await fixture(html`
          <${tag}
            value="8"
            value-text="{value}% (34 minutes) remaining"
          ></${tag}>
        `);
        expect(el.getAttribute('aria-valuetext')).to.equal('8% (34 minutes) remaining');
      });

      it('becomes indeterminate if value gets removed', async () => {
        const el = await fixture(html`<${tag} value="30"></${tag}> `);
        el.removeAttribute('value');
        await el.updateComplete;
        expect(el.indeterminate).to.be.true;
        expect(el.getAttribute('aria-label')).to.equal('Loading');
      });

      it("becomes indeterminate if value ain't a number", async () => {
        const el = await fixture(html`<${tag} value="30"></${tag}> `);
        // when the attribute is defined, lit set the property to Number(attributeValue)
        // this means, setting the value to an empty string will be valid because Number('') is 0
        el.setAttribute('value', 'invalid-value');
        await el.updateComplete;
        expect(el.indeterminate).to.be.true;
        await el.updateComplete;
        expect(el.hasAttribute('aria-valuenow')).to.be.false;
        expect(el.hasAttribute('aria-valuemin')).to.be.false;
        expect(el.hasAttribute('aria-valuemax')).to.be.false;
        expect(el.getAttribute('aria-label')).to.equal('Loading');
      });

      it('can update value to 0', async () => {
        const el = await fixture(html`<${tag} value="0"></${tag}> `);
        await el.updateComplete;
        expect(el.indeterminate).to.be.false;
      });

      // empty string will be converted to 0 by lit because value is declared as number
      it('can update value to 0 if the set value is empty string', async () => {
        const el = await fixture(html`<${tag} value=""></${tag}> `);
        await el.updateComplete;
        expect(el.indeterminate).to.be.false;
      });
    });

    describe('Subclasers', () => {
      it('can use _progressPercentage getter to get the progress percentage', async () => {
        const el = await fixture(html`
          <${tag} max="50" value="10" aria-label="foo"></${tag}>
        `);
        expect(el._progressPercentage).to.equal(20);
      });
    });

    describe('Accessibility', () => {
      it('by default', async () => {
        const el = await fixture(html` <${tag}></${tag}> `);
        expect(el.getAttribute('role')).to.equal('progressbar');
      });

      describe('indeterminate', () => {
        it('passes a11y test', async () => {
          const el = await fixture(html` <${tag}></${tag}> `);
          await expect(el).to.be.accessible();
        });
      });

      describe('determinate', () => {
        it('passes a11y test', async () => {
          const el = await fixture(html`
            <${tag} value="25" aria-label="foo"></${tag}>
          `);
          await expect(el).to.be.accessible();
        });

        it('once value is set', async () => {
          const el = await fixture(html`
            <${tag} value="25" aria-label="foo"></${tag}>
          `);
          expect(el.getAttribute('aria-valuenow')).to.equal('25');
        });

        it('allows to set min & max values', async () => {
          const el = await fixture(html`
            <${tag} value="25" aria-label="foo"></${tag}>
          `);
          expect(el.getAttribute('aria-valuemin')).to.equal('0');
          expect(el.getAttribute('aria-valuemax')).to.equal('100');
        });
      });
    });
  });
}
