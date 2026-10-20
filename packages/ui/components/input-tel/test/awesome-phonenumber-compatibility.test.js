import { expect } from '@open-wc/testing';
import { PhoneUtilManager } from '@lion/ui/input-tel.js';
import { formatPhoneNumber } from '../src/formatters.js';
import { parsePhoneNumber } from '../src/parsers.js';

const phoneLibraryUpgradeCases = [
  {
    regionCode: 'DZ',
    input: '0612345678',
    previous: { valid: false, type: 'unknown' },
    current: { valid: true, type: 'mobile' },
  },
  {
    regionCode: 'GM',
    input: '612345678',
    previous: { possible: false },
    current: { possible: true },
  },
  {
    regionCode: 'SO',
    input: '0612345678',
    previous: { international: '+252 61 2345678' },
    current: { international: '+252 61 234 5678' },
  },
  {
    regionCode: 'VN',
    input: '1234567890',
    previous: { international: '+84 1234 567890', asYouType: '1234 567890' },
    current: { international: '+84 1234567890', asYouType: '1234567890' },
  },
  {
    regionCode: 'ZW',
    input: '0612345678',
    previous: { international: '+263 612345678', asYouType: '0612345678' },
    current: { international: '+263 61 2345678', asYouType: '061 2345678' },
  },
];

/**
 * @param {string} input
 * @param {string} regionCode
 */
function getPhoneLibrarySnapshot(input, regionCode) {
  const phoneUtil = PhoneUtilManager.PhoneUtil;
  const parsed = phoneUtil.parsePhoneNumber(input, { regionCode });
  const asYouType = phoneUtil.getAsYouType(regionCode);
  for (const character of input) {
    asYouType.addChar(character);
  }

  return {
    international: parsed.number?.international,
    valid: parsed.valid,
    possible: parsed.possible,
    type: parsed.type,
    asYouType: asYouType.number(),
  };
}

describe('awesome-phonenumber compatibility', () => {
  before(async () => {
    await PhoneUtilManager.loadComplete;
  });

  for (const { regionCode, input, previous, current } of phoneLibraryUpgradeCases) {
    it(`matches the reviewed ${regionCode} parsing and typing output`, () => {
      expect(current).to.not.deep.equal(previous);
      expect(getPhoneLibrarySnapshot(input, regionCode)).to.include(current);
    });
  }

  it('keeps the Belgian invalid-number contract unchanged from 7.8.0', () => {
    const previous = {
      international: '+32 612345678',
      valid: false,
      possible: true,
      type: 'unknown',
      asYouType: '+32 6 12345678',
    };
    const current = getPhoneLibrarySnapshot('+32 6 12345678', 'BE');
    expect(current).to.deep.equal(previous);
    expect(parsePhoneNumber('+32 6 12345678', { regionCode: 'BE' })).to.equal('+32612345678');
    expect(
      formatPhoneNumber('+32612345678', {
        regionCode: 'BE',
        formatCountryCodeStyle: 'parentheses',
      }),
    ).to.equal('(+32)612345678');
  });
});
