import { expect, fixture, html, defineCE, unsafeStatic } from '@open-wc/testing';
import { Required, DefaultSuccess, Validator } from '@lion/form-core';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
import { LionInput } from '@lion/input';
import sinon from 'sinon';
import { getFormControlMembers } from '@lion/form-core/test-helpers';

describe('Form Validation Integrations', () => {
  const lightDom = '';
  before(() => {
    loadDefaultFeedbackMessages();
  });

  describe('DefaultSuccess', () => {
    it('does not show success feedback if the user is not recovering from a shown error/warning feedback', async () => {
      class WarnValidator extends Validator {
        /**
         *
         * @param {?} [param]
         * @param {Object.<string,?>} [config]
         */
        constructor(param, config) {
          super(param, config);
          this.type = 'warning';
        }

        /** @param {string} value */
        execute(value) {
          let hasError = false;
          if (value === 'warn') {
            hasError = true;
          }
          return hasError;
        }
      }

      class ValidateElementCustomTypes extends LionInput {
        static get validationTypes() {
          return ['error', 'warning', 'success'];
        }
      }
      const elTagString = defineCE(ValidateElementCustomTypes);
      const elTag = unsafeStatic(elTagString);
      const el = /** @type {ValidateElementCustomTypes} */ (await fixture(html`
        <${elTag}
          .validators=${[
            new Required(null, { getMessage: () => 'error' }),
            new WarnValidator(null, { getMessage: () => 'warning' }),
            new DefaultSuccess(),
          ]}
        >${lightDom}</${elTag}>
      `));
      const { _feedbackNode } = getFormControlMembers(el);

      expect(_feedbackNode.feedbackData?.length).to.equal(0);

      el.modelValue = 'w';
      el.touched = true;
      await el.updateComplete;
      await el.feedbackComplete;
      expect(el.showsFeedbackFor).to.eql([]);

      el.modelValue = 'warn';
      await el.updateComplete;
      await el.feedbackComplete;
      expect(_feedbackNode.feedbackData?.[0].message).to.equal('warning');

      el.modelValue = 'war';
      await el.updateComplete;
      await el.feedbackComplete;

      expect([
        'Okay',
        'Correct',
        'Succeeded',
        'Ok!',
        'This is right.',
        'Changed!',
        'Ok, correct.',
      ]).to.include(
        /** @type {{  message: string ;type: string; validator?: Validator | undefined;}[]} */
        (_feedbackNode.feedbackData)[0].message,
      );

      el.modelValue = '';
      await el.updateComplete;
      await el.feedbackComplete;
      expect(_feedbackNode.feedbackData?.[0].message).to.equal('error');

      el.modelValue = 'war';
      await el.updateComplete;
      await el.feedbackComplete;

      expect([
        'Okay',
        'Correct',
        'Succeeded',
        'Ok!',
        'This is right.',
        'Changed!',
        'Ok, correct.',
      ]).to.include(
        /** @type {{  message: string ;type: string; validator?: Validator | undefined;}[]} */
        (_feedbackNode.feedbackData)[0].message,
      );

      // Check that change in focused or other interaction states does not refresh the success message
      // without a change in validation results
      // @ts-ignore [allow-protected] in test
      const spy = sinon.spy(el, '_updateFeedbackComponent');
      // @ts-ignore [allow-protected] in test
      el._updateShouldShowFeedbackFor();
      await el.updateComplete;
      await el.feedbackComplete;
      expect(spy.called).to.be.false;
    });
  });
});
