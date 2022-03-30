# Calendar >> Overview ||10

A reusable and accessible calendar view web component.

```js script
import { html, css } from '@mdjs/mdjs-preview';
import '@lion/calendar/define';
```

```js preview-story
export const main = () => {
  return html`
    <style>
      .demo-calendar {
        border: 1px solid #adadad;
        box-shadow: 0 0 16px #ccc;
        max-width: 500px;
      }
    </style>
    <lion-calendar class="demo-calendar"></lion-calendar>
  `;
};
```

## Features

- fully accessible keyboard navigation (Arrow Keys, PgUp, PgDn, ALT+PgUp, ALT+PgDn)
- **minDate**: disables all dates before a given date
- **maxDate**: disables all dates after a given date
- **disableDates**: disables some dates within an available range
- **selectedDate**: currently selected date
- **centralDate**: date that determines the currently visible month and that will be focused when keyboard moves the focus to the month grid
- **focusedDate**: (getter only) currently focused date (if there is any with real focus)
- **focusDate(date)**: focus on a certain date
- **focusSelectedDate()**: focus on the current selected date
- **focusCentralDate()**: focus on the current central date
- **firstDayOfWeek**: typically Sunday (default) or Monday
- **weekdayHeaderNotation**: long/short/narrow for the current locale (e.g. Thursday/Thu/T)
- **locale**: different locale for the current component only

## Installation

```bash
npm i --save @lion/calendar
```

```js
import '@lion/calendar/define';
```
