import { expect, fixture, html, unsafeStatic, defineCE } from '@open-wc/testing';
import sinon from 'sinon';
import { LitElement } from '@lion/core';
import { Validator } from '../src/Validator.js';
import { Required } from '../src/validators/Required.js';
import { MinLength } from '../src/validators/StringValidators.js';
import { DefaultSuccess } from '../src/resultValidators/DefaultSuccess.js';
import { AlwaysInvalid } from '../test-helpers/helper-validators.js';
import { ValidateMixin } from '../src/ValidateMixin.js';

export function runFeedbackMixinSuite() {
  describe('Validity Feedback', () => {
    let tagString;
    let tag;
    let ContainsLowercaseA;
    const lightDom = '';

    before(() => {
      tagString = defineCE(
        class extends ValidateMixin(LitElement) {
          static get properties() {
            return {
              modelValue: { type: String },
              submitted: { type: Boolean },
            };
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
      tag = unsafeStatic(tagString);

      ContainsLowercaseA = class extends Validator {
        constructor(...args) {
          super(...args);
          this.name = 'ContainsLowercaseA';
        }

        execute(modelValue) {
          const hasError = !modelValue.includes('a');
          return hasError;
        }
      };

      class ContainsCat extends Validator {
        constructor(...args) {
          super(...args);
          this.name = 'ContainsCat';
        }

        execute(modelValue) {
          const hasError = !modelValue.includes('cat');
          return hasError;
        }
      }

      AlwaysInvalid.getMessage = () => 'Message for AlwaysInvalid';
      MinLength.getMessage = () => 'Message for MinLength';
      ContainsLowercaseA.getMessage = () => 'Message for ContainsLowercaseA';
      ContainsCat.getMessage = () => 'Message for ContainsCat';
    });

    afterEach(() => {
      sinon.restore();
    });

    it('has .shouldShowFeedbackFor indicating for which type to show messages', async () => {
      const el = await fixture(html`
        <${tag}>${lightDom}</${tag}>
      `);
      expect(el.shouldShowFeedbackFor).to.deep.equal([]);
      el.submitted = true;
      await el.updateComplete;
      expect(el.shouldShowFeedbackFor).to.deep.equal(['error']);
    });

    it('has .showsFeedbackFor indicating for which type it actually shows messages', async () => {
      const el = await fixture(html`
        <${tag} submitted .validators=${[new MinLength(3)]}>${lightDom}</${tag}>
      `);

      el.modelValue = 'a';
      await el.feedbackComplete;
      expect(el.showsFeedbackFor).to.deep.equal(['error']);

      el.modelValue = 'abc';
      await el.feedbackComplete;
      expect(el.showsFeedbackFor).to.deep.equal([]);
    });

    it('reflects .showsFeedbackFor as attribute joined with "," to be used as a style hook', async () => {
      const elTagString = defineCE(
        class extends ValidateMixin(LitElement) {
          static get validationTypes() {
            return [...super.validationTypes, 'x'];
          }
        },
      );
      const elTag = unsafeStatic(elTagString);
      const el = await fixture(html`
        <${elTag}
          .submitted=${true}
          .validators=${[
            new MinLength(2, { type: 'x' }),
            new MinLength(3, { type: 'error' }),
          ]}>${lightDom}</${elTag}>
      `);

      el.modelValue = '1';
      await el.feedbackComplete;
      expect(el.showsFeedbackFor).to.deep.equal(['error', 'x']);
      expect(el.getAttribute('shows-feedback-for')).to.equal('error,x');

      el.modelValue = '12';
      await el.feedbackComplete;
      expect(el.showsFeedbackFor).to.deep.equal(['error']);
      expect(el.getAttribute('shows-feedback-for')).to.equal('error');

      el.modelValue = '123';
      await el.feedbackComplete;
      expect(el.showsFeedbackFor).to.deep.equal([]);
      expect(el.getAttribute('shows-feedback-for')).to.equal('');
    });

    it('passes a message to the "._feedbackNode"', async () => {
      const el = await fixture(html`
        <${tag}
          .modelValue=${'cat'}
        >${lightDom}</${tag}>
      `);
      expect(el._feedbackNode.feedbackData).to.be.undefined;
      el.validators = [new AlwaysInvalid()];
      await el.updateComplete;
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
      await el.feedbackComplete;
      expect(el._feedbackNode.feedbackData[0].message).to.equal('Message for AlwaysInvalid');
      el._prioritizeAndFilterFeedback = () => []; // filter out all errors
      await el.validate();
      await el.feedbackComplete;
      expect(el._feedbackNode.feedbackData).to.be.undefined;
    });

    it('writes prioritized result to "._feedbackNode" based on Validator order', async () => {
      const el = await fixture(html`
        <${tag}
          .modelValue=${'cat'}
          .validators=${[new AlwaysInvalid(), new MinLength(4)]}
        >${lightDom}</${tag}>
      `);
      await el.feedbackComplete;
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
            };
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
      await el.updateComplete;
      await el.feedbackComplete;
      await el._feedbackNode.updateComplete;
      expect(el._feedbackNode).shadowDom.to.equal('Custom for ContainsLowercaseA');

      el.modelValue = 'cat';
      await el.updateComplete;
      await el.feedbackComplete;
      await el._feedbackNode.updateComplete;
      expect(el._feedbackNode).shadowDom.to.equal('Custom for AlwaysInvalid');
    });

    it('supports custom messages in Validator instance configuration object', async () => {
      const el = await fixture(html`
        <${tag} .validators=${[new MinLength(3, { getMessage: () => 'custom via config' })]}
        >${lightDom}</${tag}>
      `);

      el.modelValue = 'a';
      await el.updateComplete;
      await el.feedbackComplete;
      expect(el._feedbackNode.feedbackData[0].message).to.equal('custom via config');
    });

    it('shows success message after fixing an error', async () => {
      const el = await fixture(html`
        <${tag}
          .validators=${[
            new MinLength(3),
            new DefaultSuccess(null, { getMessage: () => 'This is a success message' }),
          ]}
        >${lightDom}</${tag}>
      `);

      el.modelValue = 'a';
      await el.updateComplete;
      await el.feedbackComplete;
      expect(el._feedbackNode.feedbackData[0].message).to.equal('Message for MinLength');

      el.modelValue = 'abcd';
      await el.updateComplete;
      await el.feedbackComplete;
      expect(el._feedbackNode.feedbackData[0].message).to.equal('This is a success message');
    });

    describe('Accessibility', () => {
      it('sets [aria-invalid="true"] to "._inputNode" when there is an error', async () => {
        const el = await fixture(html`
          <${tag}
            submitted
            .validators=${[new Required()]}
            .modelValue=${'a'}
          >${lightDom}</${tag}>
        `);
        const inputNode = el._inputNode;
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

    describe('Meta data', () => {
      it('".getMessage()" gets a reference to formControl, validatorParams, modelValue and type', async () => {
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
        expect(constructorMessageSpy.args[0][0]).to.eql({
          validatorParams: 4,
          modelValue: 'cat',
          formControl: el,
          fieldName: undefined,
          type: 'x',
        });

        const instanceMessageSpy = sinon.spy();
        const instanceValidator = new MinLength(4, { getMessage: instanceMessageSpy });

        el = await fixture(html`
          <${tag}
            .validators=${[instanceValidator]}
            .modelValue=${'cat'}
          >${lightDom}</${tag}>
        `);
        await el.feedbackComplete;
        expect(instanceMessageSpy.args[0][0]).to.eql({
          validatorParams: 4,
          modelValue: 'cat',
          formControl: el,
          fieldName: undefined,
          type: 'error',
        });
      });

      it('".getMessage()" gets .fieldName defined on instance', async () => {
        const constructorValidator = new MinLength(4);
        const spy = sinon.spy(constructorValidator.constructor, 'getMessage');

        const el = await fixture(html`
          <${tag}
            .validators=${[constructorValidator]}
            .modelValue=${'cat'}
            .fieldName=${new Promise(resolve => resolve('myField'))}
          >${lightDom}</${tag}>
        `);
        await el.feedbackComplete;
        expect(spy.args[0][0]).to.eql({
          validatorParams: 4,
          modelValue: 'cat',
          formControl: el,
          fieldName: 'myField',
          type: 'error',
        });
      });
    });

    it('".getMessage()" gets .fieldName defined on Validator config', async () => {
      const constructorValidator = new MinLength(4, {
        fieldName: new Promise(resolve => resolve('myFieldViaCfg')),
      });
      const spy = sinon.spy(constructorValidator.constructor, 'getMessage');

      const el = await fixture(html`
        <${tag}
          .validators=${[constructorValidator]}
          .modelValue=${'cat'}
          .fieldName=${new Promise(resolve => resolve('myField'))}
        >${lightDom}</${tag}>
      `);
      await el.feedbackComplete;
      expect(spy.args[0][0]).to.eql({
        validatorParams: 4,
        modelValue: 'cat',
        formControl: el,
        fieldName: 'myFieldViaCfg',
        type: 'error',
      });
    });
  });
}
