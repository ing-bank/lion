# Calendar

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-calendar` is a reusable and accessible calendar view.

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

## How to use

### Installation

```sh
npm i --save @lion/calendar
```

```js
import '@lion/calendar/lion-calendar.js';
```

### Example

```html
<lion-calendar
  .minDate="${new Date()}"
  .maxDate="${new Date('2019/12/09')}"
  .disableDates=${day => day.getDay() === 6 || day.getDay() === 0}
>
</lion-calendar>
```
