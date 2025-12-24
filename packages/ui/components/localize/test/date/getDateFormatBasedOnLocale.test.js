import { describe, it } from 'vitest';
import {
  getLocalizeManager,
  getDateFormatBasedOnLocale,
} from '@lion/ui/localize-no-side-effects.js';
import { expect } from '../../../../test-helpers.js';
import { localizeTearDown } from '../../test-helpers/localizeTearDown.js';

describe('getDateFormatBasedOnLocale()', () => {
  const localizeManager = getLocalizeManager();
  beforeEach(() => {
    localizeTearDown();
  });

  it('returns the positions of day, month and year with locale set globally', async () => {
    localizeManager.locale = 'en-GB';
    expect(getDateFormatBasedOnLocale()).to.equal('day-month-year');
    localizeManager.locale = 'en-US';
    expect(getDateFormatBasedOnLocale()).to.equal('month-day-year');
  });

  it('returns the positions of day, month and year with given locale', async () => {
    expect(getDateFormatBasedOnLocale('en-GB')).to.equal('day-month-year');
    expect(getDateFormatBasedOnLocale('en-US')).to.equal('month-day-year');
  });
});
