import { expect } from '@open-wc/testing';
import sinon from 'sinon';
import { Unparseable } from '@lion/validate';
import { calculateValues, defaultProcessors } from '../src/calculateValues.js';

function equalsDate(value, date) {
  return (
    Object.prototype.toString.call(value) === '[object Date]' && // is Date Object
    Object.prototype.toString.call(date) === '[object Date]' && // is Date Object
    value.getDate() === date.getDate() && // day
    value.getMonth() === date.getMonth() && // month
    value.getFullYear() === date.getFullYear() // year
  );
}

function equalsWithDate(input, shouldBe, debug = false) {
  if (debug) {
    console.log(input);
    console.log(shouldBe);
  }
  let modelValueCheck = input.modelValue === shouldBe.modelValue;
  if (Object.prototype.toString.call(input.modelValue) === '[object Date]') {
    modelValueCheck = equalsDate(input.modelValue, shouldBe.modelValue);
  }
  let formattedValueCheck = input.formattedValue === shouldBe.formattedValue;
  if (Object.prototype.toString.call(input.formattedValue) === '[object Date]') {
    formattedValueCheck = equalsDate(input.formattedValue, shouldBe.formattedValue);
  }
  let serializedValueCheck = input.serializedValue === shouldBe.serializedValue;
  if (Object.prototype.toString.call(input.serializedValue) === '[object Date]') {
    serializedValueCheck = equalsDate(input.serializedValue, shouldBe.serializedValue);
  }
  return modelValueCheck && formattedValueCheck && serializedValueCheck;
}

