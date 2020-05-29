import { expect } from '@open-wc/testing';

import {
  IsString,
  EqualsLength,
  MinLength,
  MaxLength,
  MinMaxLength,
  IsEmail,
  Pattern,
} from '../../src/validate/validators/StringValidators.js';

describe('String Validation', () => {
  it('provides new IsString() to allow only strings', () => {
    let isEnabled;
    const validator = new IsString();
    expect(validator.constructor.name).to.equal('IsString');

    isEnabled = validator.execute('foo');
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute(NaN);
    expect(validator.execute(NaN)).to.be.true;

    isEnabled = validator.execute(4);
    expect(validator.execute(4)).to.be.true;
  });

  it('provides new EqualsLength(x) to allow only a specific string length', () => {
    let isEnabled;
    const validator = new EqualsLength(3);
    expect(validator.constructor.name).to.equal('EqualsLength');

    isEnabled = validator.execute('foo');
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute('fo');
    expect(isEnabled).to.be.true;

    isEnabled = validator.execute('foobar');
    expect(isEnabled).to.be.true;
  });

  it('provides new MinLength(x) to allow only strings longer then min', () => {
    let isEnabled;
    const validator = new MinLength(3);
    expect(validator.constructor.name).to.equal('MinLength');

    isEnabled = validator.execute('foo');
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute('fo');
    expect(isEnabled).to.be.true;
  });

  it('provides new MaxLength(x) to allow only strings shorter then max', () => {
    let isEnabled;
    const validator = new MaxLength(3);
    expect(validator.constructor.name).to.equal('MaxLength');

    isEnabled = validator.execute('foo');
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute('foobar');
    expect(isEnabled).to.be.true;
  });

  it('provides new MinMaxValidator({ min: x, max: y}) to allow only strings between min and max', () => {
    let isEnabled;
    const validator = new MinMaxLength({ min: 2, max: 4 });
    expect(validator.constructor.name).to.equal('MinMaxLength');

    isEnabled = validator.execute('foo');
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute('f');
    expect(isEnabled).to.be.true;

    isEnabled = validator.execute('foobar');
    expect(isEnabled).to.be.true;
  });

  it('provides new IsEmail() to allow only valid email formats', () => {
    let isEnabled;
    const validator = new IsEmail();
    expect(validator.constructor.name).to.equal('IsEmail');

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

  it('provides new Pattern() to allow only valid patterns', () => {
    let isEnabled;
    let validator = new Pattern(/#LionRocks/);
    expect(validator.constructor.validatorName).to.equal('Pattern');

    isEnabled = validator.execute('#LionRocks');
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute('#LionRests');
    expect(isEnabled).to.be.true;

    validator = new Pattern(new RegExp('#LionRocks'));
    isEnabled = validator.execute('Some string #LionRocks');
    expect(isEnabled).to.be.false;

    validator = new Pattern('#LionRocks');
    expect(() => {
      validator.execute('Some string #LionRocks');
    }).to.throw(
      'Psst... Pattern validator expects RegExp object as parameter e.g, new Pattern(/#LionRocks/) or new Pattern(RegExp("#LionRocks")',
    );
  });
});
