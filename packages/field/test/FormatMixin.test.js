import { expect, fixture, html, aTimeout, defineCE, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';

import { LionLitElement } from '@lion/core/src/LionLitElement.js';
import { Unparseable } from '@lion/validate';
import { FormatMixin } from '../src/FormatMixin.js';

function mimicUserInput(formControl, newViewValue) {
  formControl.value = newViewValue; // eslint-disable-line no-param-reassign
  formControl.inputElement.dispatchEvent(new CustomEvent('input', { bubbles: true }));
}

describe('FormatMixin', () => {
  let elem;
  let nonFormat;
  let fooFormat;

  before(async () => {
    const tagString = defineCE(
      class extends FormatMixin(LionLitElement) {
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

    elem = unsafeStatic(tagString);
    nonFormat = await fixture(html`<${elem}><input slot="input"></${elem}>`);
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

    mimicUserInput(formatEl, 'one');
    expect(counter).to.equal(1);

    // no change means no event
    mimicUserInput(formatEl, 'one');
    expect(counter).to.equal(1);

    mimicUserInput(formatEl, 'two');
    expect(counter).to.equal(2);
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
    nonFormat.modelValue = 'string';
    expect(nonFormat.modelValue).to.equal('string', 'modelValue as provided');
    expect(nonFormat.formattedValue).to.equal('string', 'formattedValue synchronized');
    expect(nonFormat.serializedValue).to.equal('string', 'serializedValue synchronized');
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
    await aTimeout();
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
    // users types value 'test'
    mimicUserInput(formatEl, 'test');
    expect(formatEl.inputElement.value).to.not.equal('foo: test');
    // user leaves field
    formatEl.inputElement.dispatchEvent(new CustomEvent(formatEl.formatOn, { bubbles: true }));
    await aTimeout();
    expect(formatEl.inputElement.value).to.equal('foo: test');
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
      await fixture(html`
        <${elem}
          value="string",
          .formatter="${formatterSpy}"
          .formatOptions="${{ locale: 'en-GB', decimalSeparator: '-' }}">
          <input slot="input" value="string">
        </${elem}>`);
      await aTimeout();
      expect(formatterSpy.args[0][1].locale).to.equal('en-GB');
      expect(formatterSpy.args[0][1].decimalSeparator).to.equal('-');
    });

    it('will only call the parser for string values', async () => {
      const parserSpy = sinon.spy();
      const el = await fixture(html`
        <${elem} .parser="${parserSpy}">
          <input slot="input" value="string">
        </${elem}>
      `);
      el.modelValue = 'foo';
      expect(parserSpy.callCount).to.equal(1);
      el.modelValue = undefined;
      expect(parserSpy.callCount).to.equal(1);
    });

    it('will only call the formatter for valid values', async () => {
      const formatterSpy = sinon.spy(value => `foo: ${value}`);
      const el = await fixture(html`
        <${elem} .formatter=${formatterSpy}>
          <input slot="input" value="init-string">
        </${elem}>
      `);
      expect(formatterSpy.callCount).to.equal(1);

      el.errorState = true;
      el.modelValue = 'bar';
      expect(formatterSpy.callCount).to.equal(1);
      expect(el.formattedValue).to.equal('foo: init-string');

      el.errorState = false;
      el.modelValue = 'bar2';
      expect(formatterSpy.callCount).to.equal(2);

      expect(el.formattedValue).to.equal('foo: bar2');
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
