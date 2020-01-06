import { storiesOf, html } from '@open-wc/demoing-storybook';
import { formatDate } from '@lion/localize';
import { IsDateDisabled, MinMaxDate } from '@lion/validate';
import '../lion-input-datepicker.js';

storiesOf('Forms|Input Datepicker', module)
  .add(
    'Default',
    () => html`
      <lion-input-datepicker label="Date"> </lion-input-datepicker>
    `,
  )
  .add(
    'Validation',
    () => html`
      <lion-input-datepicker
        label="MinMaxDate"
        .modelValue=${new Date('2018/05/30')}
        .validators=${[
          new MinMaxDate({ min: new Date('2018/05/24'), max: new Date('2018/06/24') }),
        ]}
      >
        <div slot="help-text">
          Enter a date between ${formatDate(new Date('2018/05/24'))} and
          ${formatDate(new Date('2018/06/24'))}.
        </div>
      </lion-input-datepicker>

      <lion-input-datepicker
        label="IsDateDisabled"
        help-text="You're not allowed to choose any 15th."
        .validators=${[new IsDateDisabled(d => d.getDate() === 15)]}
      >
      </lion-input-datepicker>
    `,
  )
  .add(
    'With calendar-heading',
    () => html`
      <lion-input-datepicker
        label="Date"
        .calendarHeading="${'Custom heading'}"
        .modelValue=${new Date()}
      >
      </lion-input-datepicker>
    `,
  )
  .add(
    'Disabled',
    () => html`
      <lion-input-datepicker label="Disabled" disabled></lion-input-datepicker>
    `,
  )
  .add(
    'Readonly',
    () => html`
      <lion-input-datepicker
        help-text="Notice that it's not possible to open the calendar on readonly inputs"
        label="Readonly"
        readonly
        .modelValue="${new Date()}"
      ></lion-input-datepicker>
    `,
  );
