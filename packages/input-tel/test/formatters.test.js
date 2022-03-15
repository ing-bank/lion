import { expect } from '@open-wc/testing';
import { formatPhoneNumber } from '../src/formatters.js';
import { PhoneUtilManager } from '../src/PhoneUtilManager.js';

describe('formatPhoneNumber', () => {
  beforeEach(async () => {
    // Wait till PhoneUtilManager has been loaded
    await PhoneUtilManager.loadComplete;
  });

  it('formats a phone number according to provided formatStrategy', () => {
    expect(formatPhoneNumber('0707123456', { regionCode: 'SE', formatStrategy: 'e164' })).to.equal(
      '+46707123456',
    );
    expect(
      formatPhoneNumber('+46707123456', { regionCode: 'SE', formatStrategy: 'international' }),
    ).to.equal('+46 70 712 34 56');
    expect(
      formatPhoneNumber('+46707123456', { regionCode: 'SE', formatStrategy: 'national' }),
    ).to.equal('070-712 34 56');
    expect(
      formatPhoneNumber('+46707123456', { regionCode: 'SE', formatStrategy: 'rfc3966' }),
    ).to.equal('tel:+46-70-712-34-56');
    expect(
      formatPhoneNumber('+46707123456', { regionCode: 'SE', formatStrategy: 'significant' }),
    ).to.equal('707123456');
  });
});
