import sinon from 'sinon';
import { expect, aTimeout } from '@open-wc/testing';
import { PhoneNumber } from '../src/validators.js';
import { PhoneUtilManager } from '../src/PhoneUtilManager.js';
import {
  mockPhoneUtilManager,
  restorePhoneUtilManager,
} from '../test-helpers/mockPhoneUtilManager.js';

/**
 * @typedef {* & import('@lion/input-tel/src/lib/awesome-phonenumber-esm').default} AwesomePhoneNumber
 */

// For enum output, see: https://www.npmjs.com/package/awesome-phonenumber
describe('PhoneNumber validation', () => {
  beforeEach(async () => {
    // Wait till PhoneUtilManager has been loaded
    await PhoneUtilManager.loadComplete;
  });

  it('is invalid when no input is provided', () => {
    const validator = new PhoneNumber();
    expect(validator.execute('', 'NL')).to.equal('unknown');
  });

  it('is invalid when non digits are entered, returns "unknown"', () => {
    const validator = new PhoneNumber();
    expect(validator.execute('foo', 'NL')).to.equal('unknown');
  });

  it('is invalid when wrong country code is entered, returns "invalid-country-code"', () => {
    const validator = new PhoneNumber();
    // 32 is BE region code
    expect(validator.execute('+32612345678', 'NL')).to.equal('invalid-country-code');
  });

  // TODO: find out why awesome-phonenumber does not detect too-short/too-long
  it.skip('is invalid when number is too short, returns "too-short"', () => {
    const validator = new PhoneNumber();
    expect(validator.execute('+3161234567', 'NL')).to.equal('too-short');
  });

  // TODO: find out why awesome-phonenumber does not detect too-short/too-long
  it.skip('is invalid when number is too long, returns "too-long"', () => {
    const validator = new PhoneNumber();
    expect(validator.execute('+316123456789', 'NL')).to.equal('too-long');
  });

  it('is valid when a phone number is entered', () => {
    const validator = new PhoneNumber();
    expect(validator.execute('+31612345678', 'NL')).to.be.false;
  });

  it('handles validation via awesome-phonenumber', () => {
    const validator = new PhoneNumber();
    const spy = sinon.spy(PhoneUtilManager, 'PhoneUtil');
    validator.execute('0123456789', 'NL');
    expect(spy).to.have.been.calledOnce;
    expect(spy.lastCall.args[1]).to.equal('NL');
    validator.execute('0123456789', 'DE');
    expect(spy.lastCall.args[1]).to.equal('DE');
    spy.restore();
  });

  describe('Lazy loading PhoneUtilManager', () => {
    /** @type {(value:any) => void} */
    let resolveLoaded;
    beforeEach(() => {
      ({ resolveLoaded } = mockPhoneUtilManager());
    });

    afterEach(() => {
      restorePhoneUtilManager();
    });

    it('behaves asynchronously when lib is still loading', () => {
      expect(PhoneNumber.async).to.be.true;
      resolveLoaded(undefined);
      expect(PhoneNumber.async).to.be.false;
    });

    it('waits for the lib to be loaded before execution completes when still in async mode', async () => {
      const validator = new PhoneNumber();
      const spy = sinon.spy(PhoneUtilManager, 'PhoneUtil');
      const validationResult = validator.execute('061234', 'NL');
      expect(validationResult).to.be.instanceOf(Promise);
      expect(spy).to.not.have.been.called;
      resolveLoaded(undefined);
      await aTimeout(0);
      expect(spy).to.have.been.calledOnce;
      spy.restore();
    });
  });
});
