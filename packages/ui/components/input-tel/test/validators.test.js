import sinon from 'sinon';
import { expect, aTimeout } from '@open-wc/testing';
import { PhoneNumber, PhoneUtilManager } from '@lion/ui/input-tel.js';
import { mockPhoneUtilManager, restorePhoneUtilManager } from '@lion/ui/input-tel-test-helpers.js';

/**
 * @typedef {* & import('awesome-phonenumber')} AwesomePhoneNumber
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

  // TODO: this changed after awesome-phonenumber v4. Skip for now, look into this later
  it('is invalid when wrong country code is entered, returns "invalid-country-code"', () => {
    const validator = new PhoneNumber();
    // 32 is BE region code
    expect(validator.execute('+32612345678', 'NL')).to.equal('invalid-country-code');
  });

  it('is invalid when number is too short, returns "too-short"', () => {
    const validator = new PhoneNumber();
    expect(validator.execute('+316123', 'NL')).to.equal('too-short');
  });

  it('is invalid when number is too long, returns "too-long"', () => {
    const validator = new PhoneNumber();
    expect(validator.execute('+31612345678901', 'NL')).to.equal('too-long');
  });

  it('is valid when a phone number is entered', () => {
    const validator = new PhoneNumber();
    expect(validator.execute('+31612345678', 'NL')).to.be.false;
  });

  it('handles validation via awesome-phonenumber', () => {
    const validator = new PhoneNumber();
    // @ts-ignore
    const spy = sinon.spy(PhoneUtilManager.PhoneUtil, 'parsePhoneNumber');
    validator.execute('0123456789', 'NL');
    expect(spy).to.have.been.calledOnce;
    expect(spy.lastCall.args[1]).to.eql({ regionCode: 'NL' });
    validator.execute('0123456789', 'DE');
    expect(spy.lastCall.args[1]).to.eql({ regionCode: 'DE' });
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
      // @ts-ignore
      const spy = sinon.spy(PhoneUtilManager.PhoneUtil, 'parsePhoneNumber');
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
