import { html } from 'lit/static-html.js';
import { getFormControlMembers } from '@lion/ui/form-core-test-helpers.js';
import {
  unsafeStatic,
  expect,
  fixture as _fixture,
  fixtureSync,
  elementUpdated,
} from '@open-wc/testing';
import { Validator } from '@lion/ui/form-core.js';
import { LionSwitch } from '@lion/ui/switch.js';
import '@lion/ui/define/lion-switch.js';
import sinon from 'sinon';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';
import { isActiveElement } from '../../core/test-helpers/isActiveElement.js';

/**
 * @typedef {import('@lion/ui/types/test-suites.js').SuiteElement} SuiteElement
 * @typedef {import('../src/LionSwitchButton.js').LionSwitchButton} LionSwitchButton
 * @typedef {import('@lion/ui/types/form-core.js').FormControlHost} FormControlHost
 * @typedef {import('lit').TemplateResult} TemplateResult
 */

const IsTrue = class extends Validator {
  static get validatorName() {
    return 'IsTrue';
  }

  execute() {
    return true;
  }
};

/**
 * @param { LionSwitch } el
 */
function getSwitchMembers(el) {
  const obj = getFormControlMembers(/** @type { * & FormControlHost } */ (el));
  return { ...obj, _inputNode: /** @type {LionSwitchButton} */ (obj._inputNode) };
}

const fixture = /** @type {(arg: TemplateResult) => Promise<LionSwitch>} */ (_fixture);

/**
 * Runs the `lion-switch` behavioural suite, moved out of `test/lion-switch.test.js` so a Subclasser can run
 * the same guarantees against its own element. Pass `tagString` to point it at your
 * registered tag; see docs/guides/principles/test-suites.md.
 * `tagString`, `klass` and the older role tag keys are deprecated: pass `classes` instead (Lion
 * itself uses `classes` everywhere).
 * @param {import('@lion/ui/types/test-suites.js').SuiteConfig<{host: SuiteElement}>} [customConfig]
 */
