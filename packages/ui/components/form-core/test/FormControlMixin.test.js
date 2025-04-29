import { LitElement } from 'lit';
import { getFormControlMembers } from '@lion/ui/form-core-test-helpers.js';
import { defineCE, expect, fixture, html, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';
import {
  FocusMixin,
  FormGroupMixin,
  FormControlMixin,
  FormRegistrarMixin,
} from '@lion/ui/form-core.js';

/**
 * @typedef {import('../types/FormControlMixinTypes.js').FormControlHost} FormControlHost
 */

describe('FormControlMixin', () => {
  const inputSlot = html`<input slot="input" />`;

  class FormControlMixinClass extends FormControlMixin(LitElement) {}

  const tagString = defineCE(FormControlMixinClass);
  const tag = unsafeStatic(tagString);

  it('is hidden when attribute hidden is true', async () => {
    const el = await fixture(html`
    <${tag} hidden>
    <label slot="label">Email <span>address</span></label>
        ${inputSlot}
    </${tag}>`);
    expect(el).not.to.be.displayed;
  });

  describe('Label and helpText api', () => {
    it('has a label', async () => {
      const elAttr = /** @type {FormControlMixinClass} */ (
        await fixture(html`
        <${tag} label="Email address">${inputSlot}</${tag}>
      `)
      );

      expect(elAttr.label).to.equal('Email address', 'as an attribute');

      const elProp = /** @type {FormControlMixinClass} */ (
        await fixture(html`
        <${tag}
          .label=${'Email address'}
        >${inputSlot}
        </${tag}>`)
      );
      expect(elProp.label).to.equal('Email address', 'as a property');

      const elElem = /** @type {FormControlMixinClass} */ (
        await fixture(html`
        <${tag}>
          <label slot="label"><b>Email</b> address</label>
          ${inputSlot}
        </${tag}>`)
      );
      expect(elElem.label).to.equal('Email address', 'as an element');
      // @ts-expect-error
      expect(elElem._labelNode.innerHTML).to.equal('<b>Email</b> address', 'html as an element');
    });

    it('has a label that supports inner html', async () => {
      const el = /** @type {FormControlMixinClass} */ (
        await fixture(html`
        <${tag}>
          <label slot="label">Email <span>address</span></label>
          ${inputSlot}
        </${tag}>`)
      );
      expect(el.label).to.equal('Email address');
      // @ts-expect-error
      expect(el._labelNode.innerHTML).to.equal('Email <span>address</span>');
    });

    it('only takes label of direct child', async () => {
      const el = /** @type {FormControlMixinClass} */ (
        await fixture(html`
        <${tag}>
          <${tag} label="Email address">
            ${inputSlot}
          </${tag}>
        </${tag}>`)
      );
      expect(el.label).to.equal('');
    });

    /**
     * N.B. For platform controls, the same would be achieved with <input aria-label="My label">
     * However, since FormControl is usually not the activeElement (_inputNode is), this
     * will not have the desired effect on for instance lion-input
     */
    it('supports "label-sr-only" to make label visually hidden, but accessible for screen reader users', async () => {
      const el = /** @type {FormControlMixinClass} */ (
        await fixture(html`
        <${tag} label-sr-only>
          <label slot="label">Email <span>address</span></label>
          ${inputSlot}
        </${tag}>`)
      );

      const expectedValues = {
        position: 'absolute',
        top: '0px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        clipPath: 'inset(100%)',
        clip: 'rect(1px, 1px, 1px, 1px)',
        whiteSpace: 'nowrap',
        borderWidth: '0px',
        margin: '0px',
        padding: '0px',
      };

      const labelStyle = window.getComputedStyle(
        // @ts-ignore
        el.shadowRoot?.querySelector('.form-field__label'),
      );
      Object.entries(expectedValues).forEach(([key, val]) => {
        expect(labelStyle[key]).to.equal(val);
      });
    });

    it('can have a help-text', async () => {
      const elAttr = /** @type {FormControlMixinClass} */ (
        await fixture(html`
        <${tag} help-text="We will not send you any spam">${inputSlot}</${tag}>
      `)
      );
      expect(elAttr.helpText).to.equal('We will not send you any spam', 'as an attribute');

      const elProp = /** @type {FormControlMixinClass} */ (
        await fixture(html`
        <${tag}
          .helpText=${'We will not send you any spam'}
        >${inputSlot}
        </${tag}>`)
      );
      expect(elProp.helpText).to.equal('We will not send you any spam', 'as a property');

      const elElem = /** @type {FormControlMixinClass} */ (
        await fixture(html`
        <${tag}>
          <div slot="help-text">We will <b>not</b> send you any spam</div>
          ${inputSlot}
        </${tag}>`)
      );
      expect(elElem.helpText).to.equal('We will not send you any spam', 'as an element');
      // @ts-expect-error
      expect(elElem._helpTextNode.innerHTML).to.equal('We will <b>not</b> send you any spam');
    });

    it('can have a help-text that supports inner html', async () => {
      const el = /** @type {FormControlMixinClass} */ (
        await fixture(html`
        <${tag}>
          <div slot="help-text">We will not send you any <span>spam</span></div>
          ${inputSlot}
        </${tag}>`)
      );
      expect(el.helpText).to.equal('We will not send you any spam');
      // @ts-expect-error
      expect(el._helpTextNode.innerHTML).to.equal('We will not send you any <span>spam</span>');
    });

    it('only takes help-text of direct child', async () => {
      const el = /** @type {FormControlMixinClass} */ (
        await fixture(html`
        <${tag}>
          <${tag} help-text="We will not send you any spam">
            ${inputSlot}
          </${tag}>
        </${tag}>`)
      );
      expect(el.helpText).to.equal('');
    });
  });

  describe('Accessibility', () => {
    it('does not duplicate aria-describedby and aria-labelledby ids on reconnect', async () => {
      const wrapper = /** @type {HTMLElement} */ (
        await fixture(html`
        <div id="wrapper">
          <${tag} help-text="This element will be disconnected/reconnected">${inputSlot}</${tag}>
        </div>
      `)
      );
      const el = /** @type {FormControlMixinClass} */ (wrapper.querySelector(tagString));
      const { _inputNode } = getFormControlMembers(el);

      const labelIdsBefore = /** @type {string} */ (_inputNode.getAttribute('aria-labelledby'));
      const descriptionIdsBefore = /** @type {string} */ (
        _inputNode.getAttribute('aria-describedby')
      );
      // Reconnect
      wrapper.removeChild(el);
      wrapper.appendChild(el);
      const labelIdsAfter = /** @type {string} */ (_inputNode.getAttribute('aria-labelledby'));
      const descriptionIdsAfter = /** @type {string} */ (
        _inputNode.getAttribute('aria-describedby')
      );

      expect(labelIdsBefore).to.equal(labelIdsAfter);
      expect(descriptionIdsBefore).to.equal(descriptionIdsAfter);
    });

    it('sets aria-disabled on inputNode based on disabled property', async () => {
      const el = /** @type {FormControlMixinClass} */ (
        await fixture(html`
          <${tag}>${inputSlot}</${tag}>
      `)
      );
      const { _inputNode } = getFormControlMembers(el);
      expect(_inputNode.hasAttribute('aria-disabled')).to.be.true;
      expect(_inputNode.getAttribute('aria-disabled')).to.equal('false');

      el.disabled = true;

      expect(_inputNode.getAttribute('aria-disabled')).to.equal('false');
    });

    it('clicking the label should call `_onLabelClick`', async () => {
      const spy = sinon.spy();
      const el = /** @type {FormControlMixinClass} */ (
        await fixture(html`
        <${tag} ._onLabelClick="${spy}">
          ${inputSlot}
        </${tag}>
      `)
      );
      const { _labelNode } = getFormControlMembers(el);

      expect(spy).to.not.have.been.called;
      _labelNode.click();
      expect(spy).to.have.been.calledOnce;
    });

    describe('Feedback slot aria-live', () => {
      // See: https://www.w3.org/WAI/tutorials/forms/notifications/#on-focus-change
      it(`adds aria-live="polite" to the feedback slot on focus, aria-live="assertive" to the feedback slot on blur,
        so error messages appearing on blur will be read before those of the next input`, async () => {
        const FormControlWithRegistrarMixinClass = class extends FormGroupMixin(LitElement) {};

        const groupTagString = defineCE(FormControlWithRegistrarMixinClass);
        const groupTag = unsafeStatic(groupTagString);

        const focusableTagString = defineCE(
          class extends FocusMixin(FormControlMixin(LitElement)) {
            /**
             * @configure FocusMixin
             */
            get _focusableNode() {
              return this._inputNode;
            }
          },
        );
        const focusableTag = unsafeStatic(focusableTagString);

        const formEl = await fixture(html`
          <${groupTag} name="form">
            <${groupTag} name="fieldset">
              <${focusableTag} name="field1">
                ${inputSlot}
                <div slot="feedback">
                  Error message with:
                  - aria-live="polite" on focused (during typing an end user should not be bothered for best UX)
                  - aria-live="assertive" on blur (so that the message that eventually appears
                    on blur will be read before message of the next focused input)
                </div>
              </${focusableTag}>
              <${focusableTag} name="field2">
                ${inputSlot}
                <div slot="feedback">
                  Should be read after the error message of field 1
                </div>
              </${focusableTag}>
              <div slot="feedback">
                Group message... Should be read after the error message of field 2
              </div>
            </${groupTag}>
            <${focusableTag} name="field3">
              ${inputSlot}
              <div slot="feedback">
              Should be read after the error message of field 2
              </div>
            </${focusableTag}>
          </${groupTag}>
        `);

        /**
         * @typedef {* & import('../types/FormControlMixinTypes.js').FormControlHost} FormControl
         */
        const field1El = /** @type {FormControl} */ (formEl.querySelector('[name=field1]'));
        const field2El = /** @type {FormControl} */ (formEl.querySelector('[name=field2]'));
        const field3El = /** @type {FormControl} */ (formEl.querySelector('[name=field3]'));
        const fieldsetEl = /** @type {FormControl} */ (formEl.querySelector('[name=fieldset]'));

        field1El.focus();
        expect(field1El._feedbackNode.getAttribute('aria-live')).to.equal('polite');

        field2El.focus();
        // field1El just blurred
        expect(field1El._feedbackNode.getAttribute('aria-live')).to.equal('assertive');
        expect(field2El._feedbackNode.getAttribute('aria-live')).to.equal('polite');

        field3El.focus();
        // field2El just blurred
        expect(field2El._feedbackNode.getAttribute('aria-live')).to.equal('assertive');
        // fieldsetEl just blurred

        expect(fieldsetEl._feedbackNode.getAttribute('aria-live')).to.equal('assertive');
        expect(field3El._feedbackNode.getAttribute('aria-live')).to.equal('polite');
      });
    });

    describe('Adding extra labels and descriptions', () => {
      it(`supports centrally orchestrated labels/descriptions via addToAriaLabelledBy() /
      removeFromAriaLabelledBy() / addToAriaDescribedBy() / removeFromAriaDescribedBy()`, async () => {
        const wrapper = /** @type {HTMLElement} */ (
          await fixture(html`
          <div id="wrapper">
            <${tag}>
              ${inputSlot}
              <label slot="label">Added to label by default</label>
              <div slot="feedback">Added to description by default</div>
            </${tag}>
            <div id="additionalLabel"> This also needs to be read whenever the input has focus</div>
            <div id="additionalDescription"> Same for this </div>
          </div>`)
        );
        const el = /** @type {FormControlMixinClass} */ (wrapper.querySelector(tagString));
        const { _inputNode } = getFormControlMembers(el);

        // wait until the field element is done rendering
        await el.updateComplete;
        await el.updateComplete;

        // @ts-ignore allow protected accessors in tests
        const inputId = el._inputId;

        // 1a. addToAriaLabelledBy()
        // Check if the aria attr is filled initially
        expect(/** @type {string} */ (_inputNode.getAttribute('aria-labelledby'))).to.contain(
          `label-${inputId}`,
        );
        const additionalLabel = /** @type {HTMLElement} */ (
          wrapper.querySelector('#additionalLabel')
        );
        el.addToAriaLabelledBy(additionalLabel);
        await el.updateComplete;
        let labelledbyAttr = /** @type {string} */ (_inputNode.getAttribute('aria-labelledby'));
        // Now check if ids are added to the end (not overridden)
        expect(labelledbyAttr).to.contain(`additionalLabel`);
        // Should be placed in the end
        expect(
          labelledbyAttr.indexOf(`label-${inputId}`) < labelledbyAttr.indexOf('additionalLabel'),
        );

        // 1b. removeFromAriaLabelledBy()
        el.removeFromAriaLabelledBy(additionalLabel);
        await el.updateComplete;
        labelledbyAttr = /** @type {string} */ (_inputNode.getAttribute('aria-labelledby'));
        // Now check if ids are added to the end (not overridden)
        expect(labelledbyAttr).to.not.contain(`additionalLabel`);

        // 2a. addToAriaDescribedBy()
        // Check if the aria attr is filled initially
        expect(/** @type {string} */ (_inputNode.getAttribute('aria-describedby'))).to.contain(
          `feedback-${inputId}`,
        );
      });

      it('sorts internal elements based on assigned slots, and allows opt-out', async () => {
        const wrapper = await fixture(html`
          <div id="wrapper">
            <${tag}>
              <input slot="input" id="myInput" />
              <label slot="label" id="internalLabel">Added to label by default</label>
              <div slot="help-text" id="internalDescription">
                Added to description by default
              </div>
            </${tag}>
          </div>
        `);
        const el = /** @type {FormControlMixinClass} */ (wrapper.querySelector(tagString));
        const { _inputNode } = getFormControlMembers(el);

        // N.B. in real life we would never add the input to aria-describedby or -labelledby,
        // but this example purely demonstrates dom order is respected.
        // A real life scenario would be for instance when
        // a Field or FormGroup would be extended and an extra slot would be added in the template
        const myInput = /** @type {HTMLElement} */ (wrapper.querySelector('#myInput'));
        const internalLabel = /** @type {HTMLElement} */ (wrapper.querySelector('#internalLabel'));
        const internalDescription = /** @type {HTMLElement} */ (
          wrapper.querySelector('#internalDescription')
        );

        el.addToAriaLabelledBy(myInput);
        await el.updateComplete;
        el.addToAriaDescribedBy(myInput);
        await el.updateComplete;

        expect(
          /** @type {string} */ (_inputNode.getAttribute('aria-labelledby')).split(' '),
        ).to.eql(['internalLabel', 'myInput']);
        expect(
          /** @type {string} */ (_inputNode.getAttribute('aria-describedby')).split(' '),
        ).to.eql(['internalDescription', 'myInput']);

        // cleanup
        el.removeFromAriaLabelledBy(internalLabel);
        await el.updateComplete;
        el.removeFromAriaDescribedBy(internalDescription);
        await el.updateComplete;

        // opt-out of reorder
        el.addToAriaLabelledBy(internalLabel, { reorder: false });
        await el.updateComplete;
        el.addToAriaDescribedBy(internalDescription, { reorder: false });
        await el.updateComplete;

        expect(
          /** @type {string} */ (_inputNode.getAttribute('aria-labelledby')).split(' '),
        ).to.eql(['myInput', 'internalLabel']);
        expect(
          /** @type {string} */ (_inputNode.getAttribute('aria-describedby')).split(' '),
        ).to.eql(['myInput', 'internalDescription']);
      });

      it('respects provided order for external elements', async () => {
        const wrapper = await fixture(html`
        <div id="wrapper">
          <div id="externalLabelA">should go after input internals</div>
          <div id="externalDescriptionA">should go after input internals</div>
          <${tag}>
            <input slot="input" />
            <label slot="label" id="internalLabel">Added to label by default</label>
            <div slot="help-text" id="internalDescription">Added to description by default</div>
          </${tag}>
          <div id="externalLabelB">should go after input internals</div>
          <div id="externalDescriptionB">should go after input internals</div>
        </div>`);
        const el = /** @type {FormControlMixinClass} */ (wrapper.querySelector(tagString));
        const { _inputNode } = getFormControlMembers(el);

        // 1. addToAriaLabelledBy()
        const labelA = /** @type {HTMLElement} */ (wrapper.querySelector('#externalLabelA'));
        const labelB = /** @type {HTMLElement} */ (wrapper.querySelector('#externalLabelB'));
        // external inputs should go in order defined by user
        el.addToAriaLabelledBy(labelA);
        el.addToAriaLabelledBy(labelB);
        await el.updateComplete;

        expect(
          /** @type {string} */ (_inputNode.getAttribute('aria-labelledby')).split(' '),
        ).to.eql(['internalLabel', 'externalLabelA', 'externalLabelB']);

        // 2. addToAriaDescribedBy()
        const descrA = /** @type {HTMLElement} */ (wrapper.querySelector('#externalDescriptionA'));
        const descrB = /** @type {HTMLElement} */ (wrapper.querySelector('#externalDescriptionB'));

        el.addToAriaDescribedBy(descrA);
        el.addToAriaDescribedBy(descrB);
        await el.updateComplete;

        expect(
          /** @type {string} */ (_inputNode.getAttribute('aria-describedby')).split(' '),
        ).to.eql(['internalDescription', 'externalDescriptionA', 'externalDescriptionB']);
      });
    });
  });

  describe('Model-value-changed event propagation', () => {
    const FormControlWithRegistrarMixinClass = class extends FormControlMixin(
      FormRegistrarMixin(LitElement),
    ) {};

    const groupElem = defineCE(FormControlWithRegistrarMixinClass);
    const groupTag = unsafeStatic(groupElem);

    describe('On initialization', () => {
      it('redispatches one event from host', async () => {
        const formSpy = sinon.spy();
        const fieldsetSpy = sinon.spy();
        const formEl = /** @type {FormControlMixinClass} */ (
          await fixture(html`
          <${groupTag} name="form" ._repropagationRole=${'form-group'} @model-value-changed=${formSpy}>
            <${groupTag} name="fieldset" ._repropagationRole=${'form-group'} @model-value-changed=${fieldsetSpy}>
              <${tag} name="field"></${tag}>
            </${groupTag}>
          </${groupTag}>
        `)
        );
        const fieldsetEl = formEl.querySelector('[name=fieldset]');

        expect(fieldsetSpy.callCount).to.equal(1);
        const fieldsetEv = fieldsetSpy.firstCall.args[0];
        expect(fieldsetEv.target).to.equal(fieldsetEl);
        expect(fieldsetEv.detail.formPath).to.eql([fieldsetEl]);
        expect(fieldsetEv.detail.initialize).to.be.true;

        expect(formSpy.callCount).to.equal(1);
        const formEv = formSpy.firstCall.args[0];
        expect(formEv.target).to.equal(formEl);
        expect(formEv.detail.formPath).to.eql([formEl]);
        expect(formEv.detail.initialize).to.be.true;
      });
    });

    /**
     * After initialization means: events triggered programmatically or by user actions
     */
    describe('After initialization', () => {
      it('redispatches one event from host and keeps formPath history', async () => {
        const formSpy = sinon.spy();
        const fieldsetSpy = sinon.spy();
        const fieldSpy = sinon.spy();
        const formEl = await fixture(html`
          <${groupTag} name="form">
            <${groupTag} name="fieldset">
              <${tag} name="field"></${tag}>
            </${groupTag}>
          </${groupTag}>
        `);
        const fieldEl = formEl.querySelector('[name=field]');
        const fieldsetEl = formEl.querySelector('[name=fieldset]');

        formEl.addEventListener('model-value-changed', formSpy);
        fieldsetEl?.addEventListener('model-value-changed', fieldsetSpy);
        fieldEl?.addEventListener('model-value-changed', fieldSpy);

        fieldEl?.dispatchEvent(new Event('model-value-changed', { bubbles: true }));

        expect(fieldsetSpy.callCount).to.equal(1);
        const fieldsetEv = fieldsetSpy.firstCall.args[0];
        expect(fieldsetEv.target).to.equal(fieldsetEl);
        expect(fieldsetEv.detail.formPath).to.eql([fieldEl, fieldsetEl]);

        expect(formSpy.callCount).to.equal(1);
        const formEv = formSpy.firstCall.args[0];
        expect(formEv.target).to.equal(formEl);
        expect(formEv.detail.formPath).to.eql([fieldEl, fieldsetEl, formEl]);
      });

      it('sets "isTriggeredByUser" event detail when event triggered by user', async () => {
        const formSpy = sinon.spy();
        const fieldsetSpy = sinon.spy();
        const fieldSpy = sinon.spy();
        const formEl = await fixture(html`
          <${groupTag} name="form">
            <${groupTag} name="fieldset">
              <${tag} name="field"></${tag}>
            </${groupTag}>
          </${groupTag}>
        `);
        const fieldEl = formEl.querySelector('[name=field]');
        const fieldsetEl = formEl.querySelector('[name=fieldset]');

        formEl.addEventListener('model-value-changed', formSpy);
        fieldsetEl?.addEventListener('model-value-changed', fieldsetSpy);
        fieldEl?.addEventListener('model-value-changed', fieldSpy);

        fieldEl?.dispatchEvent(
          new CustomEvent('model-value-changed', {
            bubbles: true,
            detail: { isTriggeredByUser: true },
          }),
        );

        const fieldsetEv = fieldsetSpy.firstCall.args[0];
        expect(fieldsetEv.detail.isTriggeredByUser).to.be.true;

        const formEv = formSpy.firstCall.args[0];
        expect(formEv.detail.isTriggeredByUser).to.be.true;
      });
    });
  });
});
