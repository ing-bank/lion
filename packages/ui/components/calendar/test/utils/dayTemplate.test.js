/* eslint-disable no-unused-expressions */
import { expect, fixture } from '@open-wc/testing';
import { createDay } from '../../utils/createDay.js';
import { dayTemplate } from '../../utils/dayTemplate.js';

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

describe('dayTemplate', () => {
  it('renders day cell', async () => {
    const day = createDay(new Date('2019/04/19'), { weekOrder: 5 });
    const el = await fixture(dayTemplate(day, { weekdays }));
    expect(el).dom.to.equal(`
      <td role="gridcell" class="calendar__day-cell">
        <button
          class="calendar__day-button"
          aria-label="19 April 2019 Friday"
          aria-pressed="false"
          tabindex="-1"
        >
          <span class="calendar__day-button__text">19</span>
        </button>
      </td>
    `);
  });

  it('sets the first-day attribute', async () => {
    let day = createDay(new Date('2019/04/01'));
    const el1 = await fixture(dayTemplate(day, { weekdays }));
    expect(el1.hasAttribute('first-day')).to.be.true;
    day = createDay(new Date('2019/04/02'));
    const el2 = await fixture(dayTemplate(day, { weekdays }));
    expect(el2.hasAttribute('first-day')).to.be.false;
  });

  it('sets the end-of-first-week attribute', async () => {
    let day = createDay(new Date('2019/04/06'), { weekOrder: 6 });
    const el1 = await fixture(dayTemplate(day, { weekdays }));
    expect(el1.hasAttribute('end-of-first-week')).to.be.true;
    day = createDay(new Date('2019/04/13'), { weekOrder: 6 });
    const el2 = await fixture(dayTemplate(day, { weekdays }));
    expect(el2.hasAttribute('end-of-first-week')).to.be.false;
  });

  it('sets the start-of-first-full-week attribute', async () => {
    let day = createDay(new Date('2019/04/07'), { startOfWeek: true });
    const el1 = await fixture(dayTemplate(day, { weekdays }));
    expect(el1.hasAttribute('start-of-first-full-week')).to.be.true;
    day = createDay(new Date('2019/04/14'), { startOfWeek: true });
    const el2 = await fixture(dayTemplate(day, { weekdays }));
    expect(el2.hasAttribute('start-of-first-full-week')).to.be.false;
  });

  it('sets the end-of-last-full-week attribute', async () => {
    let day = createDay(new Date('2019/04/27'), { weekOrder: 6 });
    const el1 = await fixture(dayTemplate(day, { weekdays }));
    expect(el1.hasAttribute('end-of-last-full-week')).to.be.true;
    day = createDay(new Date('2019/04/20'), { weekOrder: 6 });
    const el2 = await fixture(dayTemplate(day, { weekdays }));
    expect(el2.hasAttribute('end-of-last-full-week')).to.be.false;
  });

  it('sets the start-of-last-week attribute', async () => {
    let day = createDay(new Date('2019/04/28'), { startOfWeek: true });
    const el1 = await fixture(dayTemplate(day, { weekdays }));
    expect(el1.hasAttribute('start-of-last-week')).to.be.true;
    day = createDay(new Date('2019/04/21'), { startOfWeek: true });
    const el2 = await fixture(dayTemplate(day, { weekdays }));
    expect(el2.hasAttribute('start-of-last-week')).to.be.false;
  });

  it('sets the last-day attribute', async () => {
    let day = createDay(new Date('2019/04/30'), { startOfWeek: true });
    const el1 = await fixture(dayTemplate(day, { weekdays }));
    expect(el1.hasAttribute('last-day')).to.be.true;
    day = createDay(new Date('2019/03/30'), { startOfWeek: true });
    const el2 = await fixture(dayTemplate(day, { weekdays }));
    expect(el2.hasAttribute('last-day')).to.be.false;
    day = createDay(new Date('2019/02/28'), { startOfWeek: true });
    const el3 = await fixture(dayTemplate(day, { weekdays }));
    expect(el3.hasAttribute('last-day')).to.be.true;
  });
});
