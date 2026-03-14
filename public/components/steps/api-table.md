---
parts:
  - API Table
  - Steps
title: 'Steps: API Table'
eleventyNavigation:
  key: API Table >> Steps
  title: API Table
  order: 90
  parent: Steps
---
# Steps: API Table
 

## class: `LionStep`, `lion-step`

### Fields

| Name              | Privacy | Type      | Default       | Description                                                                                                                                                                                                                     | Inherited From |
| ----------------- | ------- | --------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `condition`       | public  |           |               | The funtion which us run to check if this step can be transitioned to.&#xA;Takes lion-steps data as a first argument \`myConditionFunc(data)\`.                                                                                 |                |
| `forwardOnly`     | public  | `boolean` | `false`       | Allows transition to step only in forward direction. Skips it if transitioned back.&#xA;May be useful if the step is only showing some messages and does data loading and&#xA;then makes transition to next step automatically. |                |
| `initialStep`     | public  | `boolean` | `false`       | If set this step will be the initially enabled step&#xA;There should be only ONE intial step in each steps                                                                                                                      |                |
| `invertCondition` | public  | `boolean` | `false`       | Allows to invert condition function result.                                                                                                                                                                                     |                |
| `status`          | public  | `string`  | `'untouched'` | Step status, one of: "untouched", "entered", "left", "skipped".                                                                                                                                                                 |                |

### Methods

| Name              | Privacy | Description | Parameters     | Return | Inherited From |
| ----------------- | ------- | ----------- | -------------- | ------ | -------------- |
| `enter`           | public  |             |                |        |                |
| `leave`           | public  |             |                |        |                |
| `passesCondition` | public  |             | `data: Object` |        |                |
| `skip`            | public  |             |                |        |                |

### Events

| Name    | Type          | Description | Inherited From |
| ------- | ------------- | ----------- | -------------- |
| `enter` | `CustomEvent` |             |                |
| `leave` | `CustomEvent` |             |                |
| `skip`  | `CustomEvent` |             |                |

### Attributes

| Name               | Field           | Inherited From |
| ------------------ | --------------- | -------------- |
| `status`           | status          |                |
| `invert-condition` | invertCondition |                |
| `forward-only`     | forwardOnly     |                |
| `initial-step`     | initialStep     |                |

<hr/>
 

## class: `LionSteps`, `lion-steps`

### Fields

| Name                   | Privacy   | Type                 | Default | Description                                                                                                                 | Inherited From |
| ---------------------- | --------- | -------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `current`              | public    | `number`             | `0`     | Number of the current entered step.                                                                                         |                |
| `data`                 | public    | `{[key: string]: ?}` | `{}`    | Storage for data gathered across different steps.&#xA;Data is passed into each step condition function as a first argument. |                |
| `steps`                | public    |                      |         |                                                                                                                             |                |
| `_internalCurrentSync` | protected | `boolean`            | `true`  |                                                                                                                             |                |
| `_max`                 | protected | `number`             | `0`     |                                                                                                                             |                |

### Methods

| Name                       | Privacy   | Description | Parameters                                                                                   | Return | Inherited From |
| -------------------------- | --------- | ----------- | -------------------------------------------------------------------------------------------- | ------ | -------------- |
| `next`                     | public    |             |                                                                                              |        |                |
| `previous`                 | public    |             |                                                                                              |        |                |
| `_changeStep`              | protected |             | `newCurrent: number, oldCurrent: number`                                                     |        |                |
| `_dispatchTransitionEvent` | protected |             | `fromStep: {number: number, element: LionStep}, toStep: {number: number, element: LionStep}` |        |                |
| `_goTo`                    | protected |             | `newCurrent: number, oldCurrent: number`                                                     |        |                |
| `_onCurrentChanged`        | protected |             | `newValues: {current: number}, oldValues: {current: number}`                                 |        |                |

### Events

| Name         | Type          | Description | Inherited From |
| ------------ | ------------- | ----------- | -------------- |
| `transition` | `CustomEvent` |             |                |

### Attributes

| Name      | Field   | Inherited From |
| --------- | ------- | -------------- |
| `data`    | data    |                |
| `current` | current |                |

<hr/>
