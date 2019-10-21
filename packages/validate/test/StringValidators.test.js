import { expect } from '@open-wc/testing';

import {
  IsString,
  EqualsLength,
  MinLength,
  MaxLength,
  MinMaxLength,
  IsEmail,
} from '../src/validators/StringValidators.js';

describe('String Validation', () => {
  it('provides new IsString() to allow only strings', () => {
    let isEnabled;
    const validator = new IsString();

    isEnabled = validator.execute('foo');
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute(NaN);
    expect(validator.execute(NaN)).to.be.true;

    isEnabled = validator.execute(4);
    expect(validator.execute(4)).to.be.true;
  });

  it('provides new EqualsLength() to allow only a specific string length', () => {
    let isEnabled;
    const validator = new EqualsLength(3);
    isEnabled = validator.execute('foo');
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute('fo');
    expect(isEnabled).to.be.true;

    isEnabled = validator.execute('foobar');
    expect(isEnabled).to.be.true;
  });

  it('provides new MinLength() to allow only strings longer then min', () => {
    let isEnabled;
    const validator = new MinLength(3);
    isEnabled = validator.execute('foo');
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute('fo');
    expect(isEnabled).to.be.true;
  });

  it('provides new MaxLength() to allow only strings shorter then max', () => {
    let isEnabled;
    const validator = new MaxLength(3);
    isEnabled = validator.execute('foo');
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute('foobar');
    expect(isEnabled).to.be.true;
  });

  it('provides new MinMaxValidator() to allow only strings between min and max', () => {
    let isEnabled;
    const validator = new MinMaxLength({ min: 2, max: 4 });
    isEnabled = validator.execute('foo');
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute('f');
    expect(isEnabled).to.be.true;

    isEnabled = validator.execute('foobar');
    expect(isEnabled).to.be.true;
  });

  it('provides isEmail() to allow only valid email formats', () => {
    let isEnabled;
    const validator = new IsEmail();
    isEnabled = validator.execute('foo@bar.com');
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute('name!#$%*@bar.com');
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute('foo');
    expect(isEnabled).to.be.true;

    isEnabled = validator.execute('foo@');
    expect(isEnabled).to.be.true;

    isEnabled = validator.execute('bar.com');
    expect(isEnabled).to.be.true;

    isEnabled = validator.execute('@bar.com');
    expect(isEnabled).to.be.true;

    isEnabled = validator.execute('foo@bar@example.com');
    expect(isEnabled).to.be.true;

    isEnabled = validator.execute('foo@bar');
    expect(isEnabled).to.be.true;

    isEnabled = validator.execute('foo@120.120.120.93');
    expect(isEnabled).to.be.true;
  });
});
