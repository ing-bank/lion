import { expect } from '@open-wc/testing';
import { liveFormatPhoneNumber, PhoneUtilManager } from '@lion/components/input-tel.js';

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
    ).to.eql({ caretIndex: 4, viewValue: '+31 6 123' });
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

  describe('with formatCountryCodeStyle is set to parantheses', () => {
    it('live formats an incomplete view value', () => {
      expect(
        liveFormatPhoneNumber('+316123', {
          regionCode: 'NL',
          formatStrategy: 'international',
          prevViewValue: '+31613',
          currentCaretIndex: 5,
          formatCountryCodeStyle: 'parentheses',
        }),
      ).to.eql({ caretIndex: 9, viewValue: '(+31) 6 123' });
    });

    it('live formats a complete view value', () => {
      expect(
        liveFormatPhoneNumber('+31612345678', {
          regionCode: 'NL',
          formatStrategy: 'international',
          prevViewValue: '+3161234578',
          currentCaretIndex: 10,
          formatCountryCodeStyle: 'parentheses',
        }),
      ).to.eql({ caretIndex: 14, viewValue: '(+31) 6 12345678' });
    });

    it('does not update if parentheses are already in place', () => {
      expect(
        liveFormatPhoneNumber('(+31)6123', {
          regionCode: 'NL',
          formatStrategy: 'international',
          prevViewValue: '(+31)123',
          currentCaretIndex: 5,
          formatCountryCodeStyle: 'parentheses',
        }),
      ).to.eql({ caretIndex: 5, viewValue: '(+31)6123' });
    });

    it('sets the correct caretIndex if currentCaretIndex in between the countryCode', () => {
      expect(
        liveFormatPhoneNumber('+316123', {
          regionCode: 'NL',
          formatStrategy: 'international',
          prevViewValue: '+36123',
          currentCaretIndex: 2,
          formatCountryCodeStyle: 'parentheses',
        }),
      ).to.eql({ caretIndex: 4, viewValue: '(+31) 6 123' });
    });
  });
});
