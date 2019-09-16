import { expect } from '@open-wc/testing';
import { normalizeDateTime } from '@lion/localize';
import { smokeTestValidator } from '../test-helpers.js';

import {
  isString,
  equalsLength,
  minLength,
  maxLength,
  minMaxLength,
  isEmail,
  isStringValidator,
  equalsLengthValidator,
  minLengthValidator,
  maxLengthValidator,
  minMaxLengthValidator,
  isEmailValidator,
  isNumber,
  minNumber,
  maxNumber,
  minMaxNumber,
  isNumberValidator,
  minNumberValidator,
  maxNumberValidator,
  minMaxNumberValidator,
  isDate,
  minDate,
  maxDate,
  isDateDisabled,
  minMaxDate,
  isDateValidator,
  minDateValidator,
  maxDateValidator,
  minMaxDateValidator,
  isDateDisabledValidator,
  randomOk,
  defaultOk,
  randomOkValidator,
  defaultOkValidator,
} from '../src/validators.js';

describe('LionValidate', () => {
  describe('String Validation', () => {
    it('provides isString() to allow only strings', () => {
      expect(isString('foo')).to.be.true;
      expect(isString(NaN)).to.be.false;
      expect(isString(4)).to.be.false;
    });

    it('provides equalsLength() to allow only a specific string length', () => {
      expect(equalsLength('foo', 3)).to.be.true;
      expect(equalsLength('fo', 3)).to.be.false;
      expect(equalsLength('foobar', 3)).to.be.false;
    });

    it('provides minLength() to allow only strings longer then min', () => {
      expect(minLength('foo', 3)).to.be.true;
      expect(minLength('fo', 3)).to.be.false;
    });

    it('provides maxLength() to allow only strings shorter then max', () => {
      expect(maxLength('foo', 3)).to.be.true;
      expect(maxLength('foobar', 3)).to.be.false;
    });

    it('provides minMaxLength() to allow only strings between min and max', () => {
      expect(minMaxLength('foo', { min: 2, max: 4 })).to.be.true;
      expect(minMaxLength('f', { min: 2, max: 4 })).to.be.false;
      expect(minMaxLength('foobar', { min: 2, max: 4 })).to.be.false;
    });

    it('provides isEmail() to allow only valid email formats', () => {
      expect(isEmail('foo@bar.com')).to.be.true;
      expect(isEmail('name!#$%*@bar.com')).to.be.true;
      expect(isEmail('foo')).to.be.false;
      expect(isEmail('foo@')).to.be.false;
      expect(isEmail('@bar')).to.be.false;
      expect(isEmail('bar.com')).to.be.false;
      expect(isEmail('@bar.com')).to.be.false;
      expect(isEmail('foo@bar@example.com')).to.be.false;
      expect(isEmail('foo@bar')).to.be.false;
      expect(isEmail('foo@120.120.120.93')).to.be.false;
    });

    it('provides {isString, equalsLength, minLength, maxLength, minMaxLength, isEmail}Validator factory function for all types', () => {
      // do a smoke test for each type
      smokeTestValidator('isString', isStringValidator, 'foo');
      smokeTestValidator('equalsLength', equalsLengthValidator, 'foo', 3);
      smokeTestValidator('minLength', minLengthValidator, 'foo', 3);
      smokeTestValidator('maxLength', maxLengthValidator, 'foo', 3);
      smokeTestValidator('minMaxLength', minMaxLengthValidator, 'foo', { min: 2, max: 4 });
      smokeTestValidator('isEmail', isEmailValidator, 'foo@bar.com');
    });
  });

  describe('Number Validation', () => {
    it('provides isNumber() to allow only numbers', () => {
      expect(isNumber(4)).to.be.true;
      expect(isNumber(NaN)).to.be.false;
      expect(isNumber('4')).to.be.false;
    });

    it('provides minNumber() to allow only numbers longer then min', () => {
      expect(minNumber(3, 3)).to.be.true;
      expect(minNumber(2, 3)).to.be.false;
    });

    it('provides maxNumber() to allow only number shorter then max', () => {
      expect(maxNumber(3, 3)).to.be.true;
      expect(maxNumber(4, 3)).to.be.false;
    });

    it('provides minMaxNumber() to allow only numbers between min and max', () => {
      expect(minMaxNumber(3, { min: 2, max: 4 })).to.be.true;
      expect(minMaxNumber(1, { min: 2, max: 4 })).to.be.false;
      expect(minMaxNumber(5, { min: 2, max: 4 })).to.be.false;
    });

    it('provides {isNumber, minNumber, maxNumber, minMaxNumber}Validator factory function for all types', () => {
      // do a smoke test for each type
      smokeTestValidator('isNumber', isNumberValidator, 4);
      smokeTestValidator('minNumber', minNumberValidator, 3, 3);
      smokeTestValidator('maxNumber', maxNumberValidator, 3, 3);
      smokeTestValidator('minMaxNumber', minMaxNumberValidator, 3, { min: 2, max: 4 });
    });
  });

  describe('Date Validation', () => {
    it('provides isDate() to allow only dates', () => {
      expect(isDate(new Date())).to.be.true;
      expect(isDate('foo')).to.be.false;
      expect(isDate(4)).to.be.false;
    });

    it('provides minDate() to allow only dates after min', () => {
      expect(minDate(new Date('2018-02-03'), new Date('2018/02/02'))).to.be.true;
      expect(minDate(new Date('2018-02-01'), new Date('2018/02/02'))).to.be.false;
      const today = new Date();
      const todayFormatted = normalizeDateTime(today);
      expect(minDate(todayFormatted, today)).to.be.true;
    });

    it('provides maxDate() to allow only dates before max', () => {
      expect(maxDate(new Date('2018-02-01'), new Date('2018/02/02'))).to.be.true;
      expect(maxDate(new Date('2018-02-03'), new Date('2018/02/02'))).to.be.false;
      const today = new Date();
      const todayFormatted = normalizeDateTime(today);
      expect(maxDate(todayFormatted, today)).to.be.true;
    });

    it('provides minMaxDate() to allow only dates between min and max', () => {
      const minMaxSetting = {
        min: new Date('2018/02/02'),
        max: new Date('2018/02/04'),
      };
      expect(minMaxDate(new Date('2018/02/03'), minMaxSetting)).to.be.true;
      expect(minMaxDate(new Date('2018/02/01'), minMaxSetting)).to.be.false;
      expect(minMaxDate(new Date('2018/02/05'), minMaxSetting)).to.be.false;
      const today = new Date();
      const todayFormatted = normalizeDateTime(today);
      expect(minMaxDate(todayFormatted, { min: today, max: today })).to.be.true;
    });

    it('provides isDateDisabled() to disable dates matching specified condition', () => {
      expect(isDateDisabled(new Date('2018/02/03'), d => d.getDate() === 3)).to.be.false;
      expect(isDateDisabled(new Date('2018/02/04'), d => d.getDate() === 3)).to.be.true;
    });

    it('provides {isDate, minDate, maxDate, minMaxDate, isDateDisabled}Validator factory function for all types', () => {
      // do a smoke test for each type
      smokeTestValidator('isDate', isDateValidator, new Date());
      smokeTestValidator(
        'minDate',
        minDateValidator,
        new Date('2018/02/03'),
        new Date('2018/02/02'),
      );
      smokeTestValidator(
        'maxDate',
        maxDateValidator,
        new Date('2018/02/01'),
        new Date('2018/02/02'),
      );
      const minMaxSetting = {
        min: new Date('2018/02/02'),
        max: new Date('2018/02/04'),
      };
      smokeTestValidator('minMaxDate', minMaxDateValidator, new Date('2018/02/03'), minMaxSetting);
      smokeTestValidator(
        'isDateDisabled',
        isDateDisabledValidator,
        new Date('2018/02/03'),
        d => d.getDate() === 15,
      );
    });
  });

  describe('Success Validation', () => {
    it('provides randomOk() which fails always, so it can show the succeeds message', () => {
      expect(randomOk('foo')).to.be.false;
      expect(randomOkValidator()[0]('foo').randomOk).to.be.false;
    });
    it('provides defaultOk() which fails always, so it can show the succeeds message', () => {
      expect(defaultOk('foo')).to.be.false;
      expect(defaultOkValidator()[0]('foo').defaultOk).to.be.false;
    });
  });
});
