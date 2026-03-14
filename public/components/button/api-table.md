---
parts:
  - API Table
  - Button
title: 'Button: API Table'
eleventyNavigation:
  key: API Table >> Button
  title: API Table
  order: 90
  parent: Button
---
# Button: API Table
 

## class: `LionButton`, `lion-button`

### Fields

| Name                     | Privacy   | Type      | Default    | Description | Inherited From            |
| ------------------------ | --------- | --------- | ---------- | ----------- | ------------------------- |
| `active`                 | public    | `boolean` | `false`    |             |                           |
| `disabled`               | public    | `boolean` | `false`    |             | DisabledMixin             |
| `tabIndex`               | public    | `number`  |            |             | DisabledWithTabIndexMixin |
| `type`                   | public    | `string`  | `'button'` |             |                           |
| `_requestedToBeDisabled` | protected | `boolean` | `false`    |             | DisabledMixin             |

### Methods

| Name                         | Privacy | Description | Parameters | Return | Inherited From |
| ---------------------------- | ------- | ----------- | ---------- | ------ | -------------- |
| `click`                      | public  |             |            |        | DisabledMixin  |
| `makeRequestToBeDisabled`    | public  |             |            |        | DisabledMixin  |
| `retractRequestToBeDisabled` | public  |             |            |        | DisabledMixin  |

### Attributes

| Name       | Field    | Inherited From            |
| ---------- | -------- | ------------------------- |
| `active`   | active   |                           |
| `type`     | type     |                           |
| `tabindex` | tabIndex | DisabledWithTabIndexMixin |
| `disabled` | disabled | DisabledMixin             |

<hr/>
 

## class: `LionButtonReset`, `lion-button-reset`

### Fields

| Name                     | Privacy   | Type      | Default   | Description | Inherited From |
| ------------------------ | --------- | --------- | --------- | ----------- | -------------- |
| `active`                 | public    | `boolean` | `false`   |             | LionButton     |
| `disabled`               | public    | `boolean` | `false`   |             | LionButton     |
| `tabIndex`               | public    | `number`  |           |             | LionButton     |
| `type`                   | public    | `string`  | `'reset'` |             | LionButton     |
| `_requestedToBeDisabled` | protected | `boolean` | `false`   |             | LionButton     |

### Methods

| Name                                          | Privacy   | Description | Parameters | Return | Inherited From |
| --------------------------------------------- | --------- | ----------- | ---------- | ------ | -------------- |
| `click`                                       | public    |             |            |        | LionButton     |
| `makeRequestToBeDisabled`                     | public    |             |            |        | LionButton     |
| `retractRequestToBeDisabled`                  | public    |             |            |        | LionButton     |
| `_setupSubmitAndResetHelperOnConnected`       | protected |             |            |        |                |
| `_teardownSubmitAndResetHelperOnDisconnected` | protected |             |            |        |                |

### Attributes

| Name       | Field    | Inherited From |
| ---------- | -------- | -------------- |
| `tabindex` | tabIndex | LionButton     |
| `disabled` | disabled | LionButton     |
| `active`   | active   | LionButton     |
| `type`     | type     | LionButton     |

<hr/>
 

## class: `LionButtonSubmit`, `lion-button-submit`

### Fields

| Name                     | Privacy   | Type                      | Default    | Description | Inherited From |
| ------------------------ | --------- | ------------------------- | ---------- | ----------- | -------------- |
| `active`                 | public    | `boolean`                 | `false`    |             | LionButton     |
| `disabled`               | public    | `boolean`                 | `false`    |             | LionButton     |
| `tabIndex`               | public    | `number`                  |            |             | LionButton     |
| `type`                   | public    | `string`                  | `'submit'` |             | LionButton     |
| `_nativeButtonNode`      | protected | `HTMLButtonElement\|null` |            |             |                |
| `_requestedToBeDisabled` | protected | `boolean`                 | `false`    |             | LionButton     |

### Methods

| Name                                          | Privacy   | Description | Parameters | Return | Inherited From  |
| --------------------------------------------- | --------- | ----------- | ---------- | ------ | --------------- |
| `click`                                       | public    |             |            |        | LionButton      |
| `makeRequestToBeDisabled`                     | public    |             |            |        | LionButton      |
| `retractRequestToBeDisabled`                  | public    |             |            |        | LionButton      |
| `_setupSubmitAndResetHelperOnConnected`       | protected |             |            |        | LionButtonReset |
| `_teardownSubmitAndResetHelperOnDisconnected` | protected |             |            |        | LionButtonReset |

### Attributes

| Name       | Field    | Inherited From |
| ---------- | -------- | -------------- |
| `tabindex` | tabIndex | LionButton     |
| `disabled` | disabled | LionButton     |
| `active`   | active   | LionButton     |
| `type`     | type     | LionButton     |

<hr/>
