/* eslint-disable no-unused-expressions */
import { expect, fixture } from '@open-wc/testing';

import { createDay } from '../../src/utils/createDay.js';
import { dayTemplate } from '../../src/utils/dayTemplate.js';

describe('dayTemplate', () => {
  it('renders day cell', async () => {
    const day = createDay(new Date('2019/04/19'), { weekOrder: 5 });
    const el = await fixture(
      dayTemplate(day, {
        weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      }),
    );
    expect(el).dom.to.equal(`
      <td role="gridcell" class="calendar__day-cell">
        <button
          class="calendar__day-button"
          tabindex="-1"
          aria-label="19 April 2019 Friday"
          aria-pressed="false"
          title
        >
          19
        </button>
      </td>
    `);
  });
});
