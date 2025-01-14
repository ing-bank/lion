import { LitElement } from 'lit';
import { parseDate } from '@lion/ui/localize-no-side-effects.js';
import { aTimeout, defineCE, expect, fixture, html, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';
import { Unparseable, Validator, FormatMixin } from '@lion/ui/form-core.js';
import { getFormControlMembers, mimicUserInput } from '@lion/ui/form-core-test-helpers.js';

const isLionInputStepper = (/** @type {FormatClass} */ el) => 'valueTextMapping' in el;

/**
 * @typedef {import('../types/FormControlMixinTypes.js').FormControlHost} FormControlHost
 * @typedef {ArrayConstructor | ObjectConstructor | NumberConstructor | BooleanConstructor | StringConstructor | DateConstructor | 'iban' | 'email'} modelValueType
 */

class FormatClass extends FormatMixin(LitElement) {
  get _inputNode() {
    return /** @type {HTMLInputElement} */ (super._inputNode); // casts type
  }

  render() {
    return html`<slot name="input"></slot>`;
  }

  set value(newValue) {
    if (this._inputNode) {
      this._inputNode.value = newValue;
    }
  }

  get value() {
    if (this._inputNode) {
      return this._inputNode.value;
    }
    return '';
  }
}

/**
 * @param {{tagString?: string, modelValueType?: modelValueType}} [customConfig]
 */
export function runFormatMixinSuite(customConfig) {
  const cfg = {
    tagString: null,
    childTagString: null,
    modelValueType: String,
    ...customConfig,
  };

  /**
   * Mocks a value for you based on the data type
   * Optionally toggles you a different value
   * for needing to mimic a value-change.
   */
  function generateValueBasedOnType(opts = {}) {
    const options = { type: cfg.modelValueType, toggleValue: false, viewValue: false, ...opts };

    switch (options.type) {
      case Number:
        return !options.toggleValue ? '123' : '456';
      case Date:
        // viewValue instead of modelValue, since a Date object is unparseable.
        // Note: this viewValue needs to point to the same date as the
        // default returned modelValue.
        if (options.viewValue) {
          return !options.toggleValue ? '5-5-2005' : '10-10-2010';
        }
        return !options.toggleValue ? parseDate('5-5-2005') : parseDate('10-10-2010');
      case Array:
        return !options.toggleValue ? ['foo', 'bar'] : ['baz', 'yay'];
      case Object:
        return !options.toggleValue ? { foo: 'bar' } : { bar: 'foo' };
      case Boolean:
        return !options.toggleValue;
      case 'email':
        return !options.toggleValue ? 'some-user@ing.com' : 'another-user@ing.com';
      case 'iban':
        return !options.toggleValue ? 'SE3550000000054910000003' : 'CH9300762011623852957';
      default:
        return !options.toggleValue ? 'foo' : 'bar';
    }
  }

  describe('FormatMixin', async () => {
    /** @type {{_$litStatic$: any}} */
    let tag;
    /** @type {FormatClass} */
    let nonFormat;
    /** @type {FormatClass} */
    let fooFormat;

    before(async () => {
      if (!cfg.tagString) {
        cfg.tagString = defineCE(FormatClass);
      }
      tag = unsafeStatic(cfg.tagString);

      nonFormat = await fixture(html`
        <${tag}
          .formatter="${/** @param {?} v */ v => v}"
          .parser="${/** @param {string} v */ v => v}"
          .serializer="${/** @param {?} v */ v => v}"
          .deserializer="${/** @param {string} v */ v => v}"
        >
          <input slot="input">
        </${tag}>
      `);

      fooFormat = await fixture(html`
        <${tag}
          .formatter="${/** @param {string} value */ value => `foo: ${value}`}"
          .parser="${/** @param {string} value */ value => value.replace('foo: ', '')}"
          .serializer="${/** @param {string} value */ value => `[foo] ${value}`}"
          .deserializer="${/** @param {string} value */ value => value.replace('[foo] ', '')}"
        >
          <input slot="input">
        </${tag}>
      `);
    });

    it('has modelValue, formattedValue and serializedValue which are computed synchronously', async () => {
      expect(nonFormat.modelValue).to.equal('', 'modelValue initially');
      expect(nonFormat.formattedValue).to.equal('', 'formattedValue initially');
      expect(nonFormat.serializedValue).to.equal('', 'serializedValue initially');
      const generatedValue = generateValueBasedOnType();
      nonFormat.modelValue = generatedValue;
      expect(nonFormat.modelValue).to.equal(generatedValue, 'modelValue as provided');
      expect(nonFormat.formattedValue).to.equal(generatedValue, 'formattedValue synchronized');
      expect(nonFormat.serializedValue).to.equal(generatedValue, 'serializedValue synchronized');
    });

    /**
     * Reminder: modelValue is the SSOT all other values are derived from
     * (and should be translated to)
     */
    describe('ModelValue', () => {
      it('fires `model-value-changed` for every programmatic modelValue change', async () => {
        const el = /** @type {FormatClass} */ (
          await fixture(html`<${tag}><input slot="input"></${tag}>`)
        );
        let counter = 0;
        let isTriggeredByUser = false;

        el.addEventListener('model-value-changed', event => {
          counter += 1;
          isTriggeredByUser = /** @type {CustomEvent} */ (event).detail.isTriggeredByUser;
        });

        el.modelValue = 'one';
        expect(counter).to.equal(1);
        expect(isTriggeredByUser).to.be.false;

        // no change means no event
        el.modelValue = 'one';
        expect(counter).to.equal(1);

        el.modelValue = 'two';
        expect(counter).to.equal(2);
      });

      it('fires `model-value-changed` for every user input, adding `isTriggeredByUser` in event detail', async () => {
        const formatEl = /** @type {FormatClass} */ (
          await fixture(html`<${tag}><input slot="input"></${tag}>`)
        );

        let counter = 0;
        let isTriggeredByUser = false;
        formatEl.addEventListener(
          'model-value-changed',
          (/** @param {CustomEvent} event */ event) => {
            counter += 1;
            isTriggeredByUser = /** @type {CustomEvent} */ (event).detail.isTriggeredByUser;
          },
        );

        mimicUserInput(formatEl, generateValueBasedOnType());
        expect(counter).to.equal(1);
        expect(isTriggeredByUser).to.be.true;

        // Counter offset +1 for Date because parseDate created a new Date object
        // when the user changes the value.
        // This will result in a model-value-changed trigger even if the user value was the same
        // TODO: a proper solution would be to add `hasChanged` to input-date, like isSameDate()
        // from calendar utils
        const counterOffset = cfg.modelValueType === Date ? 1 : 0;

        mimicUserInput(formatEl, generateValueBasedOnType());
        expect(counter).to.equal(1 + counterOffset);

        mimicUserInput(formatEl, generateValueBasedOnType({ toggleValue: true }));
        expect(counter).to.equal(2 + counterOffset);
      });

      it('synchronizes _inputNode.value as a fallback mechanism on init (when no modelValue provided)', async () => {
        // Note that in lion-field, the attribute would be put on <lion-field>, not on <input>
        const formatElem = /** @type {FormatClass} */ (
          await fixture(html`
          <${tag}
            value="string"
            .formatter=${/** @param {string} value */ value => `foo: ${value}`}
            .parser=${/** @param {string} value */ value => value.replace('foo: ', '')}
            .serializer=${/** @param {string} value */ value => `[foo] ${value}`}
            .deserializer=${/** @param {string} value */ value => value.replace('[foo] ', '')}
          >
            <input slot="input" value="string" />
          </${tag}>
        `)
        );
        // Now check if the format/parse/serialize loop has been triggered
        await formatElem.updateComplete;
        expect(formatElem.formattedValue).to.equal('foo: string');

        expect(formatElem._inputNode.value).to.equal('foo: string');

        expect(formatElem.serializedValue).to.equal('[foo] string');
        expect(formatElem.modelValue).to.equal('string');
      });

      describe('Unparseable values', () => {
        it('converts to Unparseable when wrong value inputted by user', async () => {
          const el = /** @type {FormatClass} */ (
            await fixture(html`
            <${tag} .parser=${
              /** @param {string} viewValue */ viewValue => Number(viewValue) || undefined
            }
              >
              <input slot="input">
            </${tag}>
          `)
          );
          mimicUserInput(el, 'test');
          expect(el.modelValue).to.be.an.instanceof(Unparseable);
        });

        it('preserves the viewValue when unparseable', async () => {
          const el = /** @type {FormatClass} */ (
            await fixture(html`
            <${tag}
              .parser=${
                /** @param {string} viewValue */ viewValue => Number(viewValue) || undefined
              }
            >
              <input slot="input">
            </${tag}>
          `)
          );
          mimicUserInput(el, 'test');
          expect(el.formattedValue).to.equal('test');
          expect(el.value).to.equal('test');
        });

        it('displays the viewValue when modelValue is of type Unparseable', async () => {
          const el = /** @type {FormatClass} */ (
            await fixture(html`
            <${tag}
              .parser=${
                /** @param {string} viewValue */ viewValue => Number(viewValue) || undefined
              }
            >
              <input slot="input">
            </${tag}>
          `)
          );
          el.modelValue = new Unparseable('foo');
          expect(el.value).to.equal('foo');
        });

        it('empty strings are not Unparseable', async () => {
          const el = /** @type {FormatClass} */ (
            await fixture(html`
            <${tag}>
              <input slot="input" value="string">
            </${tag}>
          `)
          );
          // This could happen when the user erases the input value
          mimicUserInput(el, '');
          // For backwards compatibility, we keep the modelValue an empty string here.
          // Undefined would be more appropriate 'conceptually', however
          expect(el.modelValue).to.equal('');
        });
      });
    });

    describe('View value', () => {
      it('has an input node (like <input>/<textarea>) which holds the formatted (view) value', async () => {
        const { _inputNode } = getFormControlMembers(fooFormat);
        fooFormat.modelValue = 'string';
        expect(fooFormat.formattedValue).to.equal('foo: string');
        expect(fooFormat.value).to.equal('foo: string');
        expect(_inputNode.value).to.equal('foo: string');
      });

      it('works if there is no underlying _inputNode', async () => {
        const tagNoInputString = defineCE(class extends FormatMixin(LitElement) {});
        const tagNoInput = unsafeStatic(tagNoInputString);
        expect(async () => {
          /** @type {FormatClass} */ (await fixture(html`<${tagNoInput}></${tagNoInput}>`));
        }).to.not.throw();
      });

      describe('Presenting value to end user', () => {
        it('reflects back formatted value to user on leave', async () => {
          const formatEl = /** @type {FormatClass} */ (
            await fixture(html`
            <${tag} .formatter="${/** @param {string} value */ value => `foo: ${value}`}">
              <input slot="input" />
            </${tag}>
          `)
          );
          const { _inputNode } = getFormControlMembers(formatEl);

          const generatedViewValue = generateValueBasedOnType({ viewValue: true });
          const generatedModelValue = generateValueBasedOnType();
          mimicUserInput(formatEl, generatedViewValue);
          expect(_inputNode.value).to.not.equal(`foo: ${generatedModelValue}`);

          // user leaves field
          _inputNode.dispatchEvent(new CustomEvent(formatEl.formatOn, { bubbles: true }));
          await aTimeout(0);
          expect(_inputNode.value).to.equal(`foo: ${generatedModelValue}`);
        });

        it('reflects back .formattedValue immediately when .modelValue changed imperatively', async () => {
          const el = /** @type {FormatClass} */ (
            await fixture(html`
            <${tag} .formatter="${/** @param {string} value */ value => `foo: ${value}`}">
              <input slot="input" />
            </${tag}>
          `)
          );

          const { _inputNode } = getFormControlMembers(el);

          // The FormatMixin can be used in conjunction with the ValidateMixin, in which case
          // it can hold errorState (affecting the formatting)
          el.hasFeedbackFor = ['error'];

          // users types value 'test'
          mimicUserInput(el, 'test');
          expect(_inputNode.value).to.not.equal('foo: test');

          // Now see the difference for an imperative change
          el.modelValue = 'test2';
          expect(_inputNode.value).to.equal('foo: test2');
        });
      });
    });

    describe('Parser / formatter / serializer / preprocessor', () => {
      it('calls the parser|formatter|serializer|preprocessor provided by user', async () => {
        const formatterSpy = sinon.spy(value => `foo: ${value}`);
        const parserSpy = sinon.spy(value => value.replace('foo: ', ''));
        const serializerSpy = sinon.spy(value => `[foo] ${value}`);
        const preprocessorSpy = sinon.spy(value => value.replace('bar', ''));
        const el = /** @type {FormatClass} */ (
          await fixture(html`
          <${tag}
            .formatter=${formatterSpy}
            .parser=${parserSpy}
            .serializer=${serializerSpy}
            .preprocessor=${preprocessorSpy}
            .modelValue=${'test'}
          >
            <input slot="input">
          </${tag}>
        `)
        );
        expect(formatterSpy.called).to.be.true;
        expect(serializerSpy.called).to.be.true;

        el.formattedValue = 'raw';
        expect(parserSpy.called).to.be.true;
        el.dispatchEvent(new CustomEvent('user-input-changed'));
        expect(preprocessorSpy.called).to.be.true;
      });

      describe('Value conversions', () => {
        it('converts modelValue => formattedValue (via this.formatter)', async () => {
          fooFormat.modelValue = 'string';
          expect(fooFormat.formattedValue).to.equal('foo: string');
          expect(fooFormat.serializedValue).to.equal('[foo] string');
        });

        it('converts modelValue => serializedValue (via this.serializer)', async () => {
          fooFormat.modelValue = 'string';
          expect(fooFormat.serializedValue).to.equal('[foo] string');
        });

        it('converts formattedValue => modelValue (via this.parser)', async () => {
          fooFormat.formattedValue = 'foo: string';
          expect(fooFormat.modelValue).to.equal('string');
        });

        it('converts serializedValue => modelValue (via this.deserializer)', async () => {
          fooFormat.serializedValue = '[foo] string';
          expect(fooFormat.modelValue).to.equal('string');
        });
      });

      describe('Formatter', () => {
        it('only calls the formatter for valid values on `user-input-changed` ', async () => {
          const formatterSpy = sinon.spy(value => `foo: ${value}`);

          const generatedModelValue = generateValueBasedOnType();
          /** @type {?} */
          const generatedViewValue = generateValueBasedOnType({ viewValue: true });
          /** @type {?} */
          const generatedViewValueAlt = generateValueBasedOnType({
            viewValue: true,
            toggleValue: true,
          });

          const el = /** @type {FormatClass} */ (
            await fixture(html`
            <${tag} .formatter=${formatterSpy}>
              <input slot="input" .value="${generatedViewValue}">
            </${tag}>
          `)
          );
          expect(formatterSpy.callCount).to.equal(1);

          el.hasFeedbackFor.push('error');
          // Ensure hasError is always true by putting a validator on it that always returns false.
          // Setting hasError = true is not enough if the element has errorValidators (uses ValidateMixin)
          // that set hasError back to false when the user input is mimicked.

          const AlwaysInvalid = class extends Validator {
            static get validatorName() {
              return 'AlwaysInvalid';
            }

            execute() {
              return true;
            }
          };

          el.validators = [new AlwaysInvalid()];
          mimicUserInput(el, generatedViewValueAlt);

          expect(formatterSpy.callCount).to.equal(1);
          // Due to hasError, the formatter should not have ran.
          expect(el.formattedValue).to.equal(generatedViewValueAlt);

          el.hasFeedbackFor.filter(/** @param {string} type */ type => type !== 'error');
          el.validators = [];
          mimicUserInput(el, generatedViewValue);
          expect(formatterSpy.callCount).to.equal(2);

          expect(el.formattedValue).to.equal(`foo: ${generatedModelValue}`);
        });

        it('has formatOptions available in formatter', async () => {
          const formatterSpy = sinon.spy(value => `foo: ${value}`);
          const generatedViewValue = /** @type {string} */ (
            generateValueBasedOnType({
              viewValue: true,
            })
          );
          await fixture(html`
            <${tag} value="${generatedViewValue}" .formatter="${formatterSpy}"
              .formatOptions="${{ locale: 'en-GB', decimalSeparator: '-' }}">
              <input slot="input" .value="${generatedViewValue}">
            </${tag}>
          `);

          /** @type {{locale: string, decimalSeparator: string}[]} */
          const spyItem = formatterSpy.args[0];
          const spyArg = spyItem[1];
          expect(spyArg.locale).to.equal('en-GB');
          expect(spyArg.decimalSeparator).to.equal('-');
        });

        describe('On paste', () => {
          class ReflectOnPaste extends FormatClass {
            _reflectBackOn() {
              return super._reflectBackOn() || this._isPasting;
            }
          }
          const reflectingTagString = defineCE(ReflectOnPaste);
          const reflectingTag = unsafeStatic(reflectingTagString);

          /**
           * @param {FormatClass} el
           */
          function mimicPaste(el, val = 'lorem') {
            const { _inputNode } = getFormControlMembers(el);
            _inputNode.value = val;
            _inputNode.dispatchEvent(new ClipboardEvent('paste', { bubbles: true }));
            _inputNode.dispatchEvent(new Event('input', { bubbles: true }));
          }

          it('sets formatOptions.mode to "pasted" (and restores to "auto")', async () => {
            const el = /** @type {FormatClass} */ (
              await fixture(html`
            <${reflectingTag}><input slot="input"></${reflectingTag}>
          `)
            );
            const formatterSpy = sinon.spy(el, 'formatter');
            mimicPaste(el);
            expect(formatterSpy).to.be.called;
            expect(/** @type {{mode: string}} */ (formatterSpy.lastCall.args[1]).mode).to.equal(
              'pasted',
            );
            // give microtask of _isPasting chance to reset
            await aTimeout(0);
            el.modelValue = 'foo';
            expect(/** @type {{mode: string}} */ (formatterSpy.lastCall.args[1]).mode).to.equal(
              'auto',
            );
          });

          it('sets protected value "_isPasting" for Subclassers', async () => {
            const el = /** @type {FormatClass} */ (
              await fixture(html`
            <${reflectingTag}><input slot="input"></${reflectingTag}>
          `)
            );
            const formatterSpy = sinon.spy(el, 'formatter');
            mimicPaste(el);
            expect(formatterSpy).to.have.been.called;
            // @ts-ignore [allow-protected] in test
            expect(el._isPasting).to.be.true;
            await aTimeout(0);
            // @ts-ignore [allow-protected] in test
            expect(el._isPasting).to.be.false;
          });

          it('calls formatter and "_reflectBackOn()"', async () => {
            const el = /** @type {FormatClass} */ (
              await fixture(html`
            <${tag}><input slot="input"></${tag}>
          `)
            );
            // @ts-ignore [allow-protected] in test
            const reflectBackSpy = sinon.spy(el, '_reflectBackOn');
            mimicPaste(el);
            expect(reflectBackSpy).to.have.been.called;
          });

          it(`updates viewValue when "_reflectBackOn()" configured to reflect`, async () => {
            const el = /** @type {FormatClass} */ (
              await fixture(html`
            <${reflectingTag}><input slot="input"></${reflectingTag}>
          `)
            );
            // @ts-ignore [allow-protected] in test
            const reflectBackSpy = sinon.spy(el, '_reflectBackOn');
            mimicPaste(el);
            expect(reflectBackSpy).to.have.been.called;
          });
        });

        describe('On user input', () => {
          it('adjusts formatOptions.mode to "user-edit" for parser when user changes value', async () => {
            const el = /** @type {FormatClass} */ (
              await fixture(html`<${tag}><input slot="input"></${tag}>`)
            );

            const parserSpy = sinon.spy(el, 'parser');

            // Here we get auto as we start from '' (so there was no value to edit)
            mimicUserInput(el, 'some val');
            expect(/** @type {{mode: string}} */ (parserSpy.lastCall.args[1]).mode).to.equal(
              'auto',
            );
            await el.updateComplete;

            mimicUserInput(el, 'some other val');
            expect(/** @type {{mode: string}} */ (parserSpy.lastCall.args[1]).mode).to.equal(
              'user-edit',
            );
            await el.updateComplete;
          });
        });
      });

      describe('Parser', () => {
        it('only calls the parser for defined values', async () => {
          /** @type {?} */
          const generatedValue = generateValueBasedOnType();
          const parserSpy = sinon.spy();
          const el = /** @type {FormatClass} */ (
            await fixture(html`
          <${tag} .parser="${parserSpy}">
            <input slot="input" .value="${generatedValue}">
          </${tag}>
        `)
          );

          expect(parserSpy.callCount).to.equal(1);
          // This could happen for instance in a reset
          el.modelValue = undefined;
          expect(parserSpy.callCount).to.equal(1);
          // This could happen when the user erases the input value
          mimicUserInput(el, '');
          expect(parserSpy.callCount).to.equal(1);
        });
      });

      describe('Preprocessor', () => {
        it('changes `.value` on keyup, before passing on to parser', async () => {
          const val = generateValueBasedOnType({ viewValue: true }) || 'init-value';
          if (typeof val !== 'string') {
            return;
          }

          const toBeCorrectedVal = `${val}$`;
          const preprocessorSpy = sinon.spy(v => v.replace(/\$$/g, ''));

          const el = /** @type {FormatClass} */ (
            await fixture(html`
          <${tag} .preprocessor=${preprocessorSpy}>
            <input slot="input">
          </${tag}>
        `)
          );

          const { _inputNode } = getFormControlMembers(el);

          expect(preprocessorSpy.callCount).to.equal(1);

          const parserSpy = sinon.spy(el, 'parser');
          mimicUserInput(el, toBeCorrectedVal);

          expect(preprocessorSpy.callCount).to.equal(2);
          expect(parserSpy.lastCall.args[0]).to.equal(val);
          expect(_inputNode.value).to.equal(val);
        });

        it('does only calculate derived values as consequence of user input when preprocessed value is different from previous view value', async () => {
          const val = generateValueBasedOnType({ viewValue: true }) || 'init-value';
          if (typeof val !== 'string') return;

          const preprocessorSpy = sinon.spy(v => v.replace(/\$$/g, ''));
          const el = /** @type {FormatClass} */ (
            await fixture(html`
          <${tag} .preprocessor=${preprocessorSpy}>
            <input slot="input" .value="${val}">
          </${tag}>
        `)
          );

          // TODO: find out why we need to skip this for lion-input-stepper
          if (isLionInputStepper(el)) return;

          /**
           * The _calculateValues method is called inside _onUserInputChanged w/o providing args
           * @param {sinon.SinonSpyCall} call
           * @returns {boolean}
           */
          const isCalculateCallAfterUserInput = call => call.args[0]?.length === 0;

          const didRecalculateAfterUserInput = (/** @type {sinon.SinonSpy<any[], any>} */ spy) =>
            spy.callCount > 1 && !spy.getCalls().find(isCalculateCallAfterUserInput);

          // @ts-expect-error [allow-protected] in test
          const calcValuesSpy = sinon.spy(el, '_calculateValues');
          // this value gets preprocessed to 'val'
          mimicUserInput(el, `${val}$`);
          expect(didRecalculateAfterUserInput(calcValuesSpy)).to.be.false;

          // this value gets preprocessed to 'value' (and thus differs from previous)
          mimicUserInput(el, `${val}ue$`);
          expect(didRecalculateAfterUserInput(calcValuesSpy)).to.be.true;
        });

        it('does not preprocess during composition', async () => {
          const el = /** @type {FormatClass} */ (
            await fixture(html`
            <${tag} .preprocessor=${(/** @type {string} */ v) => v.replace(/\$$/g, '')}>
              <input slot="input">
            </${tag}>
          `)
          );

          const { _inputNode } = getFormControlMembers(el);

          const preprocessorSpy = sinon.spy(el, 'preprocessor');
          _inputNode.dispatchEvent(new Event('compositionstart', { bubbles: true }));
          mimicUserInput(el, '`');
          expect(preprocessorSpy.callCount).to.equal(0);
          // "à" would be sent by the browser after pressing "option + `", followed by "a"
          mimicUserInput(el, 'à');
          _inputNode.dispatchEvent(new Event('compositionend', { bubbles: true }));
          expect(preprocessorSpy.callCount).to.equal(1);
        });

        describe('Live Formatters', () => {
          it('receives meta object with { prevViewValue: string; currentCaretIndex: number; }', async () => {
            const spy = sinon.spy();

            const valInitial = generateValueBasedOnType();
            const el = /** @type {FormatClass} */ (
              await fixture(
                html`<${tag} .modelValue="${valInitial}"  .preprocessor=${spy}><input slot="input"></${tag}>`,
              )
            );
            const viewValInitial = el.value;
            const valToggled = generateValueBasedOnType({ toggleValue: true });

            mimicUserInput(el, valToggled, { caretIndex: 1 });
            expect(spy.args[0][0]).to.equal(el.value);
            const formatOptions = spy.args[0][1];
            expect(formatOptions.prevViewValue).to.equal(viewValInitial);
            expect(formatOptions.currentCaretIndex).to.equal(1);
          });

          it('updates return viewValue and caretIndex', async () => {
            /**
             * @param {string} viewValue
             * @param {{ prevViewValue: string; currentCaretIndex: number; }} meta
             */
            function myPreprocessor(viewValue, { currentCaretIndex }) {
              return { viewValue: `${viewValue}q`, caretIndex: currentCaretIndex + 1 };
            }
            const el = /** @type {FormatClass} */ (
              await fixture(
                html`<${tag} .modelValue="${'xyz'}" .preprocessor=${myPreprocessor}><input slot="input"></${tag}>`,
              )
            );
            mimicUserInput(el, 'wxyz', { caretIndex: 1 });
            expect(el._inputNode.value).to.equal('wxyzq');
            expect(el._inputNode.selectionStart).to.equal(2);
          });

          it('does not update when undefined is returned', async () => {
            const el = /** @type {FormatClass} */ (
              await fixture(
                html`<${tag} .modelValue="${'xyz'}" live-format .liveFormatter=${() =>
                  undefined}><input slot="input"></${tag}>`,
              )
            );
            mimicUserInput(el, 'wxyz', { caretIndex: 1 });
            expect(el._inputNode.value).to.equal('wxyz');
            // Make sure we do not put our already existing value back, because caret index would be lost
            expect(el._inputNode.selectionStart).to.equal(1);
          });
        });
      });
    });
  });
}
