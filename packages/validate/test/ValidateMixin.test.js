/* eslint-disable no-unused-vars, no-param-reassign */
import { expect, fixture, html, unsafeStatic, defineCE, aTimeout } from '@open-wc/testing';
import sinon from 'sinon';
import { LitElement } from '@lion/core';
import { ValidateMixin } from '../src/ValidateMixin.js';
import { Unparseable } from '../src/Unparseable.js';
import { Validator } from '../src/Validator.js';
import { ResultValidator } from '../src/ResultValidator.js';
import { Required } from '../src/validators/Required.js';
import { MinLength, MaxLength } from '../src/validators/StringValidators.js';
import { DefaultSuccess } from '../src/resultValidators/DefaultSuccess.js';
import {
  AlwaysValid,
  AlwaysInvalid,
  AsyncAlwaysValid,
  AsyncAlwaysInvalid,
} from '../test-helpers/helper-validators.js';
import '../lion-validation-feedback.js';
import { FeedbackMixin } from '../src/FeedbackMixin.js';

// element, lightDom, errorShowPrerequisite, warningShowPrerequisite, infoShowPrerequisite,
// successShowPrerequisite

const cfg = {};
const lightDom = '';

const tagString = defineCE(
  class extends ValidateMixin(LitElement) {
    static get properties() {
      return { modelValue: String };
    }
  },
);
const tag = unsafeStatic(tagString);

const withInputTagString = defineCE(
  class extends ValidateMixin(LitElement) {
    connectedCallback() {
      super.connectedCallback();
      this.appendChild(document.createElement('input'));
    }

    get _inputNode() {
      return this.querySelector('input');
    }
  },
);
const withInputTag = unsafeStatic(withInputTagString);

