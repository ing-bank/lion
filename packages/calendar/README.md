# Calendar

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-calendar` is a reusable and accessible calendar view.

## Features

- fully accessible keyboard navigation (Arrow Keys, PgUp, PgDn, ALT+PgUp, ALT+PgDn)
- supports multiple ways to disable dates (min/max and custom disabled function)
- allows different headers (e.g. define first day of the weeks or which notation to use)

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/) for a live demo and API documentation

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
