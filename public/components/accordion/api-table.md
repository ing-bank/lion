---
parts:
  - API Table
  - Accordion
title: 'Accordion: API Table'
eleventyNavigation:
  key: API Table >> Accordion
  title: API Table
  order: 90
  parent: Accordion
---
# Accordion: API Table
 

## class: `LionAccordion`, `lion-accordion`

### Fields

| Name           | Privacy | Type      | Default | Description                                                            | Inherited From |
| -------------- | ------- | --------- | ------- | ---------------------------------------------------------------------- | -------------- |
| `exclusive`    | public  | `boolean` | `false` | exclusive property allows only one accordion slot to be open at a time |                |
| `expanded`     | public  | `array`   |         | array of indices of the expanded accordions                            |                |
| `focusedIndex` | public  | `number`  |         | index number of the focused accordion                                  |                |

### Methods

| Name              | Privacy   | Description | Parameters          | Return | Inherited From |
| ----------------- | --------- | ----------- | ------------------- | ------ | -------------- |
| `_cleanInvoker`   | protected |             | `entry: StoreEntry` |        |                |
| `_collapse`       | protected |             | `entry: StoreEntry` |        |                |
| `_expand`         | protected |             | `entry: StoreEntry` |        |                |
| `_focusInvoker`   | protected |             | `entry: StoreEntry` |        |                |
| `_setupContent`   | protected |             | `entry: StoreEntry` |        |                |
| `_setupInvoker`   | protected |             | `entry: StoreEntry` |        |                |
| `_unfocusInvoker` | protected |             | `entry: StoreEntry` |        |                |

### Attributes

| Name           | Field        | Inherited From |
| -------------- | ------------ | -------------- |
| `focusedIndex` | focusedIndex |                |
| `expanded`     | expanded     |                |
| `exclusive`    | exclusive    |                |

### Slots

| Name         | Description                                                        |
| ------------ | ------------------------------------------------------------------ |
| `invoker`    | The invoker element for the accordion                              |
| `content`    | The content element for the accordion                              |
| `_accordion` | The slot for the accordion, used to rearrange invokers and content |

<hr/>
