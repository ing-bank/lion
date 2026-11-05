import { expect } from '@open-wc/testing';
import { DatepickerInputObject } from '@lion/ui/input-datepicker-test-helpers.js';
import { runDatepickerSuite } from '@lion/ui/input-datepicker-suites.js';

let instances = 0;

class SuiteDatepickerInputObject extends DatepickerInputObject {
  /** @param {import('@lion/ui/input-datepicker.js').LionInputDatepicker} el */
  constructor(el) {
    super(el);
    instances += 1;
  }
}

describe('datepicker suite with a host page object', () => {
  runDatepickerSuite({ pageObjects: { host: SuiteDatepickerInputObject } });

  after(() => {
    expect(instances, 'the suite must instantiate the supplied host page object').to.be.above(0);
  });
});

describe('datepicker suite with an empty page-object map', () => {
  runDatepickerSuite({ pageObjects: {} });
});
