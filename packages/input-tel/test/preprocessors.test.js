import { expect } from '@open-wc/testing';
import { liveFormatPhoneNumber } from '../src/preprocessors.js';
import { PhoneUtilManager } from '../src/PhoneUtilManager.js';

describe('liveFormatPhoneNumber', () => {
  beforeEach(async () => {
    // Wait till PhoneUtilManager has been loaded
    await PhoneUtilManager.loadComplete;
  });

  it('live formats an incomplete view value', () => {
    expect(
      liveFormatPhoneNumber('+316123', {
        regionCode: 'NL',
        formatStrategy: 'international',
        prevViewValue: '+36123',
        currentCaretIndex: 2,
      }),
    ).to.eql({ viewValue: '+31 6 123', caretIndex: 4 });
  });

  it('live formats a complete view value', () => {
    expect(
      liveFormatPhoneNumber('+31612345678', {
        regionCode: 'NL',
        formatStrategy: 'international',
        prevViewValue: '+3161234578',
        currentCaretIndex: 10,
      }),
    ).to.eql({ caretIndex: 12, viewValue: '+31 6 12345678' });
  });
});
