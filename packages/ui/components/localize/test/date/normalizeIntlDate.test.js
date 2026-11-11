import { expect } from '@open-wc/testing';
import { normalizeIntlDate } from '../../src/date/utils/normalizeIntlDate.js';

/** @type {import('../../types/LocalizeMixinTypes.js').FormatDateOptions} */
const longWithoutYear = { weekday: 'long', month: 'long', day: '2-digit' };
/** @type {import('../../types/LocalizeMixinTypes.js').FormatDateOptions} */
const longWithYear = { ...longWithoutYear, year: 'numeric' };

describe('normalizeIntlDate', () => {
  it('replaces non-breaking spaces by spaces and strips left-to-right marks', () => {
    expect(normalizeIntlDate('12\u00a0October\u200e 2019')).to.equal('12 October 2019');
  });

  it('removes the comma after the weekday for sk-SK dates without a year', () => {
    expect(normalizeIntlDate('sobota, 12. októbra', 'sk-SK', longWithoutYear)).to.equal(
      'sobota 12. októbra',
    );
  });

  it('adds a comma after the weekday for English dates with a year', () => {
    expect(normalizeIntlDate('Saturday 12 October 2019', 'en-GB', longWithYear)).to.equal(
      'Saturday, 12 October 2019',
    );
  });

  it('keeps English dates with a year that already have a comma', () => {
    expect(normalizeIntlDate('Saturday, 12 October 2019', 'en-GB', longWithYear)).to.equal(
      'Saturday, 12 October 2019',
    );
  });
});
