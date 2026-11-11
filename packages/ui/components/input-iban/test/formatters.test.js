import { expect } from '@open-wc/testing';

import { formatIBAN } from '@lion/ui/input-iban.js';

describe('formatIBAN', () => {
  it('formats the IBAN', () => {
    expect(formatIBAN('NL17INGB0002822608')).to.equal('NL17 INGB 0002 8226 08');
  });

  it('returns `` if no value is given', () => {
    expect(formatIBAN('')).to.equal('');
  });
});
