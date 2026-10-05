/* eslint-disable no-unused-expressions */
import { expect, fixture } from '@open-wc/testing';

import { weekdayNames } from '@lion/ui/calendar-test-helpers.js';
import { createMultipleMonth } from '../../src/utils/createMultipleMonth.js';
import { dataTemplate } from '../../src/utils/dataTemplate.js';

// eslint-disable-next-line camelcase
import snapshot_enGB_Sunday_201812 from './snapshots/monthTemplate_en-GB_Sunday_2018-12.js';

describe('dataTemplate', () => {
  it('table row has role="row" to allow users to extend without breaking the accessibility', async () => {
    // The reason is: lion is made with extending it in mind. That means overriding css.
    // If you change the display prop of tables, it loses its semantics
    const date = new Date('2018/12/01');
    const month = createMultipleMonth(date, { firstDayOfWeek: 0 });
    const el = await fixture(
      dataTemplate(month, {
        weekdaysShort: weekdayNames['en-GB'].Sunday.short,
        weekdays: weekdayNames['en-GB'].Sunday.long,
      }),
    );
    const tableRows = el.querySelectorAll('tr');
    expect(tableRows[0].hasAttribute('role')).to.be.true;
    expect(tableRows[0].getAttribute('role')).to.equal('row', 'inside thead');
    expect(tableRows[1].hasAttribute('role')).to.be.true;
    expect(tableRows[1].getAttribute('role')).to.equal('row', 'inside tbody');
  });

  it('table header has role="columnheader" to allow users to extend without breaking the accessibility', async () => {
    // The reason is: lion is made with extending it in mind. That means overriding css.
    // If you change the display prop of tables, it loses its semantics
    const date = new Date('2018/12/01');
    const month = createMultipleMonth(date, { firstDayOfWeek: 0 });
    const el = await fixture(
      dataTemplate(month, {
        weekdaysShort: weekdayNames['en-GB'].Sunday.short,
        weekdays: weekdayNames['en-GB'].Sunday.long,
      }),
    );
    const tableRows = el.querySelectorAll('th');
    expect(tableRows[0].hasAttribute('role')).to.be.true;
    expect(tableRows[0].getAttribute('role')).to.equal('columnheader');
  });

  it('table cell has role="gridcell" to allow users to extend without breaking the accessibility', async () => {
    // The reason is: lion is made with extending it in mind. That means overriding css.
    // If you change the display prop of tables, it loses its semantics
    const date = new Date('2018/12/01');
    const month = createMultipleMonth(date, { firstDayOfWeek: 0 });
    const el = await fixture(
      dataTemplate(month, {
        weekdaysShort: weekdayNames['en-GB'].Sunday.short,
        weekdays: weekdayNames['en-GB'].Sunday.long,
      }),
    );
    const tableRows = el.querySelectorAll('td');
    expect(tableRows[0].hasAttribute('role')).to.be.true;
    expect(tableRows[0].getAttribute('role')).to.equal('gridcell');
  });

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