describe('ValidateMixin', () => {
  /**
   *   Terminology
   *
   * - *validatable-field*
   *   The element ('this') the ValidateMixin is applied on.
   *
   * - *input-node*
   *   The 'this._inputNode' property (usually a getter) that returns/contains a reference to an
   *   interaction element that receives focus, displays the input value, interaction states are
   *   derived from, aria properties are put on and setCustomValidity (if applicable) is called on.
   *   Can be input, textarea, my-custom-slider etc.
   *
   * - *feedback-node*
   *   The 'this._feedbackNode' property (usually a getter) that returns/contains a reference to
   *   the output container for validation feedback. Messages will be written to this element
   *   based on user defined or default validity feedback visibility conditions.
   *
   * - *show-{type}-feedback-condition*
   *   The 'this.hasErrorVisible value that stores whether the
   *   feedback for the particular validation type should be shown to the end user.
   */

  describe('Validation initiation', () => {
    it('validates on initialization (once form field has bootstrapped/initialized)', async () => {
      const el = await fixture(html`
        <${tag}
          .validators=${[new Required()]}
        >${lightDom}</${tag}>
      `);
      expect(el.hasError).to.be.true;
    });

    it('revalidates when ".modelValue" changes', async () => {
      const el = await fixture(html`
        <${tag}
          .validators=${[new AlwaysValid()]}
          .modelValue=${'myValue'}
        >${lightDom}</${tag}>
      `);

      const validateSpy = sinon.spy(el, 'validate');
      el.modelValue = 'x';
      expect(validateSpy.callCount).to.equal(1);
    });

    it('revalidates when ".validators" changes', async () => {
      const el = await fixture(html`
        <${tag}
          .validators=${[new AlwaysValid()]}
          .modelValue=${'myValue'}
        >${lightDom}</${tag}>
      `);

      const validateSpy = sinon.spy(el, 'validate');
      el.validators = [new MinLength(3)];
      expect(validateSpy.callCount).to.equal(1);
    });

    it('clears current results when ".modelValue" changes', async () => {
      const el = await fixture(html`
        <${tag}
          .validators=${[new AlwaysValid()]}
          .modelValue=${'myValue'}
        >${lightDom}</${tag}>
      `);

      const clearSpy = sinon.spy(el, '__clearValidationResults');
      const validateSpy = sinon.spy(el, 'validate');
      el.modelValue = 'x';
      expect(clearSpy.callCount).to.equal(1);
      expect(validateSpy.args[0][0]).to.eql({
        clearCurrentResult: true,
      });
    });

    /**
     * Inside "Validator integration" we test reinitiation on Validator param change
     */
  });

  describe('Validation internal flow', () => {
    it('firstly checks for empty values', async () => {
      const alwaysValid = new AlwaysValid();
      const alwaysValidExecuteSpy = sinon.spy(alwaysValid, 'execute');
      const el = await fixture(html`
        <${tag} .validators=${[alwaysValid]}>${lightDom}</${tag}>
      `);
      const isEmptySpy = sinon.spy(el, '__isEmpty');
      const validateSpy = sinon.spy(el, 'validate');
      el.modelValue = '';
      expect(validateSpy.callCount).to.equal(1);
      expect(alwaysValidExecuteSpy.callCount).to.equal(0);
      expect(isEmptySpy.callCount).to.equal(1);

      el.modelValue = 'nonEmpty';
      expect(validateSpy.callCount).to.equal(2);
      expect(alwaysValidExecuteSpy.callCount).to.equal(1);
      expect(isEmptySpy.callCount).to.equal(2);
    });

    it('secondly checks for synchronous Validators: creates RegularValidationResult', async () => {
      const el = await fixture(html`
        <${tag} .validators=${[new AlwaysValid()]}>${lightDom}</${tag}>
      `);
      const isEmptySpy = sinon.spy(el, '__isEmpty');
      const syncSpy = sinon.spy(el, '__executeSyncValidators');
      el.modelValue = 'nonEmpty';
      expect(isEmptySpy.calledBefore(syncSpy)).to.be.true;
    });

    it('thirdly schedules asynchronous Validators: creates RegularValidationResult', async () => {
      const el = await fixture(html`
        <${tag} .validators=${[new AlwaysValid(), new AsyncAlwaysValid()]}>
          ${lightDom}
        </${tag}>
      `);
      const syncSpy = sinon.spy(el, '__executeSyncValidators');
      const asyncSpy = sinon.spy(el, '__executeAsyncValidators');
      el.modelValue = 'nonEmpty';
      expect(syncSpy.calledBefore(asyncSpy)).to.be.true;
    });

    it('finally checks for ResultValidators: creates TotalValidationResult', async () => {
      class MyResult extends ResultValidator {
        constructor(...args) {
          super(...args);
          this.name = 'ResultValidator';
        }
      }

      let el = await fixture(html`
        <${tag}
          .validators=${[new AlwaysValid(), new MyResult()]}>
          ${lightDom}
        </${tag}>
      `);

      const syncSpy = sinon.spy(el, '__executeSyncValidators');
      const resultSpy2 = sinon.spy(el, '__executeResultValidators');

      el.modelValue = 'nonEmpty';
      expect(syncSpy.calledBefore(resultSpy2)).to.be.true;

      el = await fixture(html`
        <${tag}
          .validators=${[new AsyncAlwaysValid(), new MyResult()]}>
          ${lightDom}
        </${tag}>
      `);

      const asyncSpy = sinon.spy(el, '__executeAsyncValidators');
      const resultSpy = sinon.spy(el, '__executeResultValidators');

      el.modelValue = 'nonEmpty';
      expect(resultSpy.callCount).to.equal(1);
      expect(asyncSpy.callCount).to.equal(1);
      await el.validateComplete;
      expect(resultSpy.callCount).to.equal(2);
    });

    describe('Finalization', () => {
      it('fires private "validate-performed" event on every cycle', async () => {
        const el = await fixture(html`
          <${tag} .validators=${[new AlwaysValid(), new AsyncAlwaysInvalid()]}>
            ${lightDom}
          </${tag}>
        `);
        const cbSpy = sinon.spy();
        el.addEventListener('validate-performed', cbSpy);
        el.modelValue = 'nonEmpty';
        expect(cbSpy.callCount).to.equal(1);
      });

      it('resolves ".validateComplete" Promise', async () => {
        const el = await fixture(html`
          <${tag} .validators=${[new AsyncAlwaysInvalid()]}>
            ${lightDom}
          </${tag}>
        `);
        el.modelValue = 'nonEmpty';
        const validateResolveSpy = sinon.spy(el, '__validateCompleteResolve');
        await el.validateComplete;
        expect(validateResolveSpy.callCount).to.equal(1);
      });
    });
  });

  describe('Validator Integration', () => {
    class IsCat extends Validator {
      constructor(...args) {
        super(...args);
        this.name = 'isCat';
        this.execute = (modelValue, param) => {
          const validateString = param && param.number ? `cat${param.number}` : 'cat';
          const showError = modelValue !== validateString;
          return showError;
        };
      }
    }

    class OtherValidator extends Validator {
      constructor(...args) {
        super(...args);
        this.name = 'otherValidator';
        this.execute = () => true;
      }
    }

    it('Validators will be called with ".modelValue" as first argument', async () => {
      const otherValidator = new OtherValidator();
      const otherValidatorSpy = sinon.spy(otherValidator, 'execute');
      await fixture(html`
        <${tag}
          .validators=${[new Required(), otherValidator]}
          .modelValue=${'model'}
        >${lightDom}</${tag}>
      `);
      expect(otherValidatorSpy.calledWith('model')).to.be.true;
    });

    it('Validators will be called with viewValue as first argument when modelValue is unparseable', async () => {
      const otherValidator = new OtherValidator();
      const otherValidatorSpy = sinon.spy(otherValidator, 'execute');
      await fixture(html`
        <${tag}
          .validators=${[new Required(), otherValidator]}
          .modelValue=${new Unparseable('view')}
        >${lightDom}</${tag}>
      `);
      expect(otherValidatorSpy.calledWith('view')).to.be.true;
    });

    it('Validators will be called with param as a second argument', async () => {
      const param = { number: 5 };
      const validator = new IsCat(param);
      const executeSpy = sinon.spy(validator, 'execute');
      const el = await fixture(html`
        <${tag}
          .validators=${[validator]}
          .modelValue=${'cat'}
        >${lightDom}</${tag}>
      `);
      expect(executeSpy.args[0][1]).to.equal(param);
    });

    it('Validators will not be called on empty values', async () => {
      const el = await fixture(html`
        <${tag} .validators=${[new IsCat()]}>${lightDom}</${tag}>
      `);

      el.modelValue = 'cat';
      expect(el.errorStates.isCat).to.be.undefined;
      el.modelValue = 'dog';
      expect(el.errorStates.isCat).to.be.true;
      el.modelValue = '';
      expect(el.errorStates.isCat).to.be.undefined;
    });

    it('Validators get retriggered on parameter change', async () => {
      const isCatValidator = new IsCat('Felix');
      const catSpy = sinon.spy(isCatValidator, 'execute');
      const el = await fixture(html`
        <${tag}
          .validators=${[isCatValidator]}
          .modelValue=${'cat'}
        >${lightDom}</${tag}>
      `);
      el.modelValue = 'cat';
      expect(catSpy.callCount).to.equal(1);
      isCatValidator.param = 'Garfield';
      expect(catSpy.callCount).to.equal(2);
    });
  });

  describe('Async Validator Integration', () => {
    let asyncVPromise;
    let asyncVResolve;

    beforeEach(() => {
      asyncVPromise = new Promise(resolve => {
        asyncVResolve = resolve;
      });
    });

    class IsAsyncCat extends Validator {
      constructor(param, config) {
        super(param, config);
        this.name = 'delayed-cat';
        this.async = true;
      }

      /**
       * @desc the function that determines the validator. It returns true when
       * the Validator is "active", meaning its message should be shown.
       * @param {string} modelValue
       */
      async execute(modelValue) {
        await asyncVPromise;
        const hasError = modelValue !== 'cat';
        return hasError;
      }
    }

    // default execution trigger is keyup (think of password availability backend)
    // can configure execution trigger (blur, etc?)
    it('handles "execute" functions returning promises', async () => {
      const el = await fixture(html`
        <${tag}
          .modelValue=${'dog'}
          .validators=${[new IsAsyncCat()]}>
        ${lightDom}
        </${tag}>
      `);

      const validator = el.validators[0];
      expect(validator instanceof Validator).to.be.true;
      expect(el.hasError).to.be.false;
      asyncVResolve();
      await aTimeout();
      expect(el.hasError).to.be.true;
    });

    it('sets ".isPending/[is-pending]" when validation is in progress', async () => {
      const el = await fixture(html`
        <${tag} .modelValue=${'dog'}>${lightDom}</${tag}>
      `);
      expect(el.isPending).to.be.false;
      expect(el.hasAttribute('is-pending')).to.be.false;

      el.validators = [new IsAsyncCat()];
      expect(el.isPending).to.be.true;
      await aTimeout();
      expect(el.hasAttribute('is-pending')).to.be.true;

      asyncVResolve();
      await aTimeout();
      expect(el.isPending).to.be.false;
      expect(el.hasAttribute('is-pending')).to.be.false;
    });

    // TODO: 'mock' these methods without actually waiting for debounce?
    it.skip('debounces async validation for performance', async () => {
      const asyncV = new IsAsyncCat();
      const asyncVExecuteSpy = sinon.spy(asyncV, 'execute');

      const el = await fixture(html`
        <${tag} .modelValue=${'dog'}>
          ${lightDom}
        </${tag}>
      `);
      // debounce started
      el.validators = [asyncV];
      expect(asyncVExecuteSpy.called).to.equal(0);
      // TODO: consider wrapping debounce in instance/ctor function to make spying possible
      // await debounceFinish
      expect(asyncVExecuteSpy.called).to.equal(1);

      // New validation cycle. Now change modelValue inbetween, so validation is retriggered.
      asyncVExecuteSpy.reset();
      el.modelValue = 'dogger';
      expect(asyncVExecuteSpy.called).to.equal(0);
      el.modelValue = 'doggerer';
      // await original debounce period...
      expect(asyncVExecuteSpy.called).to.equal(0);
      // await original debounce again without changing mv inbetween...
      expect(asyncVExecuteSpy.called).to.equal(1);
    });

    // TODO: nice to have...
    it.skip('developer can configure debounce on FormControl instance', async () => {});

    it.skip('cancels and reschedules async validation on ".modelValue" change', async () => {
      const asyncV = new IsAsyncCat();
      const asyncVAbortSpy = sinon.spy(asyncV, 'abort');

      const el = await fixture(html`
        <${tag} .modelValue=${'dog'}>
          ${lightDom}
        </${tag}>
      `);
      // debounce started
      el.validators = [asyncV];
      expect(asyncVAbortSpy.called).to.equal(0);
      el.modelValue = 'dogger';
      // await original debounce period...
      expect(asyncVAbortSpy.called).to.equal(1);
    });

    // TODO: nice to have
    it.skip('developer can configure condition for asynchronous validation', async () => {
      const asyncV = new IsAsyncCat();
      const asyncVExecuteSpy = sinon.spy(asyncV, 'execute');

      const el = await fixture(html`
        <${tag}
          .isFocused=${true}
          .modelValue=${'dog'}
          .validators=${[asyncV]}
          .asyncValidateOn=${({ formControl }) => !formControl.isFocused}
          >
        ${lightDom}
        </${tag}>
      `);

      expect(asyncVExecuteSpy.called).to.equal(0);
      el.isFocused = false;
      el.validate();
      expect(asyncVExecuteSpy.called).to.equal(1);
    });
  });

  describe('ResultValidator Integration', () => {
    class MySuccessResultValidator extends ResultValidator {
      constructor(...args) {
        super(...args);
        this.type = 'success';
      }

      // eslint-disable-next-line class-methods-use-this
      executeOnResults({ regularValidationResult, prevValidationResult }) {
        const errorOrWarning = v => v.type === 'error' || v.type === 'warning';
        const hasErrorOrWarning = !!regularValidationResult.filter(errorOrWarning).length;
        const prevHadErrorOrWarning = !!prevValidationResult.filter(errorOrWarning).length;
        return !hasErrorOrWarning && prevHadErrorOrWarning;
      }
    }

    it('calls ResultValidators after regular validators', async () => {
      const resultValidator = new MySuccessResultValidator();
      const resultValidateSpy = sinon.spy(resultValidator, 'executeOnResults');

      // After regular sync Validators
      const validator = new MinLength(3);
      const validateSpy = sinon.spy(validator, 'execute');
      await fixture(html`
        <${tag}
          .validators=${[resultValidator, validator]}
          .modelValue=${'myValue'}
        >${lightDom}</${tag}>
      `);
      expect(validateSpy.calledBefore(resultValidateSpy)).to.be.true;

      // Also after regular async Validators
      const validatorAsync = new AsyncAlwaysInvalid();
      const validateAsyncSpy = sinon.spy(validatorAsync, 'execute');
      await fixture(html`
      <${tag}
        .validators=${[resultValidator, validatorAsync]}
        .modelValue=${'myValue'}
      >${lightDom}</${tag}>
    `);
      expect(validateAsyncSpy.calledBefore(resultValidateSpy)).to.be.true;
    });

    it(`provides "regular" ValidationResult and previous FinalValidationResult as input to
      "executeOnResults" function`, async () => {
      const resultValidator = new MySuccessResultValidator();
      const resultValidateSpy = sinon.spy(resultValidator, 'executeOnResults');

      const el = await fixture(html`
          <${tag}
            .validators=${[new MinLength(3), resultValidator]}
            .modelValue=${'myValue'}
          >${lightDom}</${tag}>
        `);
      const prevValidationResult = el.__prevValidationResult;
      const regularValidationResult = [...el.__syncValidationResult, ...el.__asyncValidationResult];

      expect(resultValidateSpy.args[0][0]).to.eql({
        prevValidationResult,
        regularValidationResult,
      });
    });

    it('adds ResultValidator outcome as highest prio result to the FinalValidationResult', async () => {
      class AlwaysInvalidResult extends ResultValidator {
        // eslint-disable-next-line class-methods-use-this
        executeOnResults() {
          const hasError = true;
          return hasError;
        }
      }

      const validator = new AlwaysInvalid();
      const resultV = new AlwaysInvalidResult();

      const el = await fixture(html`
        <${tag}
          .validators=${[validator, resultV]}
          .modelValue=${'myValue'}
        >${lightDom}</${tag}>
      `);

      const /** @type {TotalValidationResult} */ totalValidationResult = el.__validationResult;
      expect(totalValidationResult).to.eql([resultV, validator]);
    });
  });

  describe('Required Validator integration', () => {
    it('will result in erroneous state when form control is empty', async () => {
      const el = await fixture(html`
        <${tag}
          .validators=${[new Required()]}
          .modelValue=${''}
        >${lightDom}</${tag}>
      `);
      expect(el.errorStates.Required).to.be.true;
      expect(el.hasError).to.be.true;
      el.modelValue = 'foo';
      expect(el.errorStates.Required).to.be.undefined;
      expect(el.hasError).to.be.false;
    });

    it('calls private ".__isEmpty" by default', async () => {
      const el = await fixture(html`
        <${tag}
          .validators=${[new Required()]}
          .modelValue=${''}
        >${lightDom}</${tag}>
      `);
      const validator = el.validators.find(v => v instanceof Required);
      const executeSpy = sinon.spy(validator, 'execute');
      const privateIsEmptySpy = sinon.spy(el, '__isEmpty');
      el.modelValue = null;
      expect(executeSpy.callCount).to.equal(0);
      expect(privateIsEmptySpy.callCount).to.equal(1);
    });

    it('calls "._isEmpty" when provided (useful for different modelValues)', async () => {
      const customRequiredTagString = defineCE(
        class extends ValidateMixin(LitElement) {
          _isEmpty(modelValue) {
            return modelValue.model === '';
          }
        },
      );
      const customRequiredTag = unsafeStatic(customRequiredTagString);

      const el = await fixture(html`
        <${customRequiredTag}
          .validators=${[new Required()]}
          .modelValue=${{ model: 'foo' }}
        >${lightDom}</${customRequiredTag}>
      `);

      const providedIsEmptySpy = sinon.spy(el, '_isEmpty');
      el.modelValue = { model: '' };
      expect(providedIsEmptySpy.callCount).to.equal(1);
      expect(el.errorStates.Required).to.be.true;
    });

    it('prevents other Validators from being called when input is empty', async () => {
      const alwaysInvalid = new AlwaysInvalid();
      const alwaysInvalidSpy = sinon.spy(alwaysInvalid, 'execute');
      const el = await fixture(html`
        <${tag}
          .validators=${[new Required(), alwaysInvalid]}
          .modelValue=${''}
        >${lightDom}</${tag}>
      `);
      expect(alwaysInvalidSpy.callCount).to.equal(0); // __isRequired returned false (invalid)
      el.modelValue = 'foo';
      expect(alwaysInvalidSpy.callCount).to.equal(1); // __isRequired returned true (valid)
    });

    it('adds [aria-required="true"] to "._inputNode"', async () => {
      const el = await fixture(html`
        <${withInputTag}
          .validators=${[new Required()]}
          .modelValue=${''}
        >${lightDom}</${withInputTag}>
      `);
      expect(el._inputNode.getAttribute('aria-required')).to.equal('true');
      el.validators = [];
      expect(el._inputNode.getAttribute('aria-required')).to.be.null;
    });
  });

  describe('Default (preconfigured) Validators', () => {
    const preconfTagString = defineCE(
      class extends ValidateMixin(LitElement) {
        constructor() {
          super();
          this.defaultValidators = [new AlwaysInvalid()];
        }
      },
    );
    const preconfTag = unsafeStatic(preconfTagString);

    it('can be stored for custom inputs', async () => {
      const el = await fixture(html`
      <${preconfTag}
        .validators=${[new MinLength(3)]}
        .modelValue=${'12'}
      ></${preconfTag}>`);

      expect(el.errorStates.AlwaysInvalid).to.be.true;
      expect(el.errorStates.MinLength).to.be.true;
    });

    it('can be altered by App Developers', async () => {
      const altPreconfTagString = defineCE(
        class extends ValidateMixin(LitElement) {
          constructor() {
            super();
            this.defaultValidators = [new MinLength(3)];
          }
        },
      );
      const altPreconfTag = unsafeStatic(altPreconfTagString);

      const el = await fixture(html`
        <${altPreconfTag}
          .modelValue=${'12'}
        ></${altPreconfTag}>`);

      expect(el.errorStates.MinLength).to.be.true;
      el.defaultValidators[0].param = 2;
      expect(el.errorStates.MinLength).to.be.undefined;
    });

    it('can be requested via "._allValidators" getter', async () => {
      const el = await fixture(html`
      <${preconfTag}
        .validators=${[new MinLength(3)]}
      ></${preconfTag}>`);

      expect(el.validators.length).to.equal(1);
      expect(el.defaultValidators.length).to.equal(1);
      expect(el._allValidators.length).to.equal(2);

      expect(el._allValidators[0] instanceof MinLength).to.be.true;
      expect(el._allValidators[1] instanceof AlwaysInvalid).to.be.true;

      el.validators = [new MaxLength(5)];
      expect(el._allValidators[0] instanceof MaxLength).to.be.true;
      expect(el._allValidators[1] instanceof AlwaysInvalid).to.be.true;
    });
  });

  describe('State storage and reflection', () => {
    class ContainsLowercaseA extends Validator {
      constructor(...args) {
        super(...args);
        this.name = 'ContainsLowercaseA';
        this.execute = modelValue => !modelValue.includes('a');
      }
    }

    class ContainsLowercaseB extends Validator {
      constructor(...args) {
        super(...args);
        this.name = 'containsLowercaseB';
        this.execute = modelValue => !modelValue.includes('b');
      }
    }

    it('stores active state in ".hasError"/[has-error] flag', async () => {
      const el = await fixture(html`
        <${tag}
          .validators=${[new MinLength(3)]}
        >${lightDom}</${tag}>
      `);

      el.modelValue = 'a';
      expect(el.hasError).to.be.true;
      await el.updateComplete;
      expect(el.hasAttribute('has-error')).to.be.true;

      el.modelValue = 'abc';
      expect(el.hasError).to.be.false;
      await el.updateComplete;
      expect(el.hasAttribute('has-error')).to.be.false;

      el.modelValue = 'abcde';
      expect(el.hasError).to.be.false;
      await el.updateComplete;
      expect(el.hasAttribute('has-error')).to.be.false;

      el.modelValue = 'abcdefg';
      expect(el.hasError).to.be.false;
      await el.updateComplete;
      expect(el.hasAttribute('has-error')).to.be.false;
    });

    it('stores validity of individual Validators in ".errorStates[validator.name]"', async () => {
      const el = await fixture(html`
        <${tag}
          .modelValue=${'a'}
          .validators=${[new MinLength(3), new AlwaysInvalid()]}
        >${lightDom}</${tag}>`);

      expect(el.errorStates.MinLength).to.be.true;
      expect(el.errorStates.AlwaysInvalid).to.be.true;

      el.modelValue = 'abc';

      expect(el.errorStates.MinLength).to.equal(undefined);
      expect(el.errorStates.AlwaysInvalid).to.be.true;
    });

    it('removes "non active" states whenever modelValue becomes undefined', async () => {
      const el = await fixture(html`
        <${tag}
          .validators=${[new MinLength(3)]}
        >${lightDom}</${tag}>
      `);

      el.modelValue = 'a';
      expect(el.hasError).to.be.true;

      expect(el.errorStates).to.not.eql({});

      el.modelValue = undefined;
      expect(el.hasError).to.be.false;
      expect(el.errorStates).to.eql({});
    });

    describe('Events', () => {
      it('fires "has-error-changed" event when state changes', async () => {
        const el = await fixture(html`
          <${tag}
            .validators=${[new MinLength(7)]}
          >${lightDom}</${tag}>
        `);
        const cbError = sinon.spy();
        el.addEventListener('has-error-changed', cbError);

        el.modelValue = 'a';
        await el.updateComplete;
        expect(cbError.callCount).to.equal(1);

        el.modelValue = 'abc';
        await el.updateComplete;
        expect(cbError.callCount).to.equal(1);

        el.modelValue = 'abcde';
        await el.updateComplete;
        expect(cbError.callCount).to.equal(1);

        el.modelValue = 'abcdefg';
        await el.updateComplete;
        expect(cbError.callCount).to.equal(2);
      });

      it('fires "error-states-changed" event when "internal" state changes', async () => {
        const el = await fixture(html`
          <${tag}
            .validators=${[new MinLength(3), new ContainsLowercaseA(), new ContainsLowercaseB()]}
          >${lightDom}
          </${tag}>
        `);

        const cbError = sinon.spy();
        el.addEventListener('error-states-changed', cbError);

        el.modelValue = 'a';
        await el.updateComplete;
        expect(cbError.callCount).to.equal(1);

        el.modelValue = 'aa';
        await el.updateComplete;
        expect(cbError.callCount).to.equal(1);

        el.modelValue = 'aaa';
        await el.updateComplete;
        expect(cbError.callCount).to.equal(2);

        el.modelValue = 'aba';
        await el.updateComplete;
        expect(cbError.callCount).to.equal(3);
      });
    });
  });

  describe('Accessibility', () => {
    it.skip('calls "._inputNode.setCustomValidity(errorMessage)"', async () => {
      const el = await fixture(html`
        <${tag}
          .modelValue=${'123'}
          .validators=${[new MinLength(3, { message: 'foo' })]}>
          <input slot="input">
        </${tag}>`);
      const spy = sinon.spy(el.inputElement, 'setCustomValidity');
      el.modelValue = '';
      expect(spy.callCount).to.be(1);
      expect(el.validationMessage).to.be('foo');
      el.modelValue = '123';
      expect(spy.callCount).to.be(2);
      expect(el.validationMessage).to.be('');
    });

    // TODO: check with open a11y issues and find best solution here
    it.skip(`removes validity message from DOM instead of toggling "display:none", to trigger Jaws
        and VoiceOver [to-be-implemented]`, async () => {});
  });

  describe('Validity Feedback', () => {
    // eslint-disable-next-line no-shadow
    const tagString = defineCE(
      class extends FeedbackMixin(ValidateMixin(LitElement)) {
        static get properties() {
          return { modelValue: String };
        }

        connectedCallback() {
          super.connectedCallback();
          this.appendChild(document.createElement('input'));
        }

        get _inputNode() {
          return this.querySelector('input');
        }
      },
    );
    // eslint-disable-next-line no-shadow
    const tag = unsafeStatic(tagString);

    class ContainsLowercaseA extends Validator {
      constructor(...args) {
        super(...args);
        this.name = 'ContainsLowercaseA';
        this.execute = modelValue => !modelValue.includes('a');
      }
    }

    class ContainsCat extends Validator {
      constructor(...args) {
        super(...args);
        this.name = 'containsCat';
        this.execute = modelValue => !modelValue.includes('cat');
      }
    }

    AlwaysInvalid.getMessage = () => 'Message for AlwaysInvalid';
    MinLength.getMessage = () => 'Message for MinLength';
    ContainsLowercaseA.getMessage = () => 'Message for ContainsLowercaseA';
    ContainsCat.getMessage = () => 'Message for ContainsCat';

    it('sets ".hasErrorVisible"/[has-error-visible] when visibility condition is met', async () => {
      const el = await fixture(html`
        <${tag} .validators=${[new MinLength(3)]}>${lightDom}</${tag}>`);

      if (cfg.enableFeedbackVisible) {
        cfg.enableFeedbackVisible(el);
      }

      el.modelValue = 'a';
      await el.feedbackComplete;
      expect(el.hasErrorVisible).to.be.true;
      expect(el.hasAttribute('has-error-visible')).to.be.true;

      el.modelValue = 'abc';
      await el.feedbackComplete;
      expect(el.hasErrorVisible).to.be.false;
      expect(el.hasAttribute('has-error-visible')).to.be.false;
    });

    it('passes a message to the "._feedbackNode"', async () => {
      const el = await fixture(html`
        <${tag}
          .modelValue=${'cat'}
        >${lightDom}</${tag}>
      `);
      expect(el._feedbackNode.feedbackData).to.be.undefined;
      el.validators = [new AlwaysInvalid()];
      await el.feedbackComplete;
      expect(el._feedbackNode.feedbackData[0].message).to.equal('Message for AlwaysInvalid');
    });

    it('has configurable feedback visibility hook', async () => {
      const el = await fixture(html`
        <${tag}
          .modelValue=${'cat'}
          .validators=${[new AlwaysInvalid()]}
        >${lightDom}</${tag}>
      `);
      expect(el._feedbackNode.feedbackData[0].message).to.equal('Message for AlwaysInvalid');

      el._prioritizeAndFilterFeedback = () => []; // filter out all errors
      await el.validate();

      expect(el._feedbackNode.feedbackData).to.be.undefined;
    });

    it('writes prioritized result to "._feedbackNode" based on Validator order', async () => {
      const el = await fixture(html`
        <${tag}
          .modelValue=${'cat'}
          .validators=${[new AlwaysInvalid(), new MinLength(4)]}
        >${lightDom}</${tag}>
      `);
      expect(el._feedbackNode.feedbackData[0].message).to.equal('Message for AlwaysInvalid');
    });

    it('renders validation result to "._feedbackNode" when async messages are resolved', async () => {
      let unlockMessage;
      const messagePromise = new Promise(resolve => {
        unlockMessage = resolve;
      });

      AlwaysInvalid.getMessage = async () => {
        await messagePromise;
        return 'this ends up in "._feedbackNode"';
      };

      const el = await fixture(html`
        <${tag}
          .modelValue=${'cat'}
          .validators=${[new AlwaysInvalid()]}
        >${lightDom}</${tag}>
      `);
      expect(el._feedbackNode.feedbackData).to.be.undefined;
      unlockMessage();
      await el.feedbackComplete;
      expect(el._feedbackNode.feedbackData[0].message).to.equal('this ends up in "._feedbackNode"');
    });

    // N.B. this replaces the 'config.hideFeedback' option we had before...
    it('renders empty result when Validator.getMessage() returns "null"', async () => {
      let unlockMessage;
      const messagePromise = new Promise(resolve => {
        unlockMessage = resolve;
      });

      AlwaysInvalid.getMessage = async () => {
        await messagePromise;
        return 'this ends up in "._feedbackNode"';
      };

      const el = await fixture(html`
        <${tag}
          .modelValue=${'cat'}
          .validators=${[new AlwaysInvalid()]}
        >${lightDom}</${tag}>
      `);

      expect(el._feedbackNode.feedbackData).to.be.undefined;
      unlockMessage();
      await el.feedbackComplete;
      expect(el._feedbackNode.feedbackData[0].message).to.equal('this ends up in "._feedbackNode"');
    });

    it('supports custom element to render feedback', async () => {
      const customFeedbackTagString = defineCE(
        class extends LitElement {
          static get properties() {
            return {
              feedbackData: Array,
            }
          }

          render() {
            return html`
              Custom for ${this.feedbackData[0].validator.name}
            `;
          }
        },
      );
      const customFeedbackTag = unsafeStatic(customFeedbackTagString);
      const el = await fixture(html`
        <${tag}
          .validators=${[new ContainsLowercaseA(), new AlwaysInvalid()]}>
          <${customFeedbackTag} slot="feedback"><${customFeedbackTag}>
        </${tag}>
      `);

      expect(el._feedbackNode.localName).to.equal(customFeedbackTagString);

      el.modelValue = 'dog';
      await el.feedbackComplete;
      await el._feedbackNode.updateComplete;
      expect(el._feedbackNode).shadowDom.to.equal('Custom for ContainsLowercaseA');

      el.modelValue = 'cat';
      await el.feedbackComplete;
      expect(el._feedbackNode).shadowDom.to.equal('Custom for AlwaysInvalid');
    });

    it('supports custom messages in Validator instance configuration object', async () => {
      const el = await fixture(html`
        <${tag} .validators=${[new MinLength(3, { getMessage: () => 'custom via config'})]}
        >${lightDom}</${tag}>
      `);

      el.modelValue = 'a';
      await el.feedbackComplete;
      expect(el._feedbackNode.feedbackData[0].message).to.equal('custom via config');
    });

    it('shows success message after fixing an error', async () => {
      const el = await fixture(html`
        <${tag}
          .validators=${[
            new MinLength(3),
            new DefaultSuccess(null, { getMessage: () => 'This is a success message'}),
          ]}
        >${lightDom}</${tag}>
      `);

      el.modelValue = 'a';
      await el.feedbackComplete;
      expect(el._feedbackNode.feedbackData[0].message).to.equal('Message for MinLength');

      el.modelValue = 'abcd';
      await el.feedbackComplete;
      expect(el._feedbackNode.feedbackData[0].message).to.equal('This is a success message');
    });

    describe('Accessibility', () => {
      it('sets [aria-invalid="true"] to "._inputNode" when ".hasError" is true', async () => {
        const el = await fixture(html`
        <${tag}
          .validators=${[new Required()]}
          .modelValue=${'a'}
        >${lightDom}</${tag}>
      `);
        const inputNode = el._inputNode;

        expect(inputNode.getAttribute('aria-invalid')).to.equal('false');

        el.modelValue = '';
        await el.feedbackComplete;
        expect(inputNode.getAttribute('aria-invalid')).to.equal('true');
        el.modelValue = 'a';
        await el.feedbackComplete;
        expect(inputNode.getAttribute('aria-invalid')).to.equal('false');
      });
    });

    describe('Meta data', () => {
      it('".getMessage()" gets a reference to formControl, validatorParams and modelValue', async () => {
        let el;
        const constructorValidator = new MinLength(4, { type: 'x' }); // type to prevent duplicates
        const constructorMessageSpy = sinon.spy(constructorValidator.constructor, 'getMessage');

        el = await fixture(html`
          <${tag}
            .validators=${[constructorValidator]}
            .modelValue=${'cat'}
          >${lightDom}</${tag}>
        `);
        await el.feedbackComplete;
        expect(constructorMessageSpy.args[0][0]).to.eql({ validatorParams: 4, modelValue: 'cat', formControl: el});

        const instanceMessageSpy = sinon.spy();
        const instanceValidator = new MinLength(4, { getMessage: instanceMessageSpy });

        el = await fixture(html`
        <${tag}
          .validators=${[instanceValidator]}
          .modelValue=${'cat'}
        >${lightDom}</${tag}>
      `);
      await el.feedbackComplete;
        expect(instanceMessageSpy.args[0][0]).to.eql({ validatorParams: 4, modelValue: 'cat', formControl: el});
      });
    });
  });

  describe('Extensibility: Custom Validator types', () => {
    const customTypeTagString = defineCE(
      class extends FeedbackMixin(ValidateMixin(LitElement)) {
        static get validationTypes() {
          return [...super.validationTypes, 'x', 'y'];
        }
      },
    );
    const customTypeTag = unsafeStatic(customTypeTagString);

    it('supports multiple "has{Type}" flags', async () => {
      const el = await fixture(html`
        <${customTypeTag}
          .validators=${[
            new MinLength(2, { type: 'x' }),
            new MinLength(3, { type: 'error' }),
            new MinLength(4, { type: 'y' }),
          ]}
          .modelValue=${'1234'}
        >${lightDom}</${customTypeTag}>
      `);
      expect(el.hasY).to.be.false;
      expect(el.hasError).to.be.false;
      expect(el.hasX).to.be.false;

      el.modelValue = '123'; // triggers y
      expect(el.hasY).to.be.true;
      expect(el.hasError).to.be.false;
      expect(el.hasX).to.be.false;

      el.modelValue = '12'; // triggers error and y
      expect(el.hasY).to.be.true;
      expect(el.hasError).to.be.true;
      expect(el.hasX).to.be.false;

      el.modelValue = '1'; // triggers x, error and y
      expect(el.hasY).to.be.true;
      expect(el.hasError).to.be.true;
      expect(el.hasX).to.be.true;
    });

    it('supports multiple "{type}States" objects', async () => {
      const el = await fixture(html`
        <${customTypeTag}
          .validators=${[
            new MinLength(2, { type: 'x' }),
            new MinLength(3, { type: 'error' }),
            new MinLength(4, { type: 'y' }),
          ]}
          .modelValue=${'1234'}
        >${lightDom}</${customTypeTag}>
      `);
      expect(el.yStates).to.eql({});
      expect(el.errorStates).to.eql({});
      expect(el.xStates).to.eql({});

      el.modelValue = '123'; // triggers type1
      expect(el.yStates).to.eql({ MinLength: true });
      expect(el.errorStates).to.eql({});
      expect(el.xStates).to.eql({});

      el.modelValue = '12'; // triggers error
      expect(el.yStates).to.eql({ MinLength: true });
      expect(el.errorStates).to.eql({ MinLength: true });
      expect(el.xStates).to.eql({});

      el.modelValue = '1'; // triggers y
      expect(el.yStates).to.eql({ MinLength: true });
      expect(el.errorStates).to.eql({ MinLength: true });
      expect(el.xStates).to.eql({ MinLength: true });
    });

    it('only shows highest prio "has{Type}Visible" flag by default', async () => {
      const el = await fixture(html`
        <${customTypeTag}
          .validators=${[
            new MinLength(2, { type: 'x' }),
            new MinLength(3), // implicit 'error type'
            new MinLength(4, { type: 'y' }),
          ]}
          .modelValue=${'1234'}
        >${lightDom}</${customTypeTag}>
      `);
      expect(el.hasYVisible).to.be.false;
      expect(el.hasErrorVisible).to.be.false;
      expect(el.hasXVisible).to.be.false;

      el.modelValue = '1'; // triggers y, x and error
      await el.feedbackComplete;
      expect(el.hasYVisible).to.be.false;
      // Only shows message with highest prio (determined in el.constructor.validationTypes)
      expect(el.hasErrorVisible).to.be.true;
      expect(el.hasXVisible).to.be.false;
    });

    it('orders feedback based on provided "validationTypes"', async () => {
      const xMinLength = new MinLength(2, { type: 'x' });
      const errorMinLength = new MinLength(3, { type: 'error' });
      const yMinLength = new MinLength(4, { type: 'y' });

      const el = await fixture(html`
        <${customTypeTag}
          ._visibleMessagesAmount=${Infinity}
          .validators=${[xMinLength, errorMinLength, yMinLength]}
          .modelValue=${''}
        >${lightDom}</${customTypeTag}>
      `);
      const prioSpy = sinon.spy(el, '_prioritizeAndFilterFeedback');
      el.modelValue = '1';

      expect(prioSpy.callCount).to.equal(1);
      const configuredTypes = el.constructor.validationTypes; // => ['error', 'x', 'y'];
      const orderedResulTypes = el.__prioritizedResult.map(v => v.type);
      expect(orderedResulTypes).to.eql(configuredTypes);

      el.modelValue = '12';
      const orderedResulTypes2 = el.__prioritizedResult.map(v => v.type);
      expect(orderedResulTypes2).to.eql(['error', 'y']);
    });

    /**
     * Out of scope:
     * - automatic reflection of attrs (we would need to add to constructor.properties). See
     * 'Subclassers' for an example on how to do this
     */
  });

  describe('Subclassers', () => {
    describe('Adding new Validator types', () => {
      it('sends out events for custom types', async () => {
        const customEventsTagString = defineCE(
          class extends FeedbackMixin(ValidateMixin(LitElement)) {
            static get validationTypes() {
              return [...super.validationTypes, 'x', 'y'];
            }

            static get properties() {
              return {
                xStates: {
                  type: Object,
                  hasChanged: this._hasObjectChanged,
                },
                hasX: {
                  type: Boolean,
                  attribute: 'has-x',
                  reflect: true,
                },
                hasXVisible: {
                  type: Boolean,
                  attribute: 'has-x-visible',
                  reflect: true,
                },
                yStates: {
                  type: Object,
                  hasChanged: this._hasObjectChanged,
                },
                hasY: {
                  type: Boolean,
                  attribute: 'has-y',
                  reflect: true,
                },
                hasYVisible: {
                  type: Boolean,
                  attribute: 'has-y-visible',
                  reflect: true,
                }
              }
            }
          },
        );
        const customEventsTag = unsafeStatic(customEventsTagString);

        const xMinLength = new MinLength(2, { type: 'x' });
        const yMinLength = new MinLength(3, { type: 'y' });

        const el = await fixture(html`
        <${customEventsTag}
          .validators=${[xMinLength, yMinLength]}
        >${lightDom}</${customEventsTag}>
      `);
        const xChangedSpy = sinon.spy();
        const hasXChangedSpy = sinon.spy();
        el.addEventListener('x-states-changed', xChangedSpy);
        el.addEventListener('has-x-changed', hasXChangedSpy);

        const yChangedSpy = sinon.spy();
        const hasYChangedSpy = sinon.spy();
        el.addEventListener('y-states-changed', yChangedSpy);
        el.addEventListener('has-y-changed', hasYChangedSpy);

        el.modelValue = '1';
        await el.updateComplete;

        expect(xChangedSpy.callCount).to.equal(1);
        expect(hasXChangedSpy.callCount).to.equal(1);
        expect(yChangedSpy.callCount).to.equal(1);
        expect(hasYChangedSpy.callCount).to.equal(1);

        const yAlwaysInvalid = new AlwaysInvalid(null, { type: 'y' });
        el.validators = [...el.validators, yAlwaysInvalid];
        await el.updateComplete;

        expect(xChangedSpy.callCount).to.equal(1);
        expect(hasXChangedSpy.callCount).to.equal(1);
        expect(yChangedSpy.callCount).to.equal(2); // Change within y, since it went from 1 validator to two
        expect(hasYChangedSpy.callCount).to.equal(1);
      });
    });

    describe('Changing feedback visibility conditions', () => {
      // TODO: add this test on FormControl layer
      it('reconsiders feedback visibility when interaction states changed', async () => {

        const interactionTagString = defineCE(
          class extends FeedbackMixin(ValidateMixin(LitElement)) {
            static get properties() {
              return {
                modelValue: String,
                dirty: Boolean,
                touched: Boolean,
                prefilled: Boolean,
                submitted: Boolean,
              };
            }
          },
        );
        const interactionTag = unsafeStatic(interactionTagString);

        // see https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
        async function asyncForEach(array, callback) {
          for (let i = 0; i < array.length; i += 1) {
            // we explicitly want to run it one after each other
            await callback(array[i], i, array); // eslint-disable-line no-await-in-loop
          }
        }

        const el = await fixture(html`
          <${interactionTag}
            .validators=${[new AlwaysValid()]}
            .modelValue=${'myValue'}
          >${lightDom}</${interactionTag}>
        `);

        const feedbackSpy = sinon.spy(el, '_renderFeedback');
        let counter = 0;
        await asyncForEach(['dirty', 'touched', 'prefilled', 'submitted'], async (state) => {
          counter += 1;
          el[state] = false;
          await el.updateComplete;
          expect(feedbackSpy.callCount).to.equal(counter);
          counter += 1;
          el[state] = true;
          await el.updateComplete;
          expect(feedbackSpy.callCount).to.equal(counter);
        });
      });

      it('supports multiple "has{Type}Visible" flags', async () => {
        const customTypeTagString = defineCE(
          class extends FeedbackMixin(ValidateMixin(LitElement)) {
            static get validationTypes() {
              return [...super.validationTypes, 'x', 'y'];
            }

            constructor() {
              super();
              this._visibleMessagesAmount = Infinity;
            }
          },
        );
        const customTypeTag = unsafeStatic(customTypeTagString);

        const el = await fixture(html`
          <${customTypeTag}
            .validators=${[
              new MinLength(2, { type: 'x' }),
              new MinLength(3), // implicit 'error type'
              new MinLength(4, { type: 'y' }),
            ]}
            .modelValue=${'1234'}
          >${lightDom}</${customTypeTag}>
        `);
        expect(el.hasYVisible).to.be.false;
        expect(el.hasErrorVisible).to.be.false;
        expect(el.hasXVisible).to.be.false;

        el.modelValue = '1'; // triggers y
        await el.feedbackComplete;
        expect(el.hasYVisible).to.be.true;
        expect(el.hasErrorVisible).to.be.true;
        expect(el.hasXVisible).to.be.true; // only shows message with highest
      });
    });

    describe('Changing feedback messages globally', () => {
      // Please see tests of Validatiob Feedback
    });
  });
});
