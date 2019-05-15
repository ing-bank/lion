import { storiesOf, html } from '@open-wc/demoing-storybook';
import { isDateDisabledValidator, minMaxDateValidator } from '@lion/validate';
import '../lion-input-datepicker.js';

storiesOf('Forms|Input Datepicker', module)
  .add(
    'Default',
    () => html`
      <lion-input-datepicker label="Date" .modelValue=${new Date('2017/06/15')}>
      </lion-input-datepicker>
    `,
  )
  .add(
    'minMaxDateValidator',
    () => html`
      <lion-input-datepicker
        label="MinMaxDate"
        help-text="Enter a date between '2018/05/24' and '2018/06/24'"
        .modelValue=${new Date('2018/05/30')}
        .errorValidators=${[
          minMaxDateValidator({ min: new Date('2018/05/24'), max: new Date('2018/06/24') }),
        ]}
      >
      </lion-input-datepicker>
    `,
  )
  .add(
    'isDateDisabledValidator',
    () => html`
      <lion-input-datepicker
        label="isDateDisabled"
        help-text="You're not allowed to choose the 15th"
        .errorValidators=${[isDateDisabledValidator(d => d.getDate() === 15)]}
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
      <lion-input-datepicker disabled></lion-input-datepicker>
    `,
  );