export function runSwitchSuite({
  classes: { host = LionSwitch } = {},
  tagString: legacyTagString,
} = {}) {
  const tag = unsafeStatic(resolveSuiteTag(host, legacyTagString));

  describe('lion-switch', () => {
    it('should have default "input" element', async () => {
      const el = await fixture(html`<${tag}></${tag}>`);
      expect(Array.from(el.children).find(child => child.slot === 'input')).not.to.be.false;
    });

    it('clicking the label should toggle the checked state', async () => {
      const el = await fixture(html`<${tag} label="Enable Setting"></${tag}>`);
      const { _labelNode } = getFormControlMembers(el);
      _labelNode.click();
      expect(el.checked).to.be.true;
      _labelNode.click();
      expect(el.checked).to.be.false;
    });

    it('clicking the label should not toggle the checked state when disabled', async () => {
      const el = await fixture(html`<${tag} disabled label="Enable Setting"></${tag}>`);
      const { _labelNode } = getFormControlMembers(el);
      _labelNode.click();
      expect(el.checked).to.be.false;
    });

    it('clicking the label should focus the toggle button', async () => {
      const el = await fixture(html`<${tag} label="Enable Setting"></${tag}>`);
      const { _inputNode, _labelNode } = getSwitchMembers(el);

      _labelNode.click();
      expect(isActiveElement(_inputNode)).to.be.true;
    });

    it('clicking the label should not focus the toggle button when disabled', async () => {
      const el = await fixture(html`<${tag} disabled label="Enable Setting"></${tag}>`);
      const { _inputNode, _labelNode } = getSwitchMembers(el);

      _labelNode.click();
      expect(isActiveElement(_inputNode)).to.be.false;
    });

    it('clicking the label should not toggle the checked state when readonly', async () => {
      const el = await fixture(html`<${tag} readonly label="Enable Setting"></${tag}>`);
      const { _labelNode } = getFormControlMembers(el);
      _labelNode.click();
      expect(el.checked).to.be.false;
    });

    it('should sync its "disabled" state to child button', async () => {
      const el = await fixture(html`<${tag} disabled></${tag}>`);
      const { _inputNode } = getSwitchMembers(el);
      expect(_inputNode.disabled).to.be.true;
      expect(_inputNode.hasAttribute('disabled')).to.be.true;
      el.disabled = false;
      await el.updateComplete;
      await el.updateComplete; // safari takes longer
      expect(_inputNode.disabled).to.be.false;
      expect(_inputNode.hasAttribute('disabled')).to.be.false;
    });

    it('is hidden when attribute hidden is true', async () => {
      const el = await fixture(html`<${tag} hidden></${tag}>`);
      expect(el).not.to.be.displayed;
    });

    it('should sync its "checked" state to child button', async () => {
      const uncheckedEl = await fixture(html`<${tag}></${tag}>`);
      const { _inputNode: uncheckeInputNode } = getSwitchMembers(uncheckedEl);
      const checkedEl = await fixture(html`<${tag} checked></${tag}>`);
      const { _inputNode: checkeInputNode } = getSwitchMembers(checkedEl);
      expect(uncheckeInputNode.checked).to.be.false;
      expect(checkeInputNode.checked).to.be.true;
      uncheckedEl.checked = true;
      checkedEl.checked = false;
      await uncheckedEl.updateComplete;
      await checkedEl.updateComplete;
      expect(uncheckeInputNode.checked).to.be.true;
      expect(checkeInputNode.checked).to.be.false;
    });

    it('should sync "checked" state received from child button', async () => {
      const el = await fixture(html`<${tag}></${tag}>`);
      const { _inputNode } = getSwitchMembers(el);
      const button = _inputNode;
      expect(el.checked).to.be.false;
      button.click();
      expect(el.checked).to.be.true;
      button.click();
      expect(el.checked).to.be.false;
    });

    it('synchronizes modelValue to checked state and vice versa', async () => {
      const el = await fixture(html`<${tag} .choiceValue=${'foo'}></${tag}>`);
      expect(el.checked).to.be.false;
      expect(el.modelValue).to.deep.equal({
        checked: false,
        value: 'foo',
      });
      el.checked = true;
      expect(el.checked).to.be.true;
      expect(el.modelValue).to.deep.equal({
        checked: true,
        value: 'foo',
      });
    });

    it('should dispatch "checked-changed" event when toggled via button or label', async () => {
      const handlerSpy = sinon.spy();
      const el = await fixture(html`<${tag} .choiceValue=${'foo'}></${tag}>`);
      const { _inputNode, _labelNode } = getSwitchMembers(el);
      el.addEventListener('checked-changed', handlerSpy);
      _inputNode.click();
      _labelNode.click();
      await el.updateComplete;
      expect(handlerSpy.callCount).to.equal(2);
      const checkCall = /** @param {import('sinon').SinonSpyCall} call */ call => {
        expect(call.args).to.have.lengthOf(1);
        const e = call.args[0];
        expect(e).to.be.an.instanceof(Event);
        expect(e.bubbles).to.be.true;
      };
      checkCall(handlerSpy.getCall(0));
      checkCall(handlerSpy.getCall(1));
    });

    it('should dispatch "checked-changed" event when checked changed', async () => {
      const handlerSpy = sinon.spy();
      const el = await fixture(html`<${tag} .choiceValue=${'foo'}></${tag}>`);
      el.addEventListener('checked-changed', handlerSpy);
      el.checked = true;
      await el.updateComplete;
      expect(handlerSpy.callCount).to.equal(1);
    });

    it('should not propagate the "checked-changed" event further up when caught by switch', async () => {
      const handlerSpy = sinon.spy();
      const parentHandlerSpy = sinon.spy();
      const el = await fixture(html`
        <div @checked-changed=${parentHandlerSpy}>
          <${tag} @checked-changed=${handlerSpy} .choiceValue=${'foo'}></${tag}>
        </div>
      `);
      const switchEl = /** @type {LionSwitch} */ (el.firstElementChild);
      switchEl.checked = true;
      await switchEl.updateComplete;
      expect(handlerSpy.callCount).to.equal(1);
      expect(parentHandlerSpy.callCount).to.equal(0);
    });

    it('can be configured to show feedback messages immediately', async () => {
      const tagName = 'custom-switch';
      if (!customElements.get(tagName)) {
        customElements.define(
          tagName,
          class CustomSwitch extends LionSwitch {
            static get validationTypes() {
              // @ts-ignore [ts7-2855] TS7 rejects field access via super (the parent declares this as a field). Dot form kept deliberately: bracket access is exempt from property mangling (terser keep_quoted), which could split this property into two names. Upstream fix: declare an accessor in the parent type
              return [...super.validationTypes, 'info'];
            }

            /**
             * @param {string} type
             * @param {object} meta
             */
            _showFeedbackConditionFor(type, meta) {
              if (type === 'info') {
                return true;
              }
              return super._showFeedbackConditionFor(type, meta);
            }
          },
        );
      }
      const el = await fixture(
        html`<custom-switch
          .validators="${[new IsTrue({}, { type: 'info' })]}"
          .feedbackCondition="${(
            /** @type {string} */ type,
            /** @type {object} */ meta,
            /** @type {(type: string, meta: object) => any} */ defaultCondition,
          ) => {
            if (type === 'info') {
              return true;
            }
            return defaultCondition(type, meta);
          }}"
        ></custom-switch>`,
      );
      expect(el.showsFeedbackFor).to.eql(['info']);
    });

    describe('Accessibility', () => {
      it('passes axe a11y audit', async () => {
        const el = await fixture(html`<${tag} name="hi" label="My label"></${tag}>`);
        await expect(el).to.be.accessible();

        el.checked = true;
        await el.updateComplete;
        await expect(el).to.be.accessible();
      });

      it('passes axe a11y audit when disabled', async () => {
        const el = await fixture(html`<${tag} name="hi" label="My label" disabled></${tag}>`);
        await expect(el).to.be.accessible();

        el.checked = true;
        await el.updateComplete;
        await expect(el).to.be.accessible();
      });
    });

    describe("lion-switch-button, the switch's inner button", () => {
      /** @type {LionSwitchButton} */
      let el;
      beforeEach(async () => {
        // The switch is the surface; its inner button is what a user touches. These guarantees run
        // against the button the host renders instead of through a separate `lion-switch-button` suite.
        const hostEl = await fixture(html`<${tag}></${tag}>`);
        el = /** @type {LionSwitchButton} */ (getSwitchMembers(hostEl)._inputNode);
      });

      it('should be focusable', () => {
        expect(el.tabIndex).to.equal(0);
        expect(el.getAttribute('tabindex')).to.equal('0');
      });

      it('should not have a [type]', () => {
        expect(el.hasAttribute('type')).to.be.false;
      });

      it('should have checked=false by default', () => {
        expect(el.checked).to.equal(false);
        expect(el.hasAttribute('checked')).to.be.false;
      });

      it('is hidden when attribute hidden is true', async () => {
        el.hidden = true;
        await el.updateComplete;
        expect(el).not.to.be.displayed;
      });

      it('should toggle the value of "checked" on click', async () => {
        expect(el.checked).to.be.false;
        expect(el.hasAttribute('checked')).to.be.false;
        el.click();
        await el.updateComplete;
        expect(el.checked).to.be.true;
        expect(el.hasAttribute('checked')).to.be.true;
        el.click();
        await el.updateComplete;
        expect(el.checked).to.be.false;
        expect(el.hasAttribute('checked')).to.be.false;
      });

      it('should toggle the value of "checked" on key-up', async () => {
        expect(el.checked).to.be.false;
        expect(el.hasAttribute('checked')).to.be.false;
        el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
        await el.updateComplete;
        expect(el.checked).to.be.true;
        expect(el.hasAttribute('checked')).to.be.true;
        el.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
        await el.updateComplete;
        expect(el.checked).to.be.false;
        expect(el.hasAttribute('checked')).to.be.false;
      });

      it('can be disabled', async () => {
        el.disabled = true;
        expect(el.checked).to.be.false;
        el.click();
        await el.updateComplete;
        expect(el.checked).to.be.false;
        expect(el.hasAttribute('checked')).to.be.false;
        el.disabled = true;
        el.checked = true;
        el.click();
        await el.updateComplete;
        expect(el.checked).to.be.true;
        expect(el.hasAttribute('checked')).to.be.true;
      });

      it('can be readonly', async () => {
        el.readOnly = true;
        expect(el.checked).to.be.false;
        el.click();
        await el.updateComplete;
        expect(el.checked).to.be.false;
        expect(el.hasAttribute('checked')).to.be.false;
        el.checked = true;
        el.click();
        await el.updateComplete;
        expect(el.checked).to.be.true;
        expect(el.hasAttribute('checked')).to.be.true;
      });

      it('should dispatch "checked-changed" event when toggled', () => {
        const handlerSpy = sinon.spy();
        el.addEventListener('checked-changed', handlerSpy);
        el.click();
        el.click();
        expect(handlerSpy.callCount).to.equal(2);
        const checkCall = /** @param {import('sinon').SinonSpyCall} call */ call => {
          expect(call.args).to.have.lengthOf(1);
          const e = call.args[0];
          expect(e).to.be.an.instanceof(Event);
          expect(e.bubbles).to.be.true;
        };
        checkCall(handlerSpy.getCall(0));
        checkCall(handlerSpy.getCall(1));
      });

      it('should dispatch "checked-changed" event when checked changed', () => {
        const handlerSpy = sinon.spy();
        el.addEventListener('checked-changed', handlerSpy);
        el.checked = true;
        el.checked = false;
        expect(handlerSpy.callCount).to.equal(2);
        const checkCall = /** @param {import('sinon').SinonSpyCall} call */ call => {
          expect(call.args).to.have.lengthOf(1);
          const e = call.args[0];
          expect(e).to.be.an.instanceof(Event);
          expect(e.bubbles).to.be.true;
        };
        checkCall(handlerSpy.getCall(0));
        checkCall(handlerSpy.getCall(1));
      });

      it('should not dispatch "checked-changed" event if disabled', () => {
        const handlerSpy = sinon.spy();
        el.disabled = true;
        el.addEventListener('checked-changed', handlerSpy);
        el.click();
        expect(handlerSpy.called).to.be.false;
      });

      it('should not dispatch "checked-changed" event if readonly', () => {
        const handlerSpy = sinon.spy();
        el.readOnly = true;
        el.addEventListener('checked-changed', handlerSpy);
        el.click();
        expect(handlerSpy.called).to.be.false;
      });

      it('should not dispatch "checked-changed" event if disabled on update', () => {
        const handlerSpy = sinon.spy();
        el.disabled = true;
        el.addEventListener('checked-changed', handlerSpy);
        el.checked = !el.checked;
        expect(handlerSpy.called).to.be.false;
      });

      it('should not dispatch "checked-changed" event if readonly on update', () => {
        const handlerSpy = sinon.spy();
        el.readOnly = true;
        el.addEventListener('checked-changed', handlerSpy);
        el.checked = !el.checked;
        expect(handlerSpy.called).to.be.false;
      });

      it('should not dispatch "checked-changed" event if not initialized on update', async () => {
        const handlerSpy = sinon.spy();
        const hostEl = /** @type {LionSwitch} */ (
          fixtureSync(html`<${tag} .checked=${true}></${tag}>`)
        );
        await hostEl.updateComplete;
        const btn = /** @type {LionSwitchButton} */ (getSwitchMembers(hostEl)._inputNode);
        btn.addEventListener('checked-changed', handlerSpy);
        await elementUpdated(btn);
        expect(handlerSpy.called).to.be.false;
        hostEl.checked = !hostEl.checked;
        await elementUpdated(btn);
        expect(handlerSpy.called).to.be.true;
      });

      describe('a11y', () => {
        it('should manage "aria-checked"', async () => {
          expect(el.hasAttribute('aria-checked')).to.be.true;
          expect(el.getAttribute('aria-checked')).to.equal('false');

          el.click();
          await el.updateComplete;
          expect(el.getAttribute('aria-checked')).to.equal('true');
          el.click();
          await el.updateComplete;
          expect(el.getAttribute('aria-checked')).to.equal('false');

          el.checked = true;
          await el.updateComplete;
          expect(el.getAttribute('aria-checked')).to.equal('true');
          el.checked = false;
          await el.updateComplete;
          expect(el.getAttribute('aria-checked')).to.equal('false');

          el.setAttribute('checked', '');
          await el.updateComplete;
          expect(el.getAttribute('aria-checked')).to.equal('true');
          el.removeAttribute('checked');
          await el.updateComplete;
          expect(el.getAttribute('aria-checked')).to.equal('false');
        });
      });
      it('should manage "aria-disabled"', async () => {
        el.disabled = true;
        await el.updateComplete;
        expect(el.getAttribute('aria-disabled')).to.equal('true');
        el.disabled = false;
        await el.updateComplete;
        expect(el.getAttribute('aria-disabled')).to.equal('false');
      });
      it('should manage "aria-readonly"', async () => {
        el.readOnly = true;
        await el.updateComplete;
        expect(el.getAttribute('aria-readonly')).to.equal('true');
        el.readOnly = false;
        await el.updateComplete;
        expect(el.getAttribute('aria-readonly')).to.equal('false');
      });
    });
  });
}
