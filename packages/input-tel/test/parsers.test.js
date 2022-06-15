import { expect } from '@open-wc/testing';
import { parsePhoneNumber } from '../src/parsers.js';
import { PhoneUtilManager } from '../src/PhoneUtilManager.js';

describe('parsePhoneNumber', () => {
  beforeEach(async () => {
    // Wait till PhoneUtilManager has been loaded
    await PhoneUtilManager.loadComplete;
  });

  it('parses a a view value to e164 standard', () => {
    expect(parsePhoneNumber('0707123456', { regionCode: 'SE' })).to.equal('+46707123456');
    expect(parsePhoneNumber('0707123456', { regionCode: 'NL' })).to.equal('+31707123456');
    expect(parsePhoneNumber('0707123456', { regionCode: 'DE' })).to.equal('+49707123456');
  });

  it('removes unwanted characters', () => {
    expect(parsePhoneNumber('(+31)707123456', { regionCode: 'NL' })).to.equal('+31707123456');
    expect(parsePhoneNumber('+31 70 7123456', { regionCode: 'NL' })).to.equal('+31707123456');
    expect(parsePhoneNumber('+31-70-7123456', { regionCode: 'NL' })).to.equal('+31707123456');
    expect(parsePhoneNumber('+31|70|7123456', { regionCode: 'NL' })).to.equal('+31707123456');
    expect(parsePhoneNumber('tel:+31707123456', { regionCode: 'NL' })).to.equal('+31707123456');
  });
});
