import { describe, it } from 'vitest';
import { fixture } from '@open-wc/testing-helpers';
import { weekdayNames } from '../../test-helpers/weekdayNames.js';
import { expect } from '../../../../test-helpers.js';
/* eslint-disable no-unused-expressions */

import { createMultipleMonth } from '../../src/utils/createMultipleMonth.js';
import { dataTemplate } from '../../src/utils/dataTemplate.js';

// eslint-disable-next-line camelcase
import snapshot_enGB_Sunday_201812 from './snapshots/monthTemplate_en-GB_Sunday_2018-12.js';

describe('dataTemplate', () => {
  it('renders one month table', async () => {
    const date = new Date('2018/12/01');
    const month = createMultipleMonth(date, { firstDayOfWeek: 0 });
    const el = await fixture(
      dataTemplate(month, {
        weekdaysShort: weekdayNames['en-GB'].Sunday.short,
        weekdays: weekdayNames['en-GB'].Sunday.long,
      }),
    );

    expect(el).dom.to.equal(snapshot_enGB_Sunday_201812);
  });
});
