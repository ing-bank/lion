# Carbon Calendar

Implementation of [Carbon Date Picker](https://www.carbondesignsystem.com/components/date-picker/usage).

```js script
import { html, css } from '@lion/core';
import '@lion/calendar/lion-calendar.js';
import { carbonCalendarStyles } from './styles/carbon-calendar.css.js';

export default {
  title: 'Theming/Calendar',
};
```

```js preview-story
export const carbonCalendar = () => {
  const today = new Date();
  const range = 10;
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - range);
  const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + range);
  const selectedData = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
  const weekendDays = day => day.getDay() === 6 || day.getDay() === 0;

  return html` <div class="carbon">
    <style>
      ${carbonCalendarStyles}
    </style>
    <lion-calendar
      class="carbon"
      .selectedDate=${selectedData}
      .disableDates=${weekendDays}
      .minDate="${minDate}"
      .maxDate="${maxDate}"
    >
      <template class="previous-button-content">
        <svg
          part="previous content"
          focusable="false"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <path d="M10 16L20 6 21.4 7.4 12.8 16 21.4 24.6 20 26z"></path>
          <title>Chevron left</title>
        </svg>
      </template>
      <template class="next-button-content">
        <svg
          part="next content"
          focusable="false"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <path d="M22 16L12 26 10.6 24.6 19.2 16 10.6 7.4 12 6z"></path>
          <title>Chevron right</title>
        </svg>
      </template>
    </lion-calendar>
  </div>`;
};
```
