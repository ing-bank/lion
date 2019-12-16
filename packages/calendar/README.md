# Calendar

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-calendar` is a reusable and accessible calendar view.

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
