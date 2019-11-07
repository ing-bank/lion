import { expect, fixture, html, aTimeout, defineCE, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';

import { LitElement } from '@lion/core';
import { Unparseable, Validator } from '@lion/validate';
import { FormatMixin } from '../src/FormatMixin.js';

function mimicUserInput(formControl, newViewValue) {
  formControl.value = newViewValue; // eslint-disable-line no-param-reassign
  formControl.inputElement.dispatchEvent(new CustomEvent('input', { bubbles: true }));
}

export function runFormatMixinSuite(customConfig) {
  // TODO: Maybe remove suffix
  const cfg = {
    tagString: null,
    modelValueType: String,
    suffix: '',
    ...customConfig,
  };

  /**
   * Mocks a value for you based on the data type
   * Optionally toggles you a different value
   * for needing to mimic a value-change.
   *
   * TODO: The FormatMixin can know about platform types like
   * Date, but not about modelValue of input-iban etc.
   * Make this concept expandable by allowing 'non standard'
   * modelValues to hook into this.
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
        return !options.toggleValue ? new Date('5-5-2005') : new Date('10-10-2010');
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

  describe(`FormatMixin ${cfg.suffix ? `(${cfg.suffix})` : ''}`, async () => {
    let elem;
    let nonFormat;
    let fooFormat;

    before(async () => {
      if (!cfg.tagString) {
        cfg.tagString = defineCE(
          class extends FormatMixin(LitElement) {
            render() {
              return html`
                <slot name="input"></slot>
              `;
            }

            set value(newValue) {
              this.inputElement.value = newValue;
            }

            get value() {
              return this.inputElement.value;
            }

            get inputElement() {
              return this.querySelector('input');
            }
          },
        );
      }

      elem = unsafeStatic(cfg.tagString);
      nonFormat = await fixture(html`<${elem}
        .formatter="${v => v}"
        .parser="${v => v}"
        .serializer="${v => v}"
        .deserializer="${v => v}"
      ><input slot="input">
      </${elem}>`);
      fooFormat = await fixture(html`
      <${elem}
        .formatter="${value => `foo: ${value}`}"
        .parser="${value => value.replace('foo: ', '')}"
        .serializer="${value => `[foo] ${value}`}"
        .deserializer="${value => value.replace('[foo] ', '')}"
      ><input slot="input">
      </${elem}>`);
    });

    it('fires `model-value-changed` for every change on the input', async () => {
      const formatEl = await fixture(html`<${elem}><input slot="input"></${elem}>`);

      let counter = 0;
      formatEl.addEventListener('model-value-changed', () => {
        counter += 1;
      });

      mimicUserInput(formatEl, generateValueBasedOnType());
      expect(counter).to.equal(1);

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

    it('fires `model-value-changed` for every modelValue change', async () => {
      const el = await fixture(html`<${elem}><input slot="input"></${elem}>`);
      let counter = 0;
      el.addEventListener('model-value-changed', () => {
        counter += 1;
      });

      el.modelValue = 'one';
      expect(counter).to.equal(1);

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
      expect(fooFormat.inputElement.value).to.equal('foo: string');
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

    it('synchronizes inputElement.value as a fallback mechanism', async () => {
      // Note that in lion-field, the attribute would be put on <lion-field>, not on <input>
      const formatElem = await fixture(html`
        <${elem}
          value="string",
          .formatter=${value => `foo: ${value}`}
          .parser=${value => value.replace('foo: ', '')}
          .serializer=${value => `[foo] ${value}`}
          .deserializer=${value => value.replace('[foo] ', '')}
          ><input slot="input" value="string"/></${elem}>`);
      // Now check if the format/parse/serialize loop has been triggered
      await formatElem.updateComplete;
      expect(formatElem.formattedValue).to.equal('foo: string');

      expect(formatElem.inputElement.value).to.equal('foo: string');

      expect(formatElem.serializedValue).to.equal('[foo] string');
      expect(formatElem.modelValue).to.equal('string');
    });

    it('reflects back formatted value to user on leave', async () => {
      const formatEl = await fixture(html`
        <${elem} .formatter="${value => `foo: ${value}`}">
          <input slot="input" />
        </${elem}>
      `);

      const generatedViewValue = generateValueBasedOnType({ viewValue: true });
      const generatedModelValue = generateValueBasedOnType();
      mimicUserInput(formatEl, generatedViewValue);
      expect(formatEl.inputElement.value).to.not.equal(`foo: ${generatedModelValue}`);

      // user leaves field
      formatEl.inputElement.dispatchEvent(new CustomEvent(formatEl.formatOn, { bubbles: true }));
      await aTimeout();
      expect(formatEl.inputElement.value).to.equal(`foo: ${generatedModelValue}`);
    });

    it('reflects back .formattedValue immediately when .modelValue changed imperatively', async () => {
      const el = await fixture(html`
        <${elem} .formatter="${value => `foo: ${value}`}">
          <input slot="input" />
        </${elem}>
      `);
      // The FormatMixin can be used in conjunction with the ValidateMixin, in which case
      // it can hold errorState (affecting the formatting)
      el.errorState = true;

      // users types value 'test'
      mimicUserInput(el, 'test');
      expect(el.inputElement.value).to.not.equal('foo: test');

      // Now see the difference for an imperative change
      el.modelValue = 'test2';
      expect(el.inputElement.value).to.equal('foo: test2');
    });

    it('works if there is no underlying inputElement', async () => {
      const tagNoInputString = defineCE(class extends FormatMixin(LitElement) {});
      const tagNoInput = unsafeStatic(tagNoInputString);
      expect(async () => {
        await fixture(html`<${tagNoInput}></${tagNoInput}>`);
      }).to.not.throw();
    });

    describe('parsers/formatters/serializers', () => {
      it('should call the parser|formatter|serializer provided by user', async () => {
        const formatterSpy = sinon.spy(value => `foo: ${value}`);
        const parserSpy = sinon.spy(value => value.replace('foo: ', ''));
        const serializerSpy = sinon.spy(value => `[foo] ${value}`);
        const el = await fixture(html`
          <${elem}
            .formatter=${formatterSpy}
            .parser=${parserSpy}
            .serializer=${serializerSpy}
            .modelValue=${'test'}
          >
            <input slot="input">
          </${elem}>
        `);
        expect(formatterSpy.called).to.equal(true);
        expect(serializerSpy.called).to.equal(true);

        el.formattedValue = 'raw';
        expect(parserSpy.called).to.equal(true);
      });

      it('should have formatOptions available in formatter', async () => {
        const formatterSpy = sinon.spy(value => `foo: ${value}`);
        const generatedViewValue = generateValueBasedOnType({ viewValue: true });
        await fixture(html`
          <${elem}
            value="${generatedViewValue}"
            .formatter="${formatterSpy}"
            .formatOptions="${{ locale: 'en-GB', decimalSeparator: '-' }}">
            <input slot="input" value="${generatedViewValue}">
          </${elem}>
        `);
        expect(formatterSpy.args[0][1].locale).to.equal('en-GB');
        expect(formatterSpy.args[0][1].decimalSeparator).to.equal('-');
      });

      it('will only call the parser for defined values', async () => {
        const generatedValue = generateValueBasedOnType();
        const parserSpy = sinon.spy();
        const el = await fixture(html`
          <${elem} .parser="${parserSpy}">
            <input slot="input" value="${generatedValue}">
          </${elem}>
        `);

        expect(parserSpy.callCount).to.equal(1);
        // This could happen for instance in a reset
        el.modelValue = undefined;
        expect(parserSpy.callCount).to.equal(1);
        // This could happen when the user erases the input value
        mimicUserInput(el, '');
        expect(parserSpy.callCount).to.equal(1);
      });

      it('will not return Unparseable when empty strings are inputted', async () => {
        const el = await fixture(html`
          <${elem}>
            <input slot="input" value="string">
          </${elem}>
        `);
        // This could happen when the user erases the input value
        mimicUserInput(el, '');
        // For backwards compatibility, we keep the modelValue an empty string here.
        // Undefined would be more appropriate 'conceptually', however
        expect(el.modelValue).to.equal('');
      });

      it('will only call the formatter for valid values on `user-input-changed` ', async () => {
        const formatterSpy = sinon.spy(value => `foo: ${value}`);

        const generatedModelValue = generateValueBasedOnType();
        const generatedViewValue = generateValueBasedOnType({ viewValue: true });
        const generatedViewValueAlt = generateValueBasedOnType({
          viewValue: true,
          toggleValue: true,
        });

        const el = await fixture(html`
          <${elem} .formatter=${formatterSpy}>
            <input slot="input" value="${generatedViewValue}">
          </${elem}>
        `);
        expect(formatterSpy.callCount).to.equal(1);

        el.hasError = true;
        // Ensure hasError is always true by putting a validator on it that always returns false.
        // Setting hasError = true is not enough if the element has errorValidators (uses ValidateMixin)
        // that set hasError back to false when the user input is mimicked.

        const AlwaysInvalid = class extends Validator {
          constructor(...args) {
            super(...args);
            this.name = 'AlwaysInvalid';
          }
          execute() {
            return true;
          }
        }
        el.validators = [new AlwaysInvalid()];
        mimicUserInput(el, generatedViewValueAlt);

        expect(formatterSpy.callCount).to.equal(1);
        // Due to hasError, the formatter should not have ran.
        expect(el.formattedValue).to.equal(generatedViewValueAlt);

        el.hasError = false;
        el.validators = [];
        mimicUserInput(el, generatedViewValue);
        expect(formatterSpy.callCount).to.equal(2);

        expect(el.formattedValue).to.equal(`foo: ${generatedModelValue}`);
      });
    });

    describe('Unparseable values', () => {
      it('should convert to Unparseable when wrong value inputted by user', async () => {
        const el = await fixture(html`
          <${elem}
            .parser=${viewValue => Number(viewValue) || undefined}
          >
            <input slot="input">
          </${elem}>
        `);
        mimicUserInput(el, 'test');
        expect(el.modelValue).to.be.an.instanceof(Unparseable);
      });

      it('should preserve the viewValue when not parseable', async () => {
        const el = await fixture(html`
          <${elem}
            .parser=${viewValue => Number(viewValue) || undefined}
          >
            <input slot="input">
          </${elem}>
        `);
        mimicUserInput(el, 'test');
        expect(el.formattedValue).to.equal('test');
        expect(el.value).to.equal('test');
      });

      it('should display the viewValue when modelValue is of type Unparseable', async () => {
        const el = await fixture(html`
          <${elem}
            .parser=${viewValue => Number(viewValue) || undefined}
          >
            <input slot="input">
          </${elem}>
        `);
        el.modelValue = new Unparseable('foo');
        expect(el.value).to.equal('foo');
      });
    });
  });
}
