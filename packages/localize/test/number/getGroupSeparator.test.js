import { expect } from '@open-wc/testing';

import { getGroupSeparator } from '../../src/number/getGroupSeparator.js';

describe('getGroupSeparator', () => {
  it('returns group separator for locale', () => {
    expect(getGroupSeparator('en-GB')).to.equal(',');
    expect(getGroupSeparator('nl-NL')).to.equal('.');
    expect(getGroupSeparator('fr-FR')).to.equal(' ');
  });
});
