import { html } from 'lit/static-html.js';
import { unsafeStatic, aTimeout, expect, fixture as _fixture } from '@open-wc/testing';
import sinon from 'sinon';
import { getFormControlMembers } from '@lion/ui/form-core-test-helpers.js';
import '@lion/ui/define/lion-textarea.js';
import { LionTextarea } from '@lion/ui/textarea.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

/**
 * @typedef {import('@lion/ui/types/test-suites.js').SuiteElement} SuiteElement
 * @typedef {import('lit').TemplateResult} TemplateResult
 */

const fixture = /** @type {(arg: TemplateResult|string) => Promise<LionTextarea>} */ (_fixture);

function hasBrowserResizeSupport() {
  const textarea = document.createElement('textarea');
  return textarea.style.resize !== undefined;
}

/**
 * Runs the `lion-textarea` behavioural suite, moved out of `test/lion-textarea.test.js` so a Subclasser can run
 * the same guarantees against its own element. Pass `tagString` to point it at your
 * registered tag; see docs/guides/principles/test-suites.md.
 * `tagString`, `klass` and the older role tag keys are deprecated: pass `classes` instead (Lion
 * itself uses `classes` everywhere).
 * @param {import('@lion/ui/types/test-suites.js').SuiteConfig<{host: SuiteElement}>} [customConfig]
 */
