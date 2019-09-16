/* eslint-disable no-unused-vars, no-param-reassign */
import { expect, fixture, html, unsafeStatic, defineCE, aTimeout } from '@open-wc/testing';
import sinon from 'sinon';
import { LionLitElement } from '@lion/core/src/LionLitElement.js';
import { localizeTearDown } from '@lion/localize/test-helpers.js';
import { localize } from '@lion/localize';

import { ValidateMixin } from '../../src/compat-layer/ValidateMixin.js';
import { Unparseable } from '../../src/Unparseable.js';
import { Validator } from '../../src/Validator.js';

// element, lightDom, errorShowPrerequisite, warningShowPrerequisite, infoShowPrerequisite,
// successShowPrerequisite

const externalVariables = {};
const suffixName = '';
const lightDom = '';

const tagString = defineCE(
  class extends ValidateMixin(LionLitElement) {
    static get properties() {
      return {
        modelValue: {
          type: String,
        },
      };
    }
  },
);

const defaultRequiredFn = modelValue => ({ required: modelValue !== '' });

const tag = unsafeStatic(tagString);

beforeEach(() => {
  localizeTearDown();
});

describe('ValidateMixin', () => {
  // it('supports multiple validator types: error, warning, info and success [spec-to-be-implemented]', () => {
  //   // TODO: implement spec
  // });

  /**
   *   Terminology
   *
   * - *validatable-field*
   *   The element ('this') the ValidateMixin is applied on.
   *
   * - *input-element*
   *   The 'this.inputElement' property (usually a getter) that returns/contains a reference to an
   *   interaction element that receives focus, displays the input value, interaction states are
   *   derived from, aria properties are put on and setCustomValidity (if applicable) is called on.
   *   Can be input, textarea, my-custom-slider etc.
   *
   * - *feedback-element*
   *   The 'this._feedbackNode' property (usually a getter) that returns/contains a reference to
   *   the output container for validation feedback. Messages will be written to this element
   *   based on user defined or default validity feedback visibility conditions.
   *
   * - *show-{type}-feedback-condition*
   *   The 'this.show-{'error'|'warning'|'info'|'success'}' value that stores whether the
   *   feedback for the particular validation type should be shown to the end user.
   */
  it('validates immediately (once form field has bootstrapped/initialized)', async () => {
    function alwaysFalse() {
      return { alwaysFalse: false };
    }

    const el = await fixture(html`
      <${tag}
        .errorValidators=${[[alwaysFalse]]}
        .warningValidators=${[[alwaysFalse]]}
        .infoValidators=${[[alwaysFalse]]}
        .successValidators=${[[alwaysFalse]]}
        .modelValue=${'trigger initial validation'}
      >${lightDom}</${tag}>
    `);

    expect(el.errorState).to.equal(true);
    expect(el.warningState).to.equal(true);
    expect(el.infoState).to.equal(true);
    expect(el.successState).to.equal(true);
  });

  it('revalidates when value changes', async () => {
    function alwaysTrue() {
      return { alwaysTrue: true };
    }
    const el = await fixture(html`
      <${tag}
        .errorValidators=${[[alwaysTrue]]}
        .modelValue=${'myValue'}
      >${lightDom}</${tag}>
    `);

    const validateSpy = sinon.spy(el, 'validate');
    el.modelValue = 'x';
    expect(validateSpy.callCount).to.equal(1);
  });

  // TODO: fix and renable
  it.skip('reconsiders feedback visibility when interaction states changed', async () => {
    // see https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
    async function asyncForEach(array, callback) {
      for (let i = 0; i < array.length; i += 1) {
        // we explicitly want to run it one after each other
        await callback(array[i], i, array); // eslint-disable-line no-await-in-loop
      }
    }

    const el = await fixture(html`
      <${tag}
        .errorValidators=${[
          [
            () => {
              true;
            },
          ],
        ]}
        .modelValue=${'myValue'}
      >${lightDom}</${tag}>
    `);

    const messageSpy = sinon.spy(el, '_createMessageAndRenderFeedback');
    await asyncForEach(['dirty', 'touched', 'prefilled', 'submitted'], async (state, i) => {
      el[state] = false;
      await el.updateComplete;
      el[state] = true;
      await el.updateComplete;
      expect(messageSpy.callCount).to.equal(i + 1);
    });
  });

  it('works with viewValue when input is not parseable', async () => {
    const otherValidatorSpy = sinon.spy(value => ({ otherValidator: false }));
    await fixture(html`
      <${tag}
        .errorValidators=${[['required'], [otherValidatorSpy]]}
        .__isRequired=${defaultRequiredFn}
        .modelValue=${new Unparseable('foo')}
      >${lightDom}</${tag}>
    `);
    expect(otherValidatorSpy.calledWith('foo')).to.equal(true);
  });

  // classes are added only for backward compatibility - they are deprecated
  it('sets a class "state-(error|warning|info|success|invalid)"', async () => {
    const el = await fixture(html`<${tag}></${tag}>`);
    el.errorState = true;
    await el.updateComplete;
    expect(el.classList.contains('state-error')).to.equal(true, 'has class "state-error"');

    el.warningState = true;
    await el.updateComplete;
    expect(el.classList.contains('state-warning')).to.equal(true, 'has class "state-warning"');

    el.infoState = true;
    await el.updateComplete;
    expect(el.classList.contains('state-info')).to.equal(true, 'has class "state-info"');

    el.successState = true;
    await el.updateComplete;
    expect(el.classList.contains('state-success')).to.equal(true, 'has class "state-success"');

    el.invalid = true;
    await el.updateComplete;
    expect(el.classList.contains('state-invalid')).to.equal(true, 'has class "state-invalid"');
  });

  it('sets a class "state-(error|warning|info|success)-show"', async () => {
    const el = await fixture(html`<${tag}></${tag}>`);
    el.errorShow = true;
    await el.updateComplete;
    expect(el.classList.contains('state-error-show')).to.equal(
      true,
      'has class "state-error-show"',
    );

    el.warningShow = true;
    await el.updateComplete;
    expect(el.classList.contains('state-warning-show')).to.equal(
      true,
      'has class "state-warning-show"',
    );

    el.infoShow = true;
    await el.updateComplete;
    expect(el.classList.contains('state-info-show')).to.equal(true, 'has class "state-info-show"');

    el.successShow = true;
    await el.updateComplete;
    expect(el.classList.contains('state-success-show')).to.equal(
      true,
      'has class "state-success-show"',
    );
  });

  it('sets attribute "(error|warning|info|success|invalid)-state"', async () => {
    const el = await fixture(html`<${tag}></${tag}>`);
    el.errorState = true;
    await el.updateComplete;
    expect(el.hasAttribute('error-state'), 'has error-state attribute').to.be.true;

    el.warningState = true;
    await el.updateComplete;
    expect(el.hasAttribute('warning-state'), 'has warning-state attribute').to.be.true;

    el.infoState = true;
    await el.updateComplete;
    expect(el.hasAttribute('info-state'), 'has info-state attribute').to.be.true;

    el.successState = true;
    await el.updateComplete;
    expect(el.hasAttribute('success-state'), 'has error-state attribute').to.be.true;

    el.invalid = true;
    await el.updateComplete;
    expect(el.hasAttribute('invalid'), 'has invalid attribute').to.be.true;
  });

  it('sets attribute "(error|warning|info|success)-show"', async () => {
    const el = await fixture(html`<${tag}></${tag}>`);
    el.errorShow = true;
    await el.updateComplete;
    expect(el.hasAttribute('error-show'), 'has error-show attribute').to.be.true;

    el.warningShow = true;
    await el.updateComplete;
    expect(el.hasAttribute('warning-show'), 'has warning-show attribute').to.be.true;

    el.infoShow = true;
    await el.updateComplete;
    expect(el.hasAttribute('info-show'), 'has info-show attribute').to.be.true;

    el.successShow = true;
    await el.updateComplete;
    expect(el.hasAttribute('success-show'), 'has success-show attribute').to.be.true;
  });

  describe('Validators', () => {
    function isCat(modelValue, opts) {
      const validateString = opts && opts.number ? `cat${opts.number}` : 'cat';
      return { isCat: modelValue === validateString };
    }

    it('is plain js function returning { validatorName: true/false }', async () => {
      const el = await fixture(html`
        <${tag}
          .modelValue=${'cat'}
          .errorValidators=${[[isCat]]}
        >${lightDom}</${tag}>
      `);
      expect(typeof el.errorValidators[0][0]).to.equal('function');
      expect(el.errorValidators[0][0]('cat').isCat).to.equal(true);
      expect(el.errorValidators[0][0]('dog').isCat).to.equal(false);
    });

    it('accepts additional parameters as a second argument (e.g. options)', async () => {
      expect(isCat('cat').isCat).to.equal(true);
      expect(isCat('cat', { number: 5 }).isCat).to.equal(false);
      expect(isCat('cat5', { number: 5 }).isCat).to.equal(true);

      const el = await fixture(html`
        <${tag}
          .modelValue=${'cat'}
          .errorValidators=${[[isCat, { number: 5 }]]}
        >${lightDom}</${tag}>
      `);

      expect(el.errorValidators[0][1]).to.deep.equal({ number: 5 });
      expect(el.errorState).to.equal(true);
      el.errorValidators = [[isCat]];
      el.modelValue = 'cat';
      expect(el.errorState).to.equal(false);
    });

    it('will not trigger on empty values', async () => {
      const el = await fixture(html`
        <${tag}
          .errorValidators=${[[isCat]]}
        >${lightDom}</${tag}>
      `);

      el.modelValue = 'cat';
      expect(el.error.isCat).to.be.undefined;
      el.modelValue = 'dog';
      expect(el.error.isCat).to.be.true;
      el.modelValue = '';
      expect(el.error.isCat).to.be.undefined;
    });

    it('gets retriggered on parameter change [to-be-investigated]', async () => {
      // TODO: find way to technically implement this,
      // e.g. define validator params as props on <lion-field>, just like native validators
    });

    it(`replaces native validators (required, minlength, maxlength, min, max, pattern, step,
        type(email/date/number/...) etc.) [to-be-investigated]`, async () => {
      // TODO: this could also become: "can be used in conjunction with"
    });

    it.skip('can have multiple validators per type', async () => {
      function containsLowercaseA(modelValue) {
        return { containsLowercaseA: modelValue.indexOf('a') > -1 };
      }

      const spyIsCat = sinon.spy(isCat);
      const spyContainsLowercaseA = sinon.spy(containsLowercaseA);

      const el = await fixture(html`
        <${tag}
          .label=${'myField'}
          .modelValue=${'cat'}
          .errorValidators=${[[spyIsCat], [spyContainsLowercaseA]]}
        >${lightDom}</${tag}>
      `);

      expect(el.errorValidators.length).to.equal(2);
      expect(spyIsCat.callCount).to.equal(1);
      // expect(spyContainsLowercaseA.callCount).to.equal(1);
      expect(el.errorState).to.equal(false);

      el.modelValue = 'dog';
      // expect(spyIsCat.callCount).to.equal(2);
      // expect(spyContainsLowercaseA.callCount).to.equal(2);
      expect(el.errorState).to.equal(true);
    });
  });

  describe('Required validator', () => {
    it('has a string notation', async () => {
      const el = await fixture(html`
        <${tag}
          .errorValidators=${[['required']]}
          .__isRequired="${defaultRequiredFn}"
          .modelValue=${'foo'}
        >${lightDom}</${tag}>
      `);
      const requiredValidatorSpy = sinon.spy(el, '__isRequired');
      el.modelValue = '';
      expect(requiredValidatorSpy.callCount).to.equal(1);
      expect(el.error.required).to.equal(true);
    });

    it('can have different implementations for different form controls', async () => {
      const el = await fixture(html`
        <${tag}
          .errorValidators=${[['required']]}
          .__isRequired=${modelValue => ({ required: modelValue.model !== '' })}
          .modelValue=${{ model: 'foo' }}
        >${lightDom}</${tag}>
      `);
      const requiredValidatorSpy = sinon.spy(el, '__isRequired');
      el.modelValue = { model: '' };
      expect(requiredValidatorSpy.callCount).to.equal(1);
      expect(el.error.required).to.equal(true);
    });

    it('prevents other validators from being called when required validator returns false', async () => {
      const alwaysFalseSpy = sinon.spy(() => ({ alwaysFalse: false }));
      const el = await fixture(html`
        <${tag}
          .errorValidators=${[['required'], [alwaysFalseSpy]]}
          .__isRequired=${defaultRequiredFn}
          .modelValue=${''}
        >${lightDom}</${tag}>
      `);
      expect(alwaysFalseSpy.callCount).to.equal(0); // __isRequired returned false (invalid)
      el.modelValue = 'foo';
      expect(alwaysFalseSpy.callCount).to.equal(1); // __isRequired returned true (valid)
    });
  });

  describe('Element Validation States', () => {
    const alwaysFalse = () => ({ alwaysFalse: false });
    const minLength = (modelValue, { min }) => ({ minLength: modelValue.length >= min });
    const containsLowercaseA = modelValue => ({ containsLowercaseA: modelValue.indexOf('a') > -1 });
    const containsLowercaseB = modelValue => ({ containsLowercaseB: modelValue.indexOf('b') > -1 });

    it('stores current state of every type in this.(error|warning|info|success)State', async () => {
      const el = await fixture(html`
        <${tag}
          .errorValidators=${[[minLength, { min: 3 }]]}
          .warningValidators=${[[minLength, { min: 5 }]]}
          .infoValidators=${[[minLength, { min: 7 }]]}
          .successValidators=${[[alwaysFalse]]}
        >${lightDom}</${tag}>
      `);

      el.modelValue = 'a';

      expect(el.errorState).to.equal(true);
      expect(el.warningState).to.equal(true);
      expect(el.infoState).to.equal(true);
      expect(el.successState).to.equal(true);

      el.modelValue = 'abc';
      expect(el.errorState).to.equal(false);
      expect(el.warningState).to.equal(true);
      expect(el.infoState).to.equal(true);
      expect(el.successState).to.equal(true);

      el.modelValue = 'abcde';
      expect(el.errorState).to.equal(false);
      expect(el.warningState).to.equal(false);
      expect(el.infoState).to.equal(true);
      expect(el.successState).to.equal(true);

      el.modelValue = 'abcdefg';
      expect(el.errorState).to.equal(false);
      expect(el.warningState).to.equal(false);
      expect(el.infoState).to.equal(false);
      expect(el.successState).to.equal(true);
    });

    it.skip('fires "(error|warning|info|success)-changed" event when {state} changes', async () => {
      const validationState = await fixture(html`
        <${tag}
          .errorValidators=${[[minLength, { min: 3 }], [containsLowercaseA], [containsLowercaseB]]}
        >${lightDom}</${tag}>
      `);

      const cbError = sinon.spy();
      validationState.addEventListener('error-changed', cbError);

      console.log('set to a');
      validationState.modelValue = 'a';
      expect(cbError.callCount).to.equal(1);

      console.log('set to aa');
      validationState.modelValue = 'aa';
      expect(cbError.callCount).to.equal(1);

      validationState.modelValue = 'aaa';
      expect(cbError.callCount).to.equal(2);

      validationState.modelValue = 'aba';
      expect(cbError.callCount).to.equal(3);
    });

    it(`sets a class "state-(error|warning|info|success)" when the component has a
        corresponding state`, async () => {
      const el = await fixture(html`
        <${tag}
          .errorValidators=${[[minLength, { min: 3 }]]}
          .warningValidators=${[[minLength, { min: 5 }]]}
          .infoValidators=${[[minLength, { min: 7 }]]}
          .successValidators=${[[alwaysFalse]]}
        >${lightDom}</${tag}>`);

      el.modelValue = 'a';
      await el.updateComplete;

      expect(el.classList.contains('state-error')).to.equal(true, 'has state-error');
      expect(el.classList.contains('state-warning')).to.equal(true, 'has state-warning');
      expect(el.classList.contains('state-info')).to.equal(true, 'has state-info');
      expect(el.classList.contains('state-success')).to.equal(true, 'has state-success');

      el.modelValue = 'abc';
      await el.updateComplete;
      expect(el.classList.contains('state-error')).to.equal(false, 'has no state-error');
      expect(el.classList.contains('state-warning')).to.equal(true, 'has state-warning');
      expect(el.classList.contains('state-info')).to.equal(true, 'has state-info');
      expect(el.classList.contains('state-success')).to.equal(true, 'has state-success');

      el.modelValue = 'abcde';
      await el.updateComplete;
      expect(el.classList.contains('state-error')).to.equal(false, 'has no state-error');
      expect(el.classList.contains('state-warning')).to.equal(false, 'has no state-warning');
      expect(el.classList.contains('state-info')).to.equal(true, 'has state-info');
      expect(el.classList.contains('state-success')).to.equal(true, 'has state-success');

      el.modelValue = 'abcdefg';
      await el.updateComplete;
      expect(el.classList.contains('state-error')).to.equal(false, 'has no state-error');
      expect(el.classList.contains('state-warning')).to.equal(false, 'has no state-warning');
      expect(el.classList.contains('state-info')).to.equal(false, 'has no state-info');
      expect(el.classList.contains('state-success')).to.equal(true, 'has state-success');
    });

    it(`stores validity of validator for every type in
        this.(error|warning|info|success).{validatorName}`, async () => {
      const validationState = await fixture(html`
        <${tag}
          .modelValue=${'a'}
          .errorValidators=${[[minLength, { min: 3 }], [alwaysFalse]]}
        >${lightDom}</${tag}>`);

      expect(validationState.error.minLength).to.equal(true);
      expect(validationState.error.alwaysFalse).to.equal(true);

      validationState.modelValue = 'abc';

      expect(typeof validationState.error.minLength).to.equal('undefined');
      expect(validationState.error.alwaysFalse).to.equal(true);
    });

    it(`sets a class "state-(error|warning|info|success)-show" when the component has
        a corresponding state and "show{type}Condition()" is met`, async () => {
      const el = await fixture(html`
        <${tag}
          .errorValidators=${[[minLength, { min: 3 }]]}
          .warningValidators=${[[minLength, { min: 5 }]]}
          .infoValidators=${[[minLength, { min: 7 }]]}
          .successValidators=${[[alwaysFalse]]}
        >${lightDom}</${tag}>`);

      if (externalVariables.errorShowPrerequisite) {
        externalVariables.errorShowPrerequisite(el);
        externalVariables.warningShowPrerequisite(el);
        externalVariables.infoShowPrerequisite(el);
        externalVariables.successShowPrerequisite(el);
      }

      el.modelValue = 'a';
      await el.updateComplete;
      await el.updateComplete;
      await el.updateComplete;
      await el.updateComplete;
      await aTimeout(2000);

      expect(el.classList.contains('state-error-show')).to.equal(true);
      // expect(el.classList.contains('state-warning-show')).to.equal(false);
      // expect(el.classList.contains('state-info-show')).to.equal(false);
      // expect(el.classList.contains('state-success-show')).to.equal(false);

      // el.modelValue = 'abc';
      // await el.updateComplete;
      // expect(el.classList.contains('state-error-show')).to.equal(false);
      // expect(el.classList.contains('state-warning-show')).to.equal(true);
      // expect(el.classList.contains('state-info-show')).to.equal(false);
      // expect(el.classList.contains('state-success-show')).to.equal(false);

      // el.modelValue = 'abcde';
      // await el.updateComplete;
      // expect(el.classList.contains('state-error-show')).to.equal(false);
      // expect(el.classList.contains('state-warning-show')).to.equal(false);
      // expect(el.classList.contains('state-info-show')).to.equal(true);
      // expect(el.classList.contains('state-success-show')).to.equal(false);

      // el.modelValue = 'abcdefg';
      // await el.updateComplete;
      // expect(el.classList.contains('state-error-show')).to.equal(false);
      // expect(el.classList.contains('state-warning-show')).to.equal(false);
      // expect(el.classList.contains('state-info-show')).to.equal(false);
      // expect(el.classList.contains('state-success-show')).to.equal(false);

      // el.modelValue = 'a';
      // await el.updateComplete;
      // expect(el.classList.contains('state-error-show')).to.equal(true);
      // expect(el.classList.contains('state-warning-show')).to.equal(false);
      // expect(el.classList.contains('state-info-show')).to.equal(false);
      // expect(el.classList.contains('state-success-show')).to.equal(false);

      // el.modelValue = 'abcdefg';
      // await el.updateComplete;
      // expect(el.classList.contains('state-error-show')).to.equal(false);
      // expect(el.classList.contains('state-warning-show')).to.equal(false);
      // expect(el.classList.contains('state-info-show')).to.equal(false);
      // expect(el.classList.contains('state-success-show')).to.equal(true);
    });

    it('fires "(error|warning|info|success)-state-changed" event when state changes', async () => {
      const el = await fixture(html`
        <${tag}
          .errorValidators=${[[minLength, { min: 7 }]]}
          .warningValidators=${[[minLength, { min: 5 }]]}
          .infoValidators=${[[minLength, { min: 3 }]]}
          .successValidators=${[[alwaysFalse]]}
        >${lightDom}</${tag}>
      `);
      const cbInfo = sinon.spy();
      const cbWarning = sinon.spy();
      const cbError = sinon.spy();
      const cbSuccess = sinon.spy();

      el.addEventListener('error-state-changed', cbError);
      el.addEventListener('warning-state-changed', cbWarning);
      el.addEventListener('info-state-changed', cbInfo);
      el.addEventListener('success-state-changed', cbSuccess);

      el.modelValue = 'a';
      expect(cbError.callCount).to.equal(1);
      expect(cbWarning.callCount).to.equal(1);
      expect(cbInfo.callCount).to.equal(1);
      expect(cbSuccess.callCount).to.equal(1);

      el.modelValue = 'abc';
      expect(cbError.callCount).to.equal(1);
      expect(cbWarning.callCount).to.equal(1);
      expect(cbInfo.callCount).to.equal(2);
      expect(cbSuccess.callCount).to.equal(1);

      el.modelValue = 'abcde';
      expect(cbError.callCount).to.equal(1);
      expect(cbWarning.callCount).to.equal(2);
      expect(cbInfo.callCount).to.equal(2);
      expect(cbSuccess.callCount).to.equal(1);

      el.modelValue = 'abcdefg';
      expect(cbError.callCount).to.equal(2);
      expect(cbWarning.callCount).to.equal(2);
      expect(cbInfo.callCount).to.equal(2);
      expect(cbSuccess.callCount).to.equal(1);
    });

    it('removes invalid states whenever modelValue becomes undefined', async () => {
      const el = await fixture(html`
        <${tag}
          .errorValidators=${[[minLength, { min: 3 }]]}
          .warningValidators=${[[minLength, { min: 5 }]]}
          .infoValidators=${[[minLength, { min: 7 }]]}
          .successValidators=${[[alwaysFalse]]}
        >${lightDom}</${tag}>
      `);

      el.modelValue = 'a';
      expect(el.errorState).to.equal(true);
      expect(el.warningState).to.equal(true);
      expect(el.infoState).to.equal(true);
      expect(el.successState).to.equal(true);
      expect(el.error).to.not.eql({});
      expect(el.warning).to.not.eql({});
      expect(el.info).to.not.eql({});
      expect(el.success).to.not.eql({});

      el.modelValue = undefined;
      expect(el.errorState).to.equal(false);
      expect(el.warningState).to.equal(false);
      expect(el.infoState).to.equal(false);
      expect(el.successState).to.equal(false);
      expect(el.error).to.eql({});
      expect(el.warning).to.eql({});
      expect(el.info).to.eql({});
      expect(el.success).to.eql({});
    });
  });

  describe('Accessibility', () => {
    it(`sets property "aria-invalid" to *input-element* once errors should be shown
        to user(*show-error-feedback-condition* is true) [to-be-implemented]`, async () => {});

    it('sets *input-element*.setCustomValidity(errorMessage) [to-be-implemented]', async () => {
      // TODO: test how and if this affects a11y
    });

    it(`removes validity message from DOM instead of toggling "display:none", to trigger Jaws
        and VoiceOver [to-be-implemented]`, async () => {});
  });

  describe('Validity Feedback', () => {
    function alwaysFalse() {
      return { alwaysFalse: false };
    }
    function minLength(modelValue, opts) {
      return { minLength: modelValue.length >= opts.min };
    }
    function containsLowercaseA(modelValue) {
      return { containsLowercaseA: modelValue.indexOf('a') > -1 };
    }
    function containsCat(modelValue) {
      return { containsCat: modelValue.indexOf('cat') > -1 };
    }

    const defaultElement = defineCE(
      class extends ValidateMixin(LionLitElement) {
        static get properties() {
          return {
            modelValue: {
              type: String,
            },
          };
        }
      },
    );
    const defaultElementName = unsafeStatic(defaultElement);

    beforeEach(() => {
      // Reset and preload validation translations
      localizeTearDown();
      localize.addData('en-GB', 'lion-validate', {
        error: {
          alwaysFalse: 'This is error message for alwaysFalse',
          minLength: 'This is error message for minLength',
          containsLowercaseA: 'This is error message for containsLowercaseA',
          containsCat: 'This is error message for containsCat',
        },
        warning: {
          alwaysFalse: 'This is warning message for alwaysFalse',
          minLength: 'This is warning message for minLength',
          containsLowercaseA: 'This is warning message for containsLowercaseA',
          containsCat: 'This is warning message for containsCat',
        },
        info: {
          alwaysFalse: 'This is info message for alwaysFalse',
          minLength: 'This is info message for minLength',
          containsLowercaseA: 'This is info message for containsLowercaseA',
          containsCat: 'This is info message for containsCat',
        },
        success: {
          alwaysFalse: 'This is success message for alwaysFalse',
          minLength: 'This is success message for minLength',
          containsLowercaseA: 'This is success message for containsLowercaseA',
          containsCat: 'This is success message for containsCat',
        },
      });
    });

    it('has configurable feedback display condition', async () => {
      let showErrors = false;
      const el = await fixture(html`
        <${tag}
          .showErrorCondition=${newStates => showErrors && newStates.error}
          .modelValue=${'cat'}
          .errorValidators=${[[alwaysFalse]]}
        >${lightDom}</${tag}>
      `);

      expect(el._feedbackNode.innerText).to.equal('');

      showErrors = true;
      el.validate();
      await el.updateComplete;

      expect(el._feedbackNode.innerText).to.equal('This is error message for alwaysFalse');
    });

    it('writes validation outcome to *feedback-element*, if present', async () => {
      const feedbackResult = await fixture(html`
        <${tag}
          .modelValue=${'cat'}
          .errorValidators=${[[alwaysFalse]]}
        >${lightDom}</${tag}>
      `);
      expect(feedbackResult._feedbackNode.innerText).to.equal(
        'This is error message for alwaysFalse',
      );
    });

    it('rerenders validation outcome to *feedback-element*, when dependent on async resources', async () => {
      const alwaysFalseAsyncTransl = () => ({ alwaysFalseAsyncTransl: false });
      const feedbackResult = await fixture(html`
        <${tag}
          .modelValue=${'cat'}
          .errorValidators=${[[alwaysFalseAsyncTransl]]}
        >${lightDom}</${tag}>
      `);

      expect(feedbackResult._feedbackNode.innerText).to.equal('');
      // locale changed or smth
      localize.reset();
      localize.addData('en-GB', 'lion-validate', {
        error: { alwaysFalseAsyncTransl: 'error:alwaysFalseAsyncTransl' },
      });

      feedbackResult.onLocaleUpdated();
      expect(feedbackResult._feedbackNode.innerText).to.equal('error:alwaysFalseAsyncTransl');
    });

    it('allows to overwrite the way messages are translated', async () => {
      const customTranslations = await fixture(html`
        <${tag}
        .translateMessage=${(keys, data) => {
          switch (data.validatorName) {
            case 'alwaysFalse':
              return 'You can not pass';
            case 'containsLowercaseA':
              return 'You should have a lowercase a';
            default:
              return '';
          }
        }}
        .modelValue=${'dog'}
        .errorValidators=${[[containsLowercaseA], [alwaysFalse]]}
        >${lightDom}</${tag}>
      `);

      expect(customTranslations._feedbackNode.innerText).to.equal(
        'You should have a lowercase a',
      );

      customTranslations.modelValue = 'cat';
      await customTranslations.updateComplete;
      expect(customTranslations._feedbackNode.innerText).to.equal('You can not pass');
    });

    it('allows to overwrite the way messages are rendered/added to dom', async () => {
      const element = defineCE(
        class extends ValidateMixin(LionLitElement) {
          static get properties() {
            return {
              modelValue: {
                type: String,
              },
            };
          }

          renderFeedback(validationStates, message) {
            const validator = message.list[0].data.validatorName;
            const showError = validationStates.error;
            this.innerHTML = showError ? `ERROR on ${validator}` : '';
          }
        },
      );
      const elem = unsafeStatic(element);
      const ownTranslations = await fixture(html`
        <${elem}
          .modelValue=${'dog'}
          .errorValidators=${[[containsLowercaseA], [alwaysFalse]]}
        >${lightDom}</${elem}>
      `);
      await ownTranslations.updateComplete;
      expect(ownTranslations.innerHTML).to.equal('ERROR on containsLowercaseA');

      ownTranslations.modelValue = 'cat';
      await ownTranslations.updateComplete;
      expect(ownTranslations.innerHTML).to.equal('ERROR on alwaysFalse');
    });

    it('supports custom element to render feedback', async () => {
      const errorRenderer = defineCE(
        class extends HTMLElement {
          renderFeedback(validationStates, message) {
            if (!message.list.length) {
              return;
            }
            const validator = message.list[0].data.validatorName;
            const showError = validationStates.error;
            this.innerText = showError ? `ERROR on ${validator}` : '';
          }
        },
      );
      const errorRendererName = unsafeStatic(errorRenderer);
      // TODO: refactor to support integration via externalDependencies.element
      const element = await fixture(html`
        <${defaultElementName}
          .errorValidators=${[[containsLowercaseA], [alwaysFalse]]}>
          <${errorRendererName} slot="feedback"><${errorRendererName}>
        </${defaultElementName}>
      `);

      element.modelValue = 'dog';
      await element.updateComplete;
      expect(element._feedbackNode.innerText).to.equal('ERROR on containsLowercaseA');

      element.modelValue = 'cat';
      await element.updateComplete;
      expect(element._feedbackNode.innerText).to.equal('ERROR on alwaysFalse');
    });

    it('allows to create a custom feedback renderer via the template [to-be-implemented]', async () => {
      // TODO: implement
    });

    it('shows only highest priority validation message type (1. error, 2. warning, 3. info)', async () => {
      // TODO: refactor to support integration via externalDependencies.element
      const validityFeedback = await fixture(html`
        <${defaultElementName}
          .errorValidators=${[[minLength, { min: 3 }]]}
          .warningValidators=${[[minLength, { min: 5 }]]}
          .infoValidators=${[[minLength, { min: 7 }]]}
          .successValidators=${[[alwaysFalse]]}
        >${lightDom}</${defaultElementName}>
      `);

      validityFeedback.modelValue = 'a';
      await validityFeedback.updateComplete;
      expect(validityFeedback._feedbackNode.innerText).to.equal(
        'This is error message for minLength',
      );

      validityFeedback.modelValue = 'abc';
      await validityFeedback.updateComplete;
      expect(validityFeedback._feedbackNode.innerText).to.equal(
        'This is warning message for minLength',
      );

      validityFeedback.modelValue = 'abcde';
      await validityFeedback.updateComplete;
      expect(validityFeedback._feedbackNode.innerText).to.equal(
        'This is info message for minLength',
      );
    });

    it('shows success message after fixing an error', async () => {
      // TODO: refactor to support integration via externalDependencies.element
      const validityFeedback = await fixture(html`
        <${defaultElementName}
        .errorValidators=${[[minLength, { min: 3 }]]}
        .successValidators=${[[alwaysFalse]]}
        >${lightDom}</${defaultElementName}>
      `);

      validityFeedback.modelValue = 'a';
      await validityFeedback.updateComplete;
      expect(validityFeedback._feedbackNode.innerText).to.equal(
        'This is error message for minLength',
      );

      validityFeedback.modelValue = 'abcd';
      await validityFeedback.updateComplete;
      expect(validityFeedback._feedbackNode.innerText).to.equal(
        'This is success message for alwaysFalse',
      );
    });

    it(`shows only highest priority validation message determined by order of assignment of
        validators`, async () => {
      // TODO: refactor to support integration via externalDependencies.element
      const validityFeedback = await fixture(html`
        <${defaultElementName}
          .errorValidators=${[[containsCat], [minLength, { min: 4 }]]}
        >${lightDom}</${defaultElementName}>
      `);
      validityFeedback.modelValue = 'dog and dog';
      await validityFeedback.updateComplete;
      expect(validityFeedback._feedbackNode.innerText).to.equal(
        'This is error message for containsCat',
      );

      validityFeedback.modelValue = 'dog';
      await validityFeedback.updateComplete;
      expect(validityFeedback._feedbackNode.innerText).to.equal(
        'This is error message for containsCat',
      );

      validityFeedback.modelValue = 'cat';
      await validityFeedback.updateComplete;
      expect(validityFeedback._feedbackNode.innerText).to.equal(
        'This is error message for minLength',
      );

      validityFeedback.modelValue = 'dog and cat';
      await validityFeedback.updateComplete;
      expect(validityFeedback._feedbackNode.innerText).to.equal('');
    });

    it('supports randomized selection of multiple messages for the same validator', async () => {
      const randomTranslationsElement = defineCE(
        class extends ValidateMixin(LionLitElement) {
          static get properties() {
            return {
              modelValue: {
                type: String,
              },
            };
          }

          translateMessage(rawKeys) {
            const translationData = {
              error: {
                containsLowercaseA: 'You should have a lowercase a',
              },
              success: {
                randomAlwaysFalse: 'success.a, success.b, success.c, success.d',
                a: 'Good job!',
                b: 'You did great!',
                c: 'Looks good!',
                d: 'nice!',
              },
            };
            const keys = !Array.isArray(rawKeys) ? [rawKeys] : rawKeys;

            for (let i = 0; i < keys.length; i += 1) {
              const key = keys[i].split(':')[1];
              const found = key.split('.').reduce((o, j) => o[j], translationData);
              if (found) {
                return found;
              }
            }
            return '';
          }
        },
      );
      const mathRandom = Math.random;
      Math.random = () => 0;

      function randomAlwaysFalse() {
        return { randomAlwaysFalse: false };
      }

      const randomTranslationsName = unsafeStatic(randomTranslationsElement);

      const randomTranslations = await fixture(html`
        <${randomTranslationsName}
          .modelValue=${'dog'}
          .errorValidators=${[[containsLowercaseA]]}
          .successValidators=${[[randomAlwaysFalse]]}
        ></${randomTranslationsName}>
      `);

      expect(
        randomTranslations.translateMessage('random-translations:error.containsLowercaseA'),
      ).to.equal('You should have a lowercase a');
      expect(randomTranslations.translateMessage('random-translations:success.a')).to.equal(
        'Good job!',
      );

      expect(randomTranslations._feedbackNode.innerText).to.equal(
        'You should have a lowercase a',
      );

      randomTranslations.modelValue = 'cat';
      await randomTranslations.updateComplete;
      expect(randomTranslations._feedbackNode.innerText).to.equal('Good job!');

      Math.random = () => 0.25;
      randomTranslations.__lastGetSuccessResult = false;
      randomTranslations.modelValue = 'dog';
      randomTranslations.modelValue = 'cat';
      await randomTranslations.updateComplete;

      expect(randomTranslations._feedbackNode.innerText).to.equal('You did great!');

      Math.random = mathRandom; // manually restore
    });

    it('translates validity messages', async () => {
      localize.reset();
      localize.addData('en-GB', 'lion-validate', {
        error: { minLength: 'You need to enter at least {validatorParams.min} characters.' },
      });
      localize.addData('de-DE', 'lion-validate', {
        error: {
          minLength: 'Es müssen mindestens {validatorParams.min} Zeichen eingegeben werden.',
        },
      });

      const validityFeedback = await fixture(
        html`
        <${defaultElementName}
          .modelValue=${'cat'}
          .errorValidators=${[[minLength, { min: 4 }]]}
        >${lightDom}</${defaultElementName}>
      `,
        () => ({
          modelValue: 'cat',
          errorValidators: [[minLength, { min: 4 }]],
        }),
      );
      expect(validityFeedback._feedbackNode.innerText).to.equal(
        'You need to enter at least 4 characters.',
      );

      localize.locale = 'de-DE';
      await validityFeedback.updateComplete;
      expect(validityFeedback._feedbackNode.innerText).to.equal(
        'Es müssen mindestens 4 Zeichen eingegeben werden.',
      );
    });

    describe('Field name', () => {
      beforeEach(() => {
        localizeTearDown();
        localize.addData('en-GB', 'lion-validate', {
          error: { minLength: '{fieldName} needs more characters' },
        });
      });

      it('allows to use field name in messages', async () => {
        const el = await fixture(html`
          <${tag}
            .label=${'myField'}
            .errorValidators=${[[minLength, { min: 4 }]]}
            .modelValue=${'cat'}
          >${lightDom}</${tag}>
        `);
        expect(el._feedbackNode.innerText).to.equal('myField needs more characters');
      });

      it('allows to configure field name for every validator message', async () => {
        const elNameStatic = { d: `${tagString}` };
        const validityFeedback = await fixture(html`
          <${elNameStatic} .label="${'myField'}" .name="${'myName'}"
            .errorValidators=${[
              [minLength, { min: 4, fieldName: 'overrideName' }],
            ]} .modelValue=${'cat'}
            >${lightDom}
          </${elNameStatic}>`);
        expect(validityFeedback._feedbackNode.innerText).to.equal(
          'overrideName needs more characters',
        );
      });

      it('constructs field name from label or name (in this priority order)', async () => {
        const elNameStatic = { d: `${tagString}` };

        // As seen in test above, configuring fieldName on validator level takes highest precedence
        const validityFeedback = await fixture(html`
          <${elNameStatic} .label="${'myField'}" .name="${'myName'}"
            .errorValidators=${[[minLength, { min: 4 }]]} .modelValue=${'cat'}
            >${lightDom}
          </${elNameStatic}>`);
        expect(validityFeedback._feedbackNode.innerText).to.equal(
          'myField needs more characters',
        );

        const validityFeedback2 = await fixture(html`
        <${elNameStatic} .name="${'myName'}"
          .errorValidators=${[[minLength, { min: 4 }]]} .modelValue=${'cat'}
          >${lightDom}
        </${elNameStatic}>`);
        expect(validityFeedback2._feedbackNode.innerText).to.equal(
          'myName needs more characters',
        );
      });
    });

    describe('Configuration meta data', () => {
      // In some cases, for instance in a group elememnt like fieldset, the validity state of the
      // children inputs need to be reflected on group level when asked for imperatively, although
      // the feedback needs to be displayed on input level and not on group level for these kind
      // of validators.
      it('allows for opting out of visibly rendering feedback via "hideFeedback"', async () => {
        const errorRenderer = defineCE(
          class extends HTMLElement {
            renderFeedback(validationStates, message) {
              if (!message.list.length) {
                return;
              }
              const validator = message.list[0].data.validatorName;
              const hide =
                message.list[0].data.validatorConfig &&
                message.list[0].data.validatorConfig.hideFeedback;
              if (validationStates.error && !hide) {
                this.innerText = `ERROR on ${validator}`;
              } else {
                this.innerText = '';
              }
            }
          },
        );

        const errorRendererName = unsafeStatic(errorRenderer);

        // TODO: refactor to support integration via externalDependencies.element
        const element = await fixture(html`
          <${defaultElementName}
            .errorValidators=${[[containsLowercaseA], [alwaysFalse, {}, { hideFeedback: true }]]}>
            <${errorRendererName} slot="feedback"><${errorRendererName}>
          </${defaultElementName}>
        `);

        element.modelValue = 'dog';
        await element.updateComplete;
        expect(element._feedbackNode.innerText).to.equal('ERROR on containsLowercaseA');

        element.modelValue = 'cat';
        await element.updateComplete;
        expect(element._feedbackNode.innerText).to.equal('');
      });
    });

    /**
     * Order of keys should be like this
     *
     * ['lion-input-email', 'lion-validate'].forEach((namespace) => {
     *   1. ${namespace}+${validatorName}:${type}.${validatorName}
     *   2. ${namespace}:${type}.${validatorName}
     * });
     *
     * Example:
     *   <lion-input-email name="partner" />
     *
     *   1. lion-input-email+isEmail:error:isEmail
     *   2. lion-input-email:error:isEmail
     *   3. lion-validate+isEmail:error.isEmail
     *   4. lion-validate:error.isEmail
     */
    describe('Localize Priority', () => {
      it('adds a default namespace `lion-validate`', () => {
        expect(customElements.get(tagString).localizeNamespaces[0]).to.include.keys(
          'lion-validate',
        );
      });

      it(`searches for the message in a specific order:
        1. lion-validate+$validatorName:$type.$validatorName
        2. lion-validate:$type.$validatorName
      `, async () => {
        // Tests are in 'reversed order', so we can increase prio by filling up localize storage
        const orderValidator = () => [() => ({ orderValidator: false })];

        const el = await fixture(html`
          <${tag}
            .name=${'foo'}
            .errorValidators=${[orderValidator()]}
            .modelValue=${'10'}>
            ${lightDom}
          </${tag}>
        `);

        // reset the storage so that we can fill it in for each of 2 cases step by step
        localize.reset();

        // 2. lion-validate
        localize.addData('en-GB', 'lion-validate', {
          error: {
            orderValidator: 'lion-validate : orderValidator',
          },
        });
        el._createMessageAndRenderFeedback();
        expect(el._feedbackNode.innerText).to.equal('lion-validate : orderValidator');

        // 1. lion-validate+orderValidator
        localize.addData('en-GB', 'lion-validate+orderValidator', {
          error: {
            orderValidator: 'lion-validate+orderValidator : orderValidator',
          },
        });
        el._createMessageAndRenderFeedback();
        expect(el._feedbackNode.innerText).to.equal(
          'lion-validate+orderValidator : orderValidator',
        );
      });

      it(`searches for the message in a specific order (when there is an extra namespace):
        1. my-custom-namespace+$validatorName:$type.$validatorName
        2. my-custom-namespace:$type.$validatorName
        3. lion-validate+$validatorName:$type.$validatorName
        4. lion-validate:$type.$validatorName
      `, async () => {
        // Tests are in 'reversed order', so we can increase prio by filling up localize storage
        const is12Validator = () => [modelValue => ({ is12Validator: modelValue === 12 })];
        const orderName = defineCE(
          class extends ValidateMixin(LionLitElement) {
            static get properties() {
              return { modelValue: { type: String } };
            }

            static get localizeNamespaces() {
              return [
                { 'my-custom-namespace': () => Promise.resolve({}) },
                ...super.localizeNamespaces,
              ];
            }
          },
        );

        const tagOrderName = unsafeStatic(orderName);

        const el = await fixture(html`
          <${tagOrderName}
            .name=${'bar'}
            .errorValidators=${[is12Validator()]}
            .modelValue=${'10'}>
            ${lightDom}
          </${tagOrderName}>
        `);

        // reset the storage so that we can fill it in for each of 4 cases step by step
        localize.reset();

        // 4. lion-validate
        localize.addData('en-GB', 'lion-validate', {
          error: {
            is12Validator: 'lion-validate : is12Validator',
          },
        });
        el._createMessageAndRenderFeedback();
        expect(el._feedbackNode.innerText).to.equal('lion-validate : is12Validator');

        // 3. lion-validate+is12Validator
        localize.addData('en-GB', 'lion-validate+is12Validator', {
          error: {
            is12Validator: 'lion-validate+is12Validator : is12Validator',
          },
        });
        el._createMessageAndRenderFeedback();
        expect(el._feedbackNode.innerText).to.equal(
          'lion-validate+is12Validator : is12Validator',
        );

        // 2. my-custom-namespace
        localize.addData('en-GB', 'my-custom-namespace', {
          error: {
            is12Validator: 'my-custom-namespace : is12Validator',
          },
        });
        el._createMessageAndRenderFeedback();
        expect(el._feedbackNode.innerText).to.equal('my-custom-namespace : is12Validator');

        // 1. my-custom-namespace+is12Validator
        localize.addData('en-GB', 'my-custom-namespace+is12Validator', {
          error: {
            is12Validator: 'my-custom-namespace+is12Validator : is12Validator',
          },
        });
        el._createMessageAndRenderFeedback();
        expect(el._feedbackNode.innerText).to.equal(
          'my-custom-namespace+is12Validator : is12Validator',
        );
      });
    });
  });

  describe('Asynchronous validation', () => {
    it('handles promises as custom validator functions', async () => {
      let asyncValidationReady;
      const asyncValidationPromise = new Promise((resolve) => {
        asyncValidationReady = resolve;
      });

      class DelayedCatValidator extends Validator {
        constructor(param, config) {
          super(param, config);
          this.name = 'delayed-cat';
          this.async = true;
        }

      /**
       * @desc the function that returns a Boolean
       * @param {string} modelValue
       */
        async execute(modelValue) {
          await asyncValidationPromise;
          return modelValue === 'cat';
        }
      }

      const el = await fixture(html`
        <${tag}
          .modelValue=${'dog'}
          .errorValidators=${[new DelayedCatValidator()]}
        >
        ${lightDom}
        </${tag}>
      `);
      const validator = el.errorValidators[0];
      expect(validator instanceof Validator).to.equal(true);
      expect(el.errorState).to.equal(false);
      asyncValidationReady();
      await aTimeout();
      expect(el.errorState).to.equal(true);
    });

    it('sets a class "state-pending" when validation is in progress [to-be-implemented]', async () => {});

    it('debounces async validation for performance [to-be-implemented]', async () => {});

    it('cancels and reschedules async validation on value change [to-be-implemented]', async () => {});

    it('blocks input when option "block-on-pending" is set [to-be-implemented]', async () => {
      // This might also be styles on state-pending => disable pointer-events and style as blocked
    });

    it('lets developer configure condition for asynchronous validation [to-be-implemented]', async () => {
      // This can be blur when input needs to be blocked.
      // Can be implemented as validateAsyncCondition(), returning boolean
      // Will first look at <validatable-field>, then at <validatable-field>.form
    });
  });
});
