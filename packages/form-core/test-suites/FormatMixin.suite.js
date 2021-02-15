import { LitElement } from '@lion/core';
import { parseDate } from '@lion/localize';
import { aTimeout, defineCE, expect, fixture, html, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';
import { FormatMixin } from '../src/FormatMixin.js';
import { Unparseable, Validator } from '../index.js';

/**
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
 * @param {FormatClass} formControl
 * @param {?} newViewValue
 */
function mimicUserInput(formControl, newViewValue) {
  formControl.value = newViewValue; // eslint-disable-line no-param-reassign
  formControl._inputNode.dispatchEvent(new CustomEvent('input', { bubbles: true }));
}

/**
 * @param {{tagString?: string, modelValueType?: modelValueType}} [customConfig]
 */
export function runFormatMixinSuite(customConfig) {
  const cfg = {
    tagString: null,
    childTagString: null,
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
    /** @type {{d: any}} */
    let elem;
    /** @type {FormatClass} */
    let nonFormat;
    /** @type {FormatClass} */
    let fooFormat;

    before(async () => {
      if (!cfg.tagString) {
        cfg.tagString = defineCE(FormatClass);
      }
      elem = unsafeStatic(cfg.tagString);

      nonFormat = await fixture(html`
        <${elem}
          .formatter="${/** @param {?} v */ v => v}"
          .parser="${/** @param {string} v */ v => v}"
          .serializer="${/** @param {?} v */ v => v}"
          .deserializer="${/** @param {string} v */ v => v}"
        >
          <input slot="input">
        </${elem}>
      `);

      fooFormat = await fixture(html`
        <${elem}
          .formatter="${/** @param {string} value */ value => `foo: ${value}`}"
          .parser="${/** @param {string} value */ value => value.replace('foo: ', '')}"
          .serializer="${/** @param {string} value */ value => `[foo] ${value}`}"
          .deserializer="${/** @param {string} value */ value => value.replace('[foo] ', '')}"
        >
          <input slot="input">
        </${elem}>
      `);
    });

    it('fires `model-value-changed` for every input triggered by user', async () => {
      const formatEl = /** @type {FormatClass} */ (await fixture(
        html`<${elem}><input slot="input"></${elem}>`,
      ));

      let counter = 0;
      let isTriggeredByUser = false;
      formatEl.addEventListener('model-value-changed', (
        /** @param {CustomEvent} event */ event,
      ) => {
        counter += 1;
        isTriggeredByUser = /** @type {CustomEvent} */ (event).detail.isTriggeredByUser;
      });

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

    it('fires `model-value-changed` for every programmatic modelValue change', async () => {
      const el = /** @type {FormatClass} */ (await fixture(
        html`<${elem}><input slot="input"></${elem}>`,
      ));
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

    it('has an input node (like <input>/<textarea>) which holds the formatted (view) value', async () => {
      fooFormat.modelValue = 'string';
      expect(fooFormat.formattedValue).to.equal('foo: string');
      expect(fooFormat.value).to.equal('foo: string');
      expect(fooFormat._inputNode.value).to.equal('foo: string');
    });

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

    it('synchronizes _inputNode.value as a fallback mechanism', async () => {
      // Note that in lion-field, the attribute would be put on <lion-field>, not on <input>
      const formatElem = /** @type {FormatClass} */ (await fixture(html`
        <${elem}
          value="string"
          .formatter=${/** @param {string} value */ value => `foo: ${value}`}
          .parser=${/** @param {string} value */ value => value.replace('foo: ', '')}
          .serializer=${/** @param {string} value */ value => `[foo] ${value}`}
          .deserializer=${/** @param {string} value */ value => value.replace('[foo] ', '')}
        >
          <input slot="input" value="string" />
        </${elem}>
      `));
      // Now check if the format/parse/serialize loop has been triggered
      await formatElem.updateComplete;
      expect(formatElem.formattedValue).to.equal('foo: string');

      expect(formatElem._inputNode.value).to.equal('foo: string');

      expect(formatElem.serializedValue).to.equal('[foo] string');
      expect(formatElem.modelValue).to.equal('string');
    });

    it('reflects back formatted value to user on leave', async () => {
      const formatEl = /** @type {FormatClass} */ (await fixture(html`
        <${elem} .formatter="${/** @param {string} value */ value => `foo: ${value}`}">
          <input slot="input" />
        </${elem}>
      `));

      const generatedViewValue = generateValueBasedOnType({ viewValue: true });
      const generatedModelValue = generateValueBasedOnType();
      mimicUserInput(formatEl, generatedViewValue);
      expect(formatEl._inputNode.value).to.not.equal(`foo: ${generatedModelValue}`);

      // user leaves field
      formatEl._inputNode.dispatchEvent(new CustomEvent(formatEl.formatOn, { bubbles: true }));
      await aTimeout(0);
      expect(formatEl._inputNode.value).to.equal(`foo: ${generatedModelValue}`);
    });

    it('reflects back .formattedValue immediately when .modelValue changed imperatively', async () => {
      const el = /** @type {FormatClass} */ (await fixture(html`
        <${elem} .formatter="${/** @param {string} value */ value => `foo: ${value}`}">
          <input slot="input" />
        </${elem}>
      `));
      // The FormatMixin can be used in conjunction with the ValidateMixin, in which case
      // it can hold errorState (affecting the formatting)
      el.hasFeedbackFor = ['error'];

      // users types value 'test'
      mimicUserInput(el, 'test');
      expect(el._inputNode.value).to.not.equal('foo: test');

      // Now see the difference for an imperative change
      el.modelValue = 'test2';
      expect(el._inputNode.value).to.equal('foo: test2');
    });

    it('works if there is no underlying _inputNode', async () => {
      const tagNoInputString = defineCE(class extends FormatMixin(LitElement) {});
      const tagNoInput = unsafeStatic(tagNoInputString);
      expect(async () => {
        /** @type {FormatClass} */ (await fixture(html`<${tagNoInput}></${tagNoInput}>`));
      }).to.not.throw();
    });

    describe('parsers/formatters/serializers/preprocessors', () => {
      it('should call the parser|formatter|serializer|preprocessor provided by user', async () => {
        const formatterSpy = sinon.spy(value => `foo: ${value}`);
        const parserSpy = sinon.spy(value => value.replace('foo: ', ''));
        const serializerSpy = sinon.spy(value => `[foo] ${value}`);
        const preprocessorSpy = sinon.spy(value => value.replace('bar', ''));
        const el = /** @type {FormatClass} */ (await fixture(html`
          <${elem}
            .formatter=${formatterSpy}
            .parser=${parserSpy}
            .serializer=${serializerSpy}
            .preprocessor=${preprocessorSpy}
            .modelValue=${'test'}
          >
            <input slot="input">
          </${elem}>
        `));
        expect(formatterSpy.called).to.equal(true);
        expect(serializerSpy.called).to.equal(true);

        el.formattedValue = 'raw';
        expect(parserSpy.called).to.equal(true);
        el.dispatchEvent(new CustomEvent('user-input-changed'));
        expect(preprocessorSpy.called).to.equal(true);
      });

      it('should have formatOptions available in formatter', async () => {
        const formatterSpy = sinon.spy(value => `foo: ${value}`);
        const generatedViewValue = /** @type {string} */ (generateValueBasedOnType({
          viewValue: true,
        }));
        await fixture(html`
          <${elem} value="${generatedViewValue}" .formatter="${formatterSpy}"
            .formatOptions="${{ locale: 'en-GB', decimalSeparator: '-' }}">
            <input slot="input" value="${generatedViewValue}">
          </${elem}>
        `);

        /** @type {{locale: string, decimalSeparator: string}[]} */
        const spyItem = formatterSpy.args[0];
        const spyArg = spyItem[1];
        expect(spyArg.locale).to.equal('en-GB');
        expect(spyArg.decimalSeparator).to.equal('-');
      });

      it('will only call the parser for defined values', async () => {
        /** @type {?} */
        const generatedValue = generateValueBasedOnType();
        const parserSpy = sinon.spy();
        const el = /** @type {FormatClass} */ (await fixture(html`
          <${elem} .parser="${parserSpy}">
            <input slot="input" value="${generatedValue}">
          </${elem}>
        `));

        expect(parserSpy.callCount).to.equal(1);
        // This could happen for instance in a reset
        el.modelValue = undefined;
        expect(parserSpy.callCount).to.equal(1);
        // This could happen when the user erases the input value
        mimicUserInput(el, '');
        expect(parserSpy.callCount).to.equal(1);
      });

      it('will not return Unparseable when empty strings are inputted', async () => {
        const el = /** @type {FormatClass} */ (await fixture(html`
          <${elem}>
            <input slot="input" value="string">
          </${elem}>
        `));
        // This could happen when the user erases the input value
        mimicUserInput(el, '');
        // For backwards compatibility, we keep the modelValue an empty string here.
        // Undefined would be more appropriate 'conceptually', however
        expect(el.modelValue).to.equal('');
      });

      it('will only call the formatter for valid values on `user-input-changed` ', async () => {
        const formatterSpy = sinon.spy(value => `foo: ${value}`);

        const generatedModelValue = generateValueBasedOnType();
        /** @type {?} */
        const generatedViewValue = generateValueBasedOnType({ viewValue: true });
        /** @type {?} */
        const generatedViewValueAlt = generateValueBasedOnType({
          viewValue: true,
          toggleValue: true,
        });

        const el = /** @type {FormatClass} */ (await fixture(html`
          <${elem} .formatter=${formatterSpy}>
            <input slot="input" value="${generatedViewValue}">
          </${elem}>
        `));
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

      it('will block the user from inputting invalid values when using a preprocessor', async () => {
        const preprocessorSpy = sinon.spy(value => value.replace(/[o]/g, ''));
        const val = generateValueBasedOnType({ viewValue: true }) || 'init-value';

        // Create a copy and run the same preprocessing on it.
        // So we can check later that the element preprocessor runs
        // and gives the same output.
        let processedVal = val;
        if (typeof val === 'string') {
          processedVal = val.replace(/[o]/g, '');
        }

        const el = /** @type {FormatClass} */ (await fixture(html`
          <${elem} .preprocessor=${preprocessorSpy}>
            <input slot="input" value="${val}">
          </${elem}>
        `));

        if (cfg.tagString?.startsWith('lion-input-date')) {
          // For date and datepicker the stringified modelValue will be quite different
          // from the original view value, due to date parsing etc.
          // So for such inputs we don't test this preprocessor.
          return;
        }
        expect(preprocessorSpy.callCount).to.equal(1);
        expect(`${el.modelValue}`).to.equal(`${processedVal}`);

        el.dispatchEvent(new CustomEvent('user-input-changed'));
        expect(preprocessorSpy.callCount).to.equal(2);
        expect(`${el.modelValue}`).to.equal(`${processedVal}`);
      });
    });

    describe('Unparseable values', () => {
      it('should convert to Unparseable when wrong value inputted by user', async () => {
        const el = /** @type {FormatClass} */ (await fixture(html`
          <${elem} .parser=${
          /** @param {string} viewValue */ viewValue => Number(viewValue) || undefined
        }
            >
            <input slot="input">
          </${elem}>
        `));
        mimicUserInput(el, 'test');
        expect(el.modelValue).to.be.an.instanceof(Unparseable);
      });

      it('should preserve the viewValue when not parseable', async () => {
        const el = /** @type {FormatClass} */ (await fixture(html`
          <${elem}
            .parser=${/** @param {string} viewValue */ viewValue => Number(viewValue) || undefined}
          >
            <input slot="input">
          </${elem}>
        `));
        mimicUserInput(el, 'test');
        expect(el.formattedValue).to.equal('test');
        expect(el.value).to.equal('test');
      });

      it('should display the viewValue when modelValue is of type Unparseable', async () => {
        const el = /** @type {FormatClass} */ (await fixture(html`
          <${elem}
            .parser=${/** @param {string} viewValue */ viewValue => Number(viewValue) || undefined}
          >
            <input slot="input">
          </${elem}>
        `));
        el.modelValue = new Unparseable('foo');
        expect(el.value).to.equal('foo');
      });
    });
  });
}
