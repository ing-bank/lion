import { expect } from '@open-wc/testing';
import {
  getLocalizeManager,
  getDateFormatBasedOnLocale,
} from '@lion/ui/localize-no-side-effects.js';
import { localizeTearDown } from '@lion/ui/localize-test-helpers.js';

describe('getDateFormatBasedOnLocale()', () => {
  const localizeManager = getLocalizeManager();

  beforeEach(() => {
    localizeTearDown();
  });

  it('returns the positions of day, month and year', async () => {
    localizeManager.locale = 'en-GB';
    expect(getDateFormatBasedOnLocale()).to.equal('day-month-year');
    localizeManager.locale = 'en-US';
    expect(getDateFormatBasedOnLocale()).to.equal('month-day-year');
  });
});
