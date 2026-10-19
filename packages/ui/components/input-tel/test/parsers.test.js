import { expect } from '@open-wc/testing';
import { PhoneUtilManager } from '@lion/ui/input-tel.js';
import { parsePhoneNumber } from '../src/parsers.js';
import {
  mockPhoneUtilManager,
  restorePhoneUtilManager,
} from '../test-helpers/mockPhoneUtilManager.js';

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

  it('keeps parsing enabled after restoring the lazy-loading mock', async () => {
    const value = '+32 6 12345678';
    const parsedBeforeMock = parsePhoneNumber(value, { regionCode: 'BE' });
    const { resolveLoaded } = mockPhoneUtilManager();
    try {
      expect(PhoneUtilManager.isLoaded).to.be.false;
      expect(parsePhoneNumber(value, { regionCode: 'BE' })).to.equal(value);
      resolveLoaded(undefined);
      await PhoneUtilManager.loadComplete;
    } finally {
      restorePhoneUtilManager();
    }
    expect(PhoneUtilManager.isLoaded).to.be.true;
    expect(parsePhoneNumber(value, { regionCode: 'BE' })).to.equal(parsedBeforeMock);
    expect(parsedBeforeMock).to.equal('+32612345678');
  });
});
