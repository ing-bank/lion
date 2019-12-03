import '@lion/button/lion-button.js';
import { css } from '@lion/core';
import { html, storiesOf } from '@open-wc/demoing-storybook';
import '../lion-calendar.js';

const calendarDemoStyle = css`
  .demo-calendar {
    border: 1px solid #adadad;
    box-shadow: 0 0 16px #ccc;
    max-width: 500px;
  }
`;

storiesOf('Calendar|Standalone')
  .add(
    'default',
    () => html`
      <style>
        ${calendarDemoStyle}
      </style>

      <lion-calendar class="demo-calendar"></lion-calendar>
    `,
  )
  .add('selectedDate', () => {
    const today = new Date();
    const selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return html`
      <style>
        ${calendarDemoStyle}
      </style>

      <lion-calendar class="demo-calendar" .selectedDate="${selectedDate}"></lion-calendar>
    `;
  })
  .add('centralDate', () => {
    const today = new Date();
    const centralDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return html`
      <style>
        ${calendarDemoStyle}
      </style>

      <lion-calendar class="demo-calendar" .centralDate="${centralDate}"></lion-calendar>

      <p>Use TAB to see which date will be focused first.</p>
    `;
  })
  .add('control focus', () => {
    const today = new Date();
    const selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const centralDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return html`
      <style>
        ${calendarDemoStyle}
      </style>

      <lion-calendar
        id="js-demo-calendar"
        class="demo-calendar"
        .selectedDate="${selectedDate}"
        .centralDate="${centralDate}"
      ></lion-calendar>

      <p>
        Focus:
        <lion-button
          @click="${() => document.querySelector('#js-demo-calendar').focusCentralDate()}"
        >
          Central date
        </lion-button>
        <lion-button
          @click="${() => document.querySelector('#js-demo-calendar').focusSelectedDate()}"
        >
          Selected date
        </lion-button>
        <lion-button @click="${() => document.querySelector('#js-demo-calendar').focusDate(today)}">
          Today
        </lion-button>
      </p>

      <p>Be aware that the central date changes when a new date is focused.</p>
    `;
  })
  .add('minDate', () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2);
    return html`
      <style>
        ${calendarDemoStyle}
      </style>

      <lion-calendar class="demo-calendar" .minDate="${minDate}"></lion-calendar>
    `;
  })
  .add('maxDate', () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
    return html`
      <style>
        ${calendarDemoStyle}
      </style>

      <lion-calendar class="demo-calendar" .maxDate="${maxDate}"></lion-calendar>
    `;
  })
  .add(
    'disableDates',
    () => html`
      <style>
        ${calendarDemoStyle}
      </style>

      <lion-calendar
        class="demo-calendar"
        .disableDates=${day => day.getDay() === 6 || day.getDay() === 0}
      ></lion-calendar>
    `,
  )
  .add('combined disabled dates', () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
    return html`
      <style>
        ${calendarDemoStyle}
      </style>

      <lion-calendar
        class="demo-calendar"
        .disableDates=${day => day.getDay() === 6 || day.getDay() === 0}
        .minDate="${new Date()}"
        .maxDate="${maxDate}"
      ></lion-calendar>
    `;
  });
