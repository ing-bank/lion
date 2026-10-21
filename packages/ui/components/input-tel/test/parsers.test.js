import { expect } from '@open-wc/testing';
import { PhoneUtilManager } from '@lion/ui/input-tel.js';
import { parsePhoneNumber } from '../src/parsers.js';
import { formatPhoneNumber } from '../src/formatters.js';
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

  it('restores real loaded parsing and formatting without resolving the mock', () => {
    const viewValue = '+32 6 12345678';
    const modelValue = '+32612345678';
    const realLoadComplete = PhoneUtilManager.loadComplete;
    mockPhoneUtilManager();
    try {
      expect(PhoneUtilManager.isLoaded).to.be.false;
      expect(parsePhoneNumber(viewValue, { regionCode: 'BE' })).to.equal(viewValue);
    } finally {
      restorePhoneUtilManager();
    }

    expect(PhoneUtilManager.loadComplete).to.equal(realLoadComplete);
    expect(PhoneUtilManager.isLoaded).to.be.true;
    expect(parsePhoneNumber(viewValue, { regionCode: 'BE' })).to.equal(modelValue);
    expect(
      formatPhoneNumber(modelValue, {
        regionCode: 'BE',
        formatCountryCodeStyle: 'parentheses',
      }),
    ).to.equal('(+32)612345678');
  });

  it('restores a live getter that tracks the real utility before and after loading', () => {
    const utility = Object.getOwnPropertyDescriptor(PhoneUtilManager, 'PhoneUtil');
    if (!utility) {
      throw new Error('The real phone utility must be loaded for this regression');
    }
    const realLoadComplete = PhoneUtilManager.loadComplete;
    try {
      Object.defineProperty(PhoneUtilManager, 'PhoneUtil', { ...utility, value: undefined });
      mockPhoneUtilManager();
      restorePhoneUtilManager();
      expect(PhoneUtilManager.isLoaded).to.be.false;
      expect(PhoneUtilManager.loadComplete).to.equal(realLoadComplete);

      Object.defineProperty(PhoneUtilManager, 'PhoneUtil', utility);
      expect(PhoneUtilManager.isLoaded).to.be.true;
      expect(parsePhoneNumber('+32 6 12345678', { regionCode: 'BE' })).to.equal('+32612345678');
    } finally {
      Object.defineProperty(PhoneUtilManager, 'PhoneUtil', utility);
      restorePhoneUtilManager();
    }
  });
});