export function runTextareaSuite({
  classes: { host = LionTextarea } = {},
  tagString: legacyTagString,
} = {}) {
  const tagString = resolveSuiteTag(host, legacyTagString);
  const tag = unsafeStatic(tagString);

  describe('<lion-textarea>', () => {
    it(`can be used with the following declaration
    ~~~
    <${tagString}></${tagString}>
    ~~~`, async () => {
      const el = await fixture(`<${tagString}></${tagString}>`);
      expect(el.querySelector('textarea')?.nodeName).to.equal('TEXTAREA');
    });

    it('has .rows=2 and .maxRows=6', async () => {
      const el = await fixture(`<${tagString}></${tagString}>`);
      expect(el.rows).to.equal(2);
      expect(el.maxRows).to.equal(6);
    });

    it('has .readOnly=false .rows=2 and rows="2" by default', async () => {
      const el = await fixture(`<${tagString}>foo</${tagString}>`);
      const { _inputNode } = getFormControlMembers(el);

      expect(el.rows).to.equal(2);
      expect(el.getAttribute('rows')).to.be.equal('2');
      // @ts-ignore
      expect(_inputNode.rows).to.equal(2);
      expect(_inputNode.getAttribute('rows')).to.be.equal('2');
      expect(el.readOnly).to.be.false;
      expect(_inputNode.hasAttribute('readonly')).to.be.false;
    });

    it('sync rows down to the native textarea', async () => {
      const el = await fixture(`<${tagString} rows="8">foo</${tagString}>`);
      const { _inputNode } = getFormControlMembers(el);
      expect(el.rows).to.equal(8);
      expect(el.getAttribute('rows')).to.be.equal('8');
      // @ts-ignore
      expect(_inputNode.rows).to.equal(8);
      expect(_inputNode.getAttribute('rows')).to.be.equal('8');
    });

    it('sync readOnly to the native textarea', async () => {
      const el = await fixture(`<${tagString} readonly>foo</${tagString}>`);
      expect(el.readOnly).to.be.true;
      expect(el.querySelector('textarea')?.readOnly).to.be.true;
    });

    it('disables user resize behavior', async () => {
      if (!hasBrowserResizeSupport()) {
        return;
      }

      const el = await fixture(`<${tagString}></${tagString}>`);
      const { _inputNode } = getFormControlMembers(el);
      const computedStyle = window.getComputedStyle(_inputNode);
      expect(computedStyle.resize).to.equal('none');
    });

    it('supports initial modelValue', async () => {
      const el = await fixture(html`<${tag} .modelValue="${'From value attribute'}"></${tag}>`);
      expect(el.querySelector('textarea')?.value).to.equal('From value attribute');
    });

    it('adjusts height based on content', async () => {
      const el = await fixture(`<${tagString}></${tagString}>`);
      const initialHeight = el.offsetHeight;
      el.modelValue = 'batman\nand\nrobin\nand\ncatwoman';
      await el.updateComplete;
      const hightWith5TextLines = el.offsetHeight;
      expect(hightWith5TextLines > initialHeight).to.equal(true);

      el.modelValue = 'batman';
      await el.updateComplete;
      const hightWith1Line = el.offsetHeight;
      expect(hightWith1Line < hightWith5TextLines).to.equal(true);
    });

    it(`starts growing when content is bigger than "rows"
      'and stops growing after property "maxRows" is reached`, async () => {
      const el = await fixture(html`<${tag}></${tag}>`);
      return [1, 2, 3, 4, 5, 6, 7, 8].reduce(async (heightPromise, i) => {
        const oldHeight = await heightPromise;
        el.modelValue += '\n';
        await el.updateComplete;
        const newHeight = el.offsetHeight;

        if (i > el.maxRows) {
          // stop growing
          expect(newHeight).to.equal(oldHeight);
        } else if (i > el.rows) {
          // growing normally
          expect(newHeight >= oldHeight).to.equal(true);
        }

        return Promise.resolve(newHeight);
      }, Promise.resolve(0));
    });

    // TODO: make test simpler => no reduce please
    it('stops growing after property "maxRows" is reached when there was an initial value', async () => {
      const el = await fixture(html` <${tag} .modelValue="${'1\n2\n3'}"></${tag}> `);
      return [4, 5, 6, 7, 8].reduce(async (heightPromise, i) => {
        const oldHeight = await heightPromise;
        el.modelValue += `\n`;
        await el.updateComplete;
        const newHeight = el.offsetHeight;

        if (i > el.maxRows) {
          // stop growing
          expect(newHeight).to.equal(oldHeight);
        } else if (i > el.rows) {
          // growing normally
          expect(newHeight >= oldHeight).to.equal(true);
        }

        return Promise.resolve(newHeight);
      }, Promise.resolve(0));
    });

    it('stops shrinking after property "rows" is reached', async () => {
      const el = await fixture(html`<${tag} rows="1" max-rows="3"></${tag}>`);
      expect(el.scrollHeight).to.be.equal(el.clientHeight);
      const oneRowHeight = el.clientHeight;

      el.rows = 3;
      el.resizeTextarea();
      await el.updateComplete;
      expect(oneRowHeight).to.be.below(el.clientHeight).and.to.be.below(el.scrollHeight);
    });

    it('has an attribute that can be used to set the placeholder text of the textarea', async () => {
      const el = await fixture(`<${tagString} placeholder="text"></${tagString}>`);
      const { _inputNode } = getFormControlMembers(el);
      expect(el.getAttribute('placeholder')).to.equal('text');
      expect(_inputNode.getAttribute('placeholder')).to.equal('text');

      el.placeholder = 'foo';
      await el.updateComplete;
      expect(el.getAttribute('placeholder')).to.equal('foo');
      expect(_inputNode.getAttribute('placeholder')).to.equal('foo');
    });

    it('uses the textarea when another element is slotted as input before it', async () => {
      const el = await fixture(`<${tagString}></${tagString}>`);
      const textarea = /** @type {HTMLTextAreaElement} */ (el.querySelector('textarea'));
      // Browser extensions like LanguageTool add an element with slot="input" before the textarea
      const mirror = document.createElement('lt-mirror');
      mirror.setAttribute('slot', 'input');
      el.insertBefore(mirror, textarea);

      const { _inputNode } = getFormControlMembers(el);
      expect(_inputNode.localName).to.equal('textarea');

      textarea.value = 'foo';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      expect(el.modelValue).to.equal('foo');
    });

    it('fires resize textarea when a visibility change has been detected', async () => {
      const el = await fixture(`
        <div style="display: none">
          <${tagString} placeholder="text"></${tagString}>
        </div>
      `);
      const textArea = /** @type {LionTextarea} */ (el.firstElementChild);
      await textArea.updateComplete;

      const resizeSpy = sinon.spy(textArea, 'resizeTextarea');
      el.style.display = 'block';
      await aTimeout(20);
      expect(resizeSpy.calledOnce).to.be.true;
    });

    it('is accessible', async () => {
      const el = await fixture(`<${tagString} label="Label"></${tagString}>`);
      await expect(el).to.be.accessible();
    });

    it('is accessible when disabled', async () => {
      const el = await fixture(`<${tagString} label="Label" disabled></${tagString}>`);
      await expect(el).to.be.accessible();
    });
  });
}
