import { expect } from '@open-wc/testing';
import { localize } from '../../src/localize.js';
import { localizeTearDown } from '../../test-helpers/index.js';

import { getDateFormatBasedOnLocale } from '../../src/date/getDateFormatBasedOnLocale.js';

describe('getDateFormatBasedOnLocale()', () => {
  beforeEach(() => {
    localizeTearDown();
  });

  it('returns the positions of day, month and year', async () => {
    localize.locale = 'en-GB';
    expect(getDateFormatBasedOnLocale()).to.equal('day-month-year');
    localize.locale = 'en-US';
    expect(getDateFormatBasedOnLocale()).to.equal('month-day-year');
  });
});
