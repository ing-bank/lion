---
parts:
  - API Table
  - Calendar
title: 'Calendar: API Table'
eleventyNavigation:
  key: API Table >> Calendar
  title: API Table
  order: 90
  parent: Calendar
---
# Calendar: API Table
 

## class: `LionCalendar`, `lion-calendar`

### Fields

| Name                    | Privacy | Type     | Default                      | Description                                                                                                                                                             | Inherited From |
| ----------------------- | ------- | -------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `centralDate`           | public  | `Date`   |                              | The date that&#xA;1\. determines the currently visible month&#xA;2\. will be focused when the month grid gets focused by the keyboard                                   |                |
| `dayPreprocessor`       | public  |          |                              |                                                                                                                                                                         |                |
| `disableDates`          | public  |          |                              | Disable certain dates                                                                                                                                                   |                |
| `firstDayOfWeek`        | public  | `number` | `0`                          | Weekday that will be displayed in first column of month grid.&#xA;0: sunday, 1: monday, 2: tuesday, 3: wednesday , 4: thursday, 5: friday, 6: saturday&#xA;Default is 0 |                |
| `focusedDate`           | public  |          |                              |                                                                                                                                                                         |                |
| `locale`                | public  | `string` | `''`                         | Different locale for this component scope                                                                                                                               |                |
| `maxDate`               | public  |          | `new Date(8640000000000000)` | Maximum date. All dates after will be disabled                                                                                                                          |                |
| `minDate`               | public  |          | `new Date(0)`                | Minimum date. All dates before will be disabled                                                                                                                         |                |
| `selectedDate`          | public  |          |                              | The selected date, usually synchronized with datepicker-input&#xA;Not to be confused with the focused date (therefore not necessarily in active month view)             |                |
| `weekdayHeaderNotation` | public  | `string` | `'short'`                    | Weekday header notation, based on Intl DatetimeFormat:&#xA;- 'long' (e.g., Thursday)&#xA;- 'short' (e.g., Thu)&#xA;- 'narrow' (e.g., T).&#xA;Default is 'short'         |                |

### Methods

| Name                      | Privacy   | Description                                                                                     | Parameters   | Return | Inherited From |
| ------------------------- | --------- | ----------------------------------------------------------------------------------------------- | ------------ | ------ | -------------- |
| `findNearestEnabledDate`  | public    |                                                                                                 | `date: Date` |        |                |
| `findNextEnabledDate`     | public    |                                                                                                 | `date: Date` |        |                |
| `findPreviousEnabledDate` | public    |                                                                                                 | `date: Date` |        |                |
| `focusCentralDate`        | public    |                                                                                                 |              |        |                |
| `focusDate`               | public    |                                                                                                 | `date: Date` |        |                |
| `focusSelectedDate`       | public    |                                                                                                 |              |        |                |
| `goToNextMonth`           | public    |                                                                                                 |              |        |                |
| `goToNextYear`            | public    |                                                                                                 |              |        |                |
| `goToPreviousMonth`       | public    |                                                                                                 |              |        |                |
| `goToPreviousYear`        | public    |                                                                                                 |              |        |                |
| `initCentralDate`         | public    | This exposes an interface for datepickers that want to&#xA;reinitialize when calendar is opened |              |        |                |
| `_nextIconTemplate`       | protected |                                                                                                 |              |        |                |
| `_previousIconTemplate`   | protected |                                                                                                 |              |        |                |

### Events

| Name                         | Type          | Description | Inherited From |
| ---------------------------- | ------------- | ----------- | -------------- |
| `user-selected-date-changed` | `CustomEvent` |             |                |

<hr/>
