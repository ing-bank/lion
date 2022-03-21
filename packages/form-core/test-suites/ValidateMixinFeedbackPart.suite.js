import { LitElement } from '@lion/core';
import { localize } from '@lion/localize';
import { localizeTearDown } from '@lion/localize/test-helpers';
import { defineCE, expect, fixture, html, unsafeStatic } from '@open-wc/testing';
import { getFormControlMembers } from '@lion/form-core/test-helpers';
import sinon from 'sinon';
import { DefaultSuccess, MinLength, Required, ValidateMixin, Validator } from '../index.js';
import { AlwaysInvalid } from '../test-helpers/index.js';

/**
 * @typedef {import('../types').FeedbackMessageData} FeedbackMessageData
 */

export function runValidateMixinFeedbackPart() {
  describe('Validity Feedback', () => {
    beforeEach(() => {
      localizeTearDown();
    });

    class ValidateElement extends ValidateMixin(LitElement) {
      connectedCallback() {
        super.connectedCallback();
        const inputNode = document.createElement('input');
        inputNode.slot = 'input';
        this.appendChild(inputNode);
      }
    }

    const tagString = defineCE(ValidateElement);
    const tag = unsafeStatic(tagString);

    class ContainsLowercaseA extends Validator {
      static get validatorName() {
        return 'ContainsLowercaseA';
      }

      /**
       * @param {?} modelValue
       */
      execute(modelValue) {
        const hasError = !modelValue.includes('a');
        return hasError;
      }
    }

    class ContainsCat extends Validator {
      static get validatorName() {
        return 'ContainsCat';
      }

      /**
       * @param {?} modelValue
       */
      execute(modelValue) {
        const hasError = !modelValue.includes('cat');
        return hasError;
      }
    }

    AlwaysInvalid.getMessage = async () => 'Message for AlwaysInvalid';
    MinLength.getMessage = async () =>
      localize.locale === 'de-DE' ? 'Nachricht für MinLength' : 'Message for MinLength';
    ContainsLowercaseA.getMessage = async () => 'Message for ContainsLowercaseA';
    ContainsCat.getMessage = async () => 'Message for ContainsCat';

    const lightDom = '';

    afterEach(() => {
      sinon.restore();
    });

    it('has .showsFeedbackFor indicating for which type it actually shows messages', async () => {
      const el = /** @type {ValidateElement} */ (
        await fixture(html`
        <${tag} submitted .validators=${[new MinLength(3)]}>${lightDom}</${tag}>
      `)
      );

      el.modelValue = 'a';
      await el.feedbackComplete;
      expect(el.showsFeedbackFor).to.deep.equal(['error']);

      el.modelValue = 'abc';
      await el.feedbackComplete;
      expect(el.showsFeedbackFor).to.deep.equal([]);
    });

    it('reflects .showsFeedbackFor as attribute joined with "," to be used as a style hook', async () => {
      class ValidateElementCustomTypes extends ValidateMixin(LitElement) {
        static get validationTypes() {
          return [...super.validationTypes, 'x'];
        }
      }
      const elTagString = defineCE(ValidateElementCustomTypes);
      const elTag = unsafeStatic(elTagString);
      const el = /** @type {ValidateElementCustomTypes} */ (
        await fixture(html`
        <${elTag}
          .submitted=${true}
          .validators=${[
            new MinLength(2, { type: 'x' }),
            new MinLength(3, { type: 'error' }),
          ]}>${lightDom}</${elTag}>
      `)
      );

      el.modelValue = '1';
      await el.updateComplete;
      await el.feedbackComplete;
      expect(el.showsFeedbackFor).to.deep.equal(['error', 'x']);
      expect(el.getAttribute('shows-feedback-for')).to.equal('error,x');

      el.modelValue = '12';
      await el.updateComplete;
      await el.feedbackComplete;
      expect(el.showsFeedbackFor).to.deep.equal(['error']);
      expect(el.getAttribute('shows-feedback-for')).to.equal('error');

      el.modelValue = '123';
      await el.updateComplete;
      await el.feedbackComplete;
      expect(el.showsFeedbackFor).to.deep.equal([]);
      expect(el.getAttribute('shows-feedback-for')).to.equal('');
    });

    it('passes a message to the "._feedbackNode"', async () => {
      const el = /** @type {ValidateElement} */ (
        await fixture(html`
        <${tag}
          .submitted=${true}
          .modelValue=${'cat'}
        >${lightDom}</${tag}>
      `)
      );
      const { _feedbackNode } = getFormControlMembers(el);

      expect(_feedbackNode.feedbackData).to.deep.equal([]);
      el.validators = [new AlwaysInvalid()];
      await el.updateComplete;
      await el.feedbackComplete;
      expect(_feedbackNode.feedbackData?.[0].message).to.equal('Message for AlwaysInvalid');
    });

    it('has configurable feedback visibility hook', async () => {
      const el = /** @type {ValidateElement} */ (
        await fixture(html`
        <${tag}
          .submitted=${true}
          .modelValue=${'cat'}
          .validators=${[new AlwaysInvalid()]}
        >${lightDom}</${tag}>
      `)
      );
      const { _feedbackNode } = getFormControlMembers(el);

      await el.updateComplete;
      await el.feedbackComplete;
      expect(_feedbackNode.feedbackData?.[0].message).to.equal('Message for AlwaysInvalid');
      // @ts-ignore [allow-protected] in test
      el._prioritizeAndFilterFeedback = () => []; // filter out all errors
      await el.validate();
      await el.updateComplete;
      await el.feedbackComplete;
      expect(_feedbackNode.feedbackData).to.deep.equal([]);
    });

    it('writes prioritized result to "._feedbackNode" based on Validator order', async () => {
      const el = /** @type {ValidateElement} */ (
        await fixture(html`
        <${tag}
          .submitted=${true}
          .modelValue=${'cat'}
          .validators=${[new AlwaysInvalid(), new MinLength(4)]}
        >${lightDom}</${tag}>
      `)
      );
      const { _feedbackNode } = getFormControlMembers(el);

      await el.updateComplete;
      await el.feedbackComplete;
      expect(_feedbackNode.feedbackData?.[0].message).to.equal('Message for AlwaysInvalid');
    });

    it('renders validation result to "._feedbackNode" when async messages are resolved', async () => {
      /** @type {function} FIXME: find better way to type this kind of pattern */
      let unlockMessage = () => {};
      const messagePromise = new Promise(resolve => {
        unlockMessage = resolve;
      });

      AlwaysInvalid.getMessage = async () => {
        await messagePromise;
        return 'this ends up in "._feedbackNode"';
      };

      const el = /** @type {ValidateElement} */ (
        await fixture(html`
        <${tag}
          .submitted=${true}
          .modelValue=${'cat'}
          .validators=${[new AlwaysInvalid()]}
        >${lightDom}</${tag}>
      `)
      );
      const { _feedbackNode } = getFormControlMembers(el);

      expect(_feedbackNode.feedbackData).to.be.undefined;
      unlockMessage();
      await el.updateComplete;
      await el.feedbackComplete;
      expect(_feedbackNode.feedbackData?.[0].message).to.equal('this ends up in "._feedbackNode"');
    });

    // N.B. this replaces the 'config.hideFeedback' option we had before...
    it('renders empty result when Validator.getMessage() returns "null"', async () => {
      /** @type {function} FIXME: find better way to type this kind of pattern */
      let unlockMessage = () => {};
      const messagePromise = new Promise(resolve => {
        unlockMessage = resolve;
      });

      AlwaysInvalid.getMessage = async () => {
        await messagePromise;
        return 'this ends up in "._feedbackNode"';
      };

      const el = /** @type {ValidateElement} */ (
        await fixture(html`
        <${tag}
          .submitted=${true}
          .modelValue=${'cat'}
          .validators=${[new AlwaysInvalid()]}
        >${lightDom}</${tag}>
      `)
      );
      const { _feedbackNode } = getFormControlMembers(el);

      expect(_feedbackNode.feedbackData).to.be.undefined;
      unlockMessage();
      await el.updateComplete;
      await el.feedbackComplete;
      expect(_feedbackNode.feedbackData?.[0].message).to.equal('this ends up in "._feedbackNode"');
    });

    it('supports custom element to render feedback', async () => {
      class ValidateElementCustomRender extends LitElement {
        static get properties() {
          return {
            feedbackData: { attribute: false },
          };
        }

        constructor() {
          super();
          /**
           * @typedef {Object} messageMap
           * @property {string | Node} message
           * @property {string} type
           * @property {Validator} [validator]
           */

          /** @type {messageMap[]} */
          this.feedbackData = [];
        }

        render() {
          let name = '';
          if (this.feedbackData && this.feedbackData.length > 0) {
            const ctor = /** @type {typeof Validator} */ (
              this.feedbackData[0]?.validator?.constructor
            );
            name = ctor.validatorName;
          }
          return html`Custom for ${name}`;
        }
      }
      const customFeedbackTagString = defineCE(ValidateElementCustomRender);
      const customFeedbackTag = unsafeStatic(customFeedbackTagString);
      const el = /** @type {ValidateElement} */ (
        await fixture(html`
        <${tag}
          .submitted=${true}
          .validators=${[new ContainsLowercaseA(), new AlwaysInvalid()]}>
          <${customFeedbackTag} slot="feedback"><${customFeedbackTag}>
        </${tag}>
      `)
      );
      const { _feedbackNode } = getFormControlMembers(el);

      expect(_feedbackNode.localName).to.equal(customFeedbackTagString);

      el.modelValue = 'dog';
      await el.updateComplete;
      await el.feedbackComplete;
      await _feedbackNode.updateComplete;
      expect(_feedbackNode).shadowDom.to.equal('Custom for ContainsLowercaseA');

      el.modelValue = 'cat';
      await el.updateComplete;
      await el.feedbackComplete;
      await _feedbackNode.updateComplete;
      expect(_feedbackNode).shadowDom.to.equal('Custom for AlwaysInvalid');
    });

    it('supports custom messages in Validator instance configuration object', async () => {
      const el = /** @type {ValidateElement} */ (
        await fixture(html`
        <${tag}
          .submitted=${true}
          .validators=${[new MinLength(3, { getMessage: async () => 'custom via config' })]}
        >${lightDom}</${tag}>
      `)
      );
      const { _feedbackNode } = getFormControlMembers(el);

      el.modelValue = 'a';
      await el.updateComplete;
      await el.feedbackComplete;
      expect(_feedbackNode.feedbackData?.[0].message).to.equal('custom via config');
    });

    it('updates the feedback component when locale changes', async () => {
      const el = /** @type {ValidateElement} */ (
        await fixture(html`
        <${tag}
          .submitted=${true}
          .validators=${[new MinLength(3)]}
          .modelValue=${'1'}
        >${lightDom}</${tag}>
      `)
      );
      const { _feedbackNode } = getFormControlMembers(el);

      await el.feedbackComplete;
      expect(_feedbackNode.feedbackData?.length).to.equal(1);
      expect(_feedbackNode.feedbackData?.[0].message).to.equal('Message for MinLength');

      localize.locale = 'de-DE';
      await localize.loadingComplete;
      await el.feedbackComplete;
      expect(_feedbackNode.feedbackData?.[0].message).to.equal('Nachricht für MinLength');
    });

    it('shows success message after fixing an error', async () => {
      class ValidateElementCustomTypes extends ValidateMixin(LitElement) {
        static get validationTypes() {
          return ['error', 'success'];
        }
      }
      const elTagString = defineCE(ValidateElementCustomTypes);
      const elTag = unsafeStatic(elTagString);
      const el = /** @type {ValidateElementCustomTypes} */ (
        await fixture(html`
        <${elTag}
          .submitted=${true}
          .validators=${[
            new MinLength(3),
            new DefaultSuccess(null, { getMessage: () => 'This is a success message' }),
          ]}
        >${lightDom}</${elTag}>
      `)
      );
      const { _feedbackNode } = getFormControlMembers(el);

      el.modelValue = 'a';
      await el.updateComplete;
      await el.feedbackComplete;
      expect(_feedbackNode.feedbackData?.[0].message).to.equal('Message for MinLength');

      el.modelValue = 'abcd';
      await el.updateComplete;
      await el.feedbackComplete;
      expect(_feedbackNode.feedbackData?.[0].message).to.equal('This is a success message');
    });

    describe('Accessibility', () => {
      it('sets [aria-invalid="true"] to "._inputNode" when there is an error', async () => {
        const el = /** @type {ValidateElement} */ (
          await fixture(html`
          <${tag}
            submitted
            .validators=${[new Required()]}
            .modelValue=${'a'}
          >${lightDom}</${tag}>
        `)
        );
        const { _inputNode } = getFormControlMembers(el);

        const inputNode = _inputNode;
        expect(inputNode.getAttribute('aria-invalid')).to.equal('false');

        el.modelValue = '';
        await el.updateComplete;
        await el.feedbackComplete;
        expect(inputNode.getAttribute('aria-invalid')).to.equal('true');

        el.modelValue = 'a';
        await el.updateComplete;
        await el.feedbackComplete;
        expect(inputNode.getAttribute('aria-invalid')).to.equal('false');
      });
    });

    describe('FeedbackMessageData', () => {
      it('".getMessage()" gets a reference to formControl, params, modelValue and type', async () => {
        class ValidateElementCustomTypes extends ValidateMixin(LitElement) {
          static get validationTypes() {
            return ['error', 'x'];
          }
        }

        const elTagString = defineCE(ValidateElementCustomTypes);
        const elTag = unsafeStatic(elTagString);
        let el;
        const constructorValidator = new MinLength(4, { type: 'x' }); // type to prevent duplicates
        const ctorValidator = /** @type {typeof MinLength} */ (constructorValidator.constructor);
        const constructorMessageSpy = sinon.spy(ctorValidator, 'getMessage');

        el = /** @type {ValidateElementCustomTypes} */ (
          await fixture(html`
          <${elTag}
            .submitted=${true}
            .validators=${[constructorValidator]}
            .modelValue=${'cat'}
          >${lightDom}</${elTag}>
        `)
        );
        await el.updateComplete;
        await el.feedbackComplete;
        expect(constructorMessageSpy.args[0][0]).to.eql({
          config: { type: 'x' },
          params: 4,
          modelValue: 'cat',
          formControl: el,
          fieldName: '',
          type: 'x',
          name: 'MinLength',
          outcome: true,
        });

        const instanceMessageSpy = sinon.spy();
        const instanceValidator = new MinLength(4, { getMessage: instanceMessageSpy });

        el = /** @type {ValidateElementCustomTypes} */ (
          await fixture(html`
          <${elTag}
            .submitted=${true}
            .validators=${[instanceValidator]}
            .modelValue=${'cat'}
          >${lightDom}</${elTag}>
        `)
        );
        await el.updateComplete;
        await el.feedbackComplete;
        expect(instanceMessageSpy.args[0][0]).to.eql({
          config: {
            getMessage: instanceMessageSpy,
          },
          params: 4,
          modelValue: 'cat',
          formControl: el,
          fieldName: '',
          type: 'error',
          name: 'MinLength',
          outcome: true,
        });
      });

      it('".getMessage()" gets .fieldName defined on instance', async () => {
        const constructorValidator = new MinLength(4);
        const ctorValidator = /** @type {typeof MinLength} */ (constructorValidator.constructor);
        const spy = sinon.spy(ctorValidator, 'getMessage');

        const el = /** @type {ValidateElement} */ (
          await fixture(html`
          <${tag}
            .submitted=${true}
            .validators=${[constructorValidator]}
            .modelValue=${'cat'}
            .fieldName=${new Promise(resolve => resolve('myField'))}
          >${lightDom}</${tag}>
        `)
        );
        await el.updateComplete;
        await el.feedbackComplete;
        expect(spy.args[0][0]).to.eql({
          config: {},
          params: 4,
          modelValue: 'cat',
          formControl: el,
          fieldName: 'myField',
          type: 'error',
          name: 'MinLength',
          outcome: true,
        });
      });

      it('".getMessage()" gets .fieldName defined on Validator config', async () => {
        const constructorValidator = new MinLength(4, {
          fieldName: new Promise(resolve => resolve('myFieldViaCfg')),
        });
        const ctorValidator = /** @type {typeof MinLength} */ (constructorValidator.constructor);
        const spy = sinon.spy(ctorValidator, 'getMessage');

        const el = /** @type {ValidateElement} */ (
          await fixture(html`
          <${tag}
            .submitted=${true}
            .validators=${[constructorValidator]}
            .modelValue=${'cat'}
            .fieldName=${new Promise(resolve => resolve('myField'))}
          >${lightDom}</${tag}>
        `)
        );
        await el.updateComplete;
        await el.feedbackComplete;

        // ignore fieldName Promise as it will always be unique
        const compare = spy.args[0][0];
        delete compare?.config?.fieldName;
        expect(compare).to.eql({
          config: {},
          params: 4,
          modelValue: 'cat',
          formControl: el,
          fieldName: 'myFieldViaCfg',
          type: 'error',
          name: 'MinLength',
          outcome: true,
        });
      });

      it('".getMessage()" gets .outcome, which can be "true" or an enum', async () => {
        class EnumOutComeValidator extends Validator {
          static validatorName = 'EnumOutCome';

          execute() {
            return 'a-string-instead-of-bool';
          }

          /**
           * @param {FeedbackMessageData} meta
           * @returns
           */
          static async getMessage({ outcome }) {
            const results = {
              'a-string-instead-of-bool': 'Msg based on enum output',
            };
            return results[/** @type {string} */ (outcome)];
          }
        }

        const enumOutComeValidator = new EnumOutComeValidator();
        const spy = sinon.spy(
          /** @type {typeof EnumOutComeValidator} */ (enumOutComeValidator.constructor),
          'getMessage',
        );

        const el = /** @type {ValidateElement} */ (
          await fixture(html`
          <${tag}
            .submitted=${true}
            .validators=${[enumOutComeValidator]}
            .modelValue=${'cat'}
          >${lightDom}</${tag}>
        `)
        );
        await el.updateComplete;
        await el.feedbackComplete;

        const getMessageArs = spy.args[0][0];
        expect(getMessageArs.outcome).to.equal('a-string-instead-of-bool');
      });
    });

    it('handles _updateFeedbackComponent with sync and async combinations', async () => {
      /**
       * Problem before, without the Queue system:
       * 1) has an error initially, starts fetching translations *
       * 2) We correct the error my setting the modelValue to valid input
       * 3) Synchronously sets the feedback to []
       * 4) * fetching translations finished, sets the feedback back to an error
       *
       * The Queue system solves this by queueing the updateFeedbackComponent tasks and
       * await them one by one.
       */
      const el = /** @type {ValidateElement} */ (
        await fixture(html`
        <${tag}
          .submitted=${true}
          .validators=${[new MinLength(3)]}
          .modelValue=${'1'}
        >${lightDom}</${tag}>
      `)
      );
      const { _feedbackNode } = getFormControlMembers(el);

      el.modelValue = '12345';
      await el.updateComplete;
      await el.feedbackComplete;

      expect(_feedbackNode.feedbackData).to.deep.equal([]);
    });
  });
}
