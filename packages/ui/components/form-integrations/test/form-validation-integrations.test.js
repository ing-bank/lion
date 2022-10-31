import { DefaultSuccess, Required, Validator } from '@lion/ui/form-core.js';
import { getFormControlMembers } from '@lion/ui/form-core-test-helpers.js';
import { LionInput } from '@lion/ui/input.js';
import { localize } from '@lion/ui/localize.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import { defineCE, expect, fixture, html, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';

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
      const el = /** @type {ValidateElementCustomTypes} */ (
        await fixture(html`
        <${elTag}
          .validators=${[
            new Required(null, { getMessage: async () => 'error' }),
            new WarnValidator(null, { getMessage: () => 'warning' }),
            new DefaultSuccess(),
          ]}
        >${lightDom}</${elTag}>
      `)
      );
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

    it('correctly renders localized fieldName (label), even on locale changes', async () => {
      class DefaultLabelInput extends LionInput {
        constructor() {
          super();
          this.setDefaultLabel();
        }

        async updateLabel() {
          this.label = localize.msg('test-default-label:label');
        }

        async setDefaultLabel() {
          localize.loadNamespace({
            'test-default-label': /** @param {string} locale */ async locale => {
              switch (locale) {
                case 'nl-NL':
                  return { label: 'Tekst' };
                default:
                  return { label: 'Text' };
              }
            },
          });
          this.boundUpdateLabel = this.updateLabel.bind(this);

          // localeChanged is fired AFTER localize has finished loading missing translations
          // so no need to await localize.loadingComplete
          localize.addEventListener('localeChanged', this.boundUpdateLabel);

          // Wait for it to complete when updating the label for the first time
          await localize.loadingComplete;
          this.boundUpdateLabel();
        }
      }
      const elTagString = defineCE(DefaultLabelInput);
      const elTag = unsafeStatic(elTagString);
      const el = /** @type {LionInput} */ (
        await fixture(html`
        <${elTag}
          .validators=${[new Required()]}
        >${lightDom}</${elTag}>
      `)
      );
      el.touched = true;
      el.dirty = true;
      await el.updateComplete;
      await el.feedbackComplete;
      const { _feedbackNode } = getFormControlMembers(el);
      expect(_feedbackNode.feedbackData?.[0].message).to.equal('Please enter a(n) Text.');

      localize.locale = 'nl-NL';
      await localize.loadingComplete;
      await el.updateComplete;
      await el.feedbackComplete;
      expect(el.label).to.equal('Tekst');
      expect(_feedbackNode.feedbackData?.[0].message).to.equal('Vul een Tekst in.');

      localize.locale = 'en-GB';
      await localize.loadingComplete;
      await el.updateComplete;
      await el.feedbackComplete;
      expect(el.label).to.equal('Text');
      expect(_feedbackNode.feedbackData?.[0].message).to.equal('Please enter a(n) Text.');
    });
  });
});
