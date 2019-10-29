/* eslint-disable max-classes-per-file, no-param-reassign, no-unused-expressions */
// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, fixture, html, unsafeStatic, defineCE } from '@open-wc/testing';
// eslint-disable-next-line import/no-extraneous-dependencies
import sinon from 'sinon';
import { LitElement } from '@lion/core';
import { ValidateMixin } from '../src/ValidateMixin.js';
import { Validator } from '../src/Validator.js';
import { Required } from '../src/validators/Required.js';
import { MinLength } from '../src/validators/StringValidators.js';
import { DefaultSuccess } from '../src/resultValidators/DefaultSuccess.js';
import {
  AlwaysInvalid,
} from '../test-helpers/helper-validators.js';
import '../lion-validation-feedback.js';
import { FeedbackMixin } from '../src/FeedbackMixin.js';

export function runFeedbackMixinSuite(customConfig) {
  const cfg = {
    tagString: null,
    ...customConfig,
  };

  const lightDom = cfg.lightDom || '';

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
}
