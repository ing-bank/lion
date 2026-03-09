---
parts:
  - API Table
  - Progress Indicator
title: 'Progress Indicator: API Table'
eleventyNavigation:
  key: API Table >> Progress Indicator
  title: API Table
  order: 90
  parent: Progress Indicator
---
# Progress Indicator: API Table
 

## class: `LionProgressIndicator`, `lion-progress-indicator`

### Fields

| Name                  | Privacy   | Type      | Default | Description                                                                                                                                                              | Inherited From |
| --------------------- | --------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| `indeterminate`       | public    | `boolean` |         |                                                                                                                                                                          |                |
| `max`                 | public    | `number`  | `100`   |                                                                                                                                                                          |                |
| `min`                 | public    | `number`  | `0`     |                                                                                                                                                                          |                |
| `value`               | public    | `number`  | `0`     |                                                                                                                                                                          |                |
| `_ariaLabel`          | public    | `string`  | `''`    |                                                                                                                                                                          |                |
| `_ariaLabelledby`     | public    | `string`  | `''`    |                                                                                                                                                                          |                |
| `_progressPercentage` | protected |           |         | In case of a determinate progress-indicator it returns the progress percentage&#xA;based on value, min & max.&#xA;Could be used for styling inside the \_graphicTemplate |                |

### Methods

| Name                        | Privacy   | Description | Parameters | Return | Inherited From |
| --------------------------- | --------- | ----------- | ---------- | ------ | -------------- |
| `_graphicTemplate`          | protected |             |            |        |                |
| `_resetAriaValueAttributes` | protected |             |            |        |                |
| `_setDefaultLabel`          | protected |             |            |        |                |

### Attributes

| Name              | Field            | Inherited From |
| ----------------- | ---------------- | -------------- |
| `value`           | value            |                |
| `min`             | min              |                |
| `max`             | max              |                |
| `aria-label`      | \_ariaLabel      |                |
| `aria-labelledby` | \_ariaLabelledby |                |

<hr/>
