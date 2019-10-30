import { storiesOf, html } from '@open-wc/demoing-storybook';
import { MaxDate, MinDate, MinMaxDate } from '@lion/validate';

import '../lion-input-date.js';

storiesOf('Forms|Input Date', module)
  .add(
    'Default',
    () => html`
      <lion-input-date label="Date" .modelValue=${new Date('2017/06/15')}> </lion-input-date>
    `,
  )
  .add(
    'minDateValidator',
    () => html`
      <lion-input-date
        label="MinDate"
        help-text="Enter a date greater than or equal to today"
        .validators=${[new MinDate(new Date())]}
      >
      </lion-input-date>
    `,
  )
  .add(
    'maxDateValidator',
    () => html`
      <lion-input-date
        label="MaxDate"
        help-text="Enter a date smaller than or equal to today"
        .validators=${[new MaxDate(new Date())]}
      >
      </lion-input-date>
    `,
  )
  .add(
    'minMaxDateValidator',
    () => html`
      <lion-input-date
        label="MinMaxDate"
        help-text="Enter a date between '2018/05/24' and '2018/06/24'"
        .modelValue=${new Date('2018/05/30')}
        .validators=${[
          new MinMaxDate({ min: new Date('2018/05/24'), max: new Date('2018/06/24') }),
        ]}
      >
      </lion-input-date>
    `,
  )
  .add(
    'Faulty prefilled',
    () => html`
      <lion-input-date
        label="Date"
        help-text="Faulty prefilled input will be cleared"
        .modelValue=${'foo'}
      >
      </lion-input-date>
    `,
  );
