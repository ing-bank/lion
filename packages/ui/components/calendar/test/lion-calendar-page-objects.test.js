import { expect } from '@open-wc/testing';
import { CalendarObject } from '@lion/ui/calendar-test-helpers.js';
import { runCalendarSuite } from '@lion/ui/calendar-suites.js';

let instances = 0;

class SuiteCalendarObject extends CalendarObject {
  /** @param {import('@lion/ui/calendar.js').LionCalendar} el */
  constructor(el) {
    super(el);
    instances += 1;
  }
}

describe('calendar suite with a host page object', () => {
  runCalendarSuite({ pageObjects: { host: SuiteCalendarObject } });

  after(() => {
    expect(instances, 'the suite must instantiate the supplied host page object').to.be.above(0);
  });
});

describe('calendar suite with an empty page-object map', () => {
  runCalendarSuite({ pageObjects: {} });
});