describe('calculateValues', () => {
  let allFoo;
  let allDate10302010;
  let simpleDateParser;

  before(() => {
    allFoo = {
      formattedValue: 'foo',
      modelValue: 'foo',
      serializedValue: 'foo',
    };
    allDate10302010 = {
      modelValue: new Date('10/30/2010'),
      formattedValue: new Date('10/30/2010'),
      serializedValue: new Date('10/30/2010'),
    };
    simpleDateParser = v => {
      const result = new Date(v);
      // not using Number isNaN as not available on IE11
      // eslint-disable-next-line no-restricted-globals
      return !isNaN(result) ? result : undefined;
    };
  });

  it('sync to all states with default processors', async () => {
    expect(calculateValues(allFoo, 'formattedValue')).to.deep.equal(allFoo);
    expect(calculateValues(allFoo, 'modelValue')).to.deep.equal(allFoo);
    expect(calculateValues(allFoo, 'serializedValue')).to.deep.equal(allFoo);
  });

  describe('parser', () => {
    let parserObj;

    before(() => {
      parserObj = {
        modelValue: new Date('10/30/2010'),
        formattedValue: '10/30/2010',
        serializedValue: new Date('10/30/2010'),
      };
    });

    it('executes the parser only for changes to formattedValue, value and parser', async () => {
      const parserSpy = sinon.spy();
      const callWithParserFor = source => calculateValues(allFoo, source, {
          ...defaultProcessors,
          parser: { exec: parserSpy },
        });

      callWithParserFor('serializedValue');
      callWithParserFor('modelValue');
      expect(parserSpy.callCount).to.equal(0);

      callWithParserFor('formattedValue');
      expect(parserSpy.callCount).to.equal(1);
      callWithParserFor('value');
      expect(parserSpy.callCount).to.equal(2);
      callWithParserFor('parser');
      expect(parserSpy.callCount).to.equal(3);
    });

    it('calculates with the parser', () => {
      const callWithParser = (valueObj, source) =>
        calculateValues(valueObj, source, {
          ...defaultProcessors,
          parser: { exec: simpleDateParser },
        });

      expect(
        equalsWithDate(callWithParser({ formattedValue: '10/30/2010' }, 'formattedValue'), {
          ...allDate10302010,
          formattedValue: '10/30/2010',
        }),
      ).to.be.true;
      expect(
        equalsWithDate(
          callWithParser({ modelValue: new Date('10/30/2010') }, 'modelValue'),
          allDate10302010,
        ),
      ).to.be.true;
      expect(
        equalsWithDate(
          callWithParser({ serializedValue: new Date('10/30/2010') }, 'serializedValue'),
          allDate10302010,
        ),
      ).to.be.true;
      expect(
        equalsWithDate(callWithParser({ value: '10/30/2010' }, 'value'), {
          ...allDate10302010,
          formattedValue: new Date('10/30/2010'),
        }),
      ).to.be.true;
    });

    it('accepts custom parsers', () => {
      const callWithChangedParser = (valueObj, source) =>
        calculateValues(valueObj, source, {
          ...defaultProcessors,
          parser: {
            exec: v => {
              const myDate = new Date(v);
              const tomorrow = new Date(myDate);
              tomorrow.setDate(myDate.getDate() + 1);
              return tomorrow;
            },
          },
        });
      expect(
        equalsWithDate(callWithChangedParser(parserObj, 'parser'), {
          modelValue: new Date('10/31/2010'),
          formattedValue: new Date('10/31/2010'),
          serializedValue: new Date('10/31/2010'),
        }),
      ).to.be.true;
    });

    it('executes the parser only for defined values', async () => {
      const parserSpy = sinon.spy();
      const callWithParser = (valueObj, source) => calculateValues(valueObj, source, {
          ...defaultProcessors,
          parser: { exec: parserSpy },
        });

      callWithParser({ ...parserObj, formattedValue: undefined }, 'formattedValue');
      expect(parserSpy.callCount).to.equal(0);

      callWithParser({ ...parserObj, formattedValue: null }, 'formattedValue');
      expect(parserSpy.callCount).to.equal(0);

      callWithParser({ ...parserObj, formattedValue: '' }, 'formattedValue');
      expect(parserSpy.callCount).to.equal(0);

      callWithParser({ ...parserObj, formattedValue: 'foo' }, 'formattedValue');
      expect(parserSpy.callCount).to.equal(1);
    });

    it('sets modelValue to Unparseable when value can not be parsed', async () => {
      const callWithParser = (valueObj, source) =>
        calculateValues(valueObj, source, {
          ...defaultProcessors,
          parser: {
            exec: simpleDateParser,
          },
        });
      expect(
        callWithParser({ formattedValue: 'foo' }, 'formattedValue').modelValue,
      ).to.be.an.instanceof(Unparseable);
      expect(callWithParser({ value: 'foo' }, 'value').modelValue).to.be.an.instanceof(Unparseable);
    });

    it('[deprecated] will not return Unparseable when empty strings are inputted', async () => {
      // This could happen when the user erases the input value
      // For backwards compatibility, we keep the modelValue an empty string here.
      // Undefined would be more appropriate 'conceptually', however
      expect(
        calculateValues({ formattedValue: '' }, 'formattedValue', defaultProcessors),
      ).to.deep.equal({
        formattedValue: '',
        modelValue: '',
        serializedValue: '',
      });
    });
  });

  describe('formatter', () => {
    let simpleDateFormatter;
    before(() => {
      simpleDateFormatter = v =>
        `day: ${v.getDate()}, month: ${v.getMonth() + 1}, year: ${v.getFullYear()}`;
    });

    it('will execute a formatter for value and formattedValue', () => {
      const callWithFormatter = (valueObj, source) =>
        calculateValues(valueObj, source, {
          ...defaultProcessors,
          formatter: {
            exec: simpleDateFormatter,
          },
        });

      expect(
        equalsWithDate(callWithFormatter({ formattedValue: '10/30/2010' }, 'formattedValue'), {
          modelValue: '10/30/2010',
          formattedValue: '10/30/2010',
          serializedValue: '10/30/2010',
        }),
      ).to.be.true;

      expect(
        equalsWithDate(callWithFormatter({ modelValue: new Date('10/30/2010') }, 'modelValue'), {
          modelValue: new Date('10/30/2010'),
          formattedValue: 'day: 30, month: 10, year: 2010',
          serializedValue: new Date('10/30/2010'),
        }),
      ).to.be.true;

      expect(
        equalsWithDate(
          callWithFormatter({ serializedValue: new Date('10/30/2010') }, 'serializedValue'),
          {
            modelValue: new Date('10/30/2010'),
            formattedValue: 'day: 30, month: 10, year: 2010',
            serializedValue: new Date('10/30/2010'),
          },
        ),
      ).to.be.true;

      expect(
        equalsWithDate(callWithFormatter({ value: new Date('10/30/2010') }, 'value'), {
          modelValue: new Date('10/30/2010'),
          formattedValue: 'day: 30, month: 10, year: 2010',
          serializedValue: new Date('10/30/2010'),
        }),
      ).to.be.true;
    });

    it('calculates new values based on modelValue if the source is formatter', async () => {
      const callWithFormatter = (valueObj, source) =>
        calculateValues(valueObj, source, {
          ...defaultProcessors,
          formatter: {
            exec: simpleDateFormatter,
          },
        });
      expect(callWithFormatter({ modelValue: new Date('10/30/2010') }, 'formatter')).to.deep.equal({
        modelValue: new Date('10/30/2010'),
        formattedValue: 'day: 30, month: 10, year: 2010',
        serializedValue: new Date('10/30/2010'),
      });
    });

    it.only('can disable the formatter', () => {
      const callWithFormatter = (valueObj, source, disabled) =>
        calculateValues(valueObj, source, {
          ...defaultProcessors,
          formatter: {
            exec: simpleDateFormatter,
            disabled,
          },
        });
      expect(
        callWithFormatter(
          { modelValue: new Date('10/30/2010'), formattedValue: 'untouched' },
          'modelValue',
          true,
        ),
      ).to.deep.equal({
        modelValue: new Date('10/30/2010'),
        formattedValue: 'untouched',
        serializedValue: new Date('10/30/2010'),
      });
      // expect(callWithFormatter({ modelValue: new Date('10/30/2010') }, 'modelValue', true)).to.deep.equal({
      //   formattedValue: 'foo',
      //   modelValue: 'foo',
      //   serializedValue: 'foo',
      // });
    });
  });

  describe('parser & formatter combination', () => {
    it('preserves value when not parseable', async () => {
      const callWithParser = (valueObj, source) =>
        calculateValues(valueObj, source, {
          ...defaultProcessors,
          parser: { exec: simpleDateParser },
        });
      const result = callWithParser({ formattedValue: 'foo' }, 'formattedValue');
      expect(result.formattedValue).to.equal('foo');
    });

    it('sets the unparsable value to formattedValue when modelValue is of type Unparseable', async () => {
      const callWithParser = (valueObj, source) =>
        calculateValues(valueObj, source, {
          ...defaultProcessors,
          parser: { exec: simpleDateParser },
        });
      const result = callWithParser({ modelValue: new Unparseable('foo') }, 'modelValue');
      expect(result.formattedValue).to.equal('foo');
    });
  });

  describe('serializer', () => {
    let serializerObj;

    before(() => {
      serializerObj = {
        modelValue: date,
        formattedValue: date,
        serializedValue: 1286661600000,
      };
    });

    it('will execute a serializer for value and formattedValue', () => {
      const callWithSerializer = (valueObj, source) =>
        calculateValues(valueObj, source, {
          ...defaultProcessors,
          serializer: { exec: v => v.getTime() },
        });

      expect(
        callWithSerializer({ ...allFoo, formattedValue: date }, 'formattedValue'),
      ).to.deep.equal({
        formattedValue: date,
        modelValue: date,
        serializedValue: 1286661600000,
      });
      // expect(callWithSerializer(serializerObj, 'modelValue')).to.deep.equal({
      //   formattedValue: 'cat: foo',
      //   modelValue: 'foo',
      //   serializedValue: 'foo',
      // });
      // expect(callWithSerializer(allFoo, 'serializedValue')).to.deep.equal({
      //   formattedValue: 'cat: foo',
      //   modelValue: 'foo',
      //   serializedValue: 'foo',
      // });
      // expect(callWithSerializer(allFoo, 'value')).to.deep.equal({
      //   formattedValue: 'cat: foo',
      //   modelValue: 'foo',
      //   serializedValue: 'foo',
      // });
    });

    it('calculates new based on modelValue if the source is serializer', async () => {
      const callWithSerializer = (valueObj, source) =>
        calculateValues(valueObj, source, {
          ...defaultProcessors,
          serializer: { exec: v => `cat: ${v}` },
        });
      expect(callWithSerializer(allFoo, 'serializer')).to.deep.equal({
        formattedValue: 'cat: foo',
        modelValue: 'foo',
        serializedValue: 'cat: foo',
      });
    });

    it('can disable the serializer', () => {
      const callWithSerializer = (valueObj, source, disabled) =>
        calculateValues(valueObj, source, {
          ...defaultProcessors,
          serializer: { exec: v => `cat: ${v}`, disabled },
        });
      expect(callWithSerializer(allFoo, 'modelValue', false)).to.deep.equal({
        formattedValue: 'cat: foo',
        modelValue: 'foo',
        serializedValue: 'foo',
      });
      expect(callWithSerializer(allFoo, 'modelValue', true)).to.deep.equal({
        formattedValue: 'foo',
        modelValue: 'foo',
        serializedValue: 'foo',
      });
    });
  });

  // describe('foo parsers/formatters/serializers example', () => {
  //   let fooFormatEl;
  //   before(async () => {
  //     fooFormatEl = await fixture(html`
  //     <${tag}
  //       .formatter="${value => `foo: ${value}`}"
  //       .parser="${value => value.replace('foo: ', '')}"
  //       .serializer="${value => `[foo] ${value}`}"
  //       .deserializer="${value => value.replace('[foo] ', '')}"
  //     ><input slot="input">
  //     </${tag}>`);
  //   });

  //   it('converts modelValue => serializedValue (via this.serializer)', async () => {
  //     fooFormatEl.modelValue = 'string';
  //     expect(fooFormatEl.serializedValue).to.equal('[foo] string');
  //   });

  //   it('converts serializedValue => modelValue (via this.deserializer)', async () => {
  //     fooFormatEl.serializedValue = '[foo] string';
  //     expect(fooFormatEl.modelValue).to.equal('string');
  //   });
  // });

  // describe('parsers/formatters/serializers', () => {

  //   it('will only call the formatter for valid values on `user-input-changed` ', async () => {
  //     const formatterSpy = sinon.spy(value => `foo: ${value}`);
  //     const el = await fixture(html`
  //       <${tag} .formatter=${formatterSpy}>
  //         <input slot="input" value="init-string">
  //       </${tag}>
  //     `);
  //     expect(formatterSpy.callCount).to.equal(1);

  //     el.errorState = true;
  //     mimicUserInput(el, 'bar');
  //     expect(formatterSpy.callCount).to.equal(1);
  //     expect(el.formattedValue).to.equal('bar');

  //     el.errorState = false;
  //     mimicUserInput(el, 'bar2');
  //     expect(formatterSpy.callCount).to.equal(2);

  //     expect(el.formattedValue).to.equal('foo: bar2');
  //   });
  // });
});
