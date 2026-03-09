---
parts:
  - API Table
  - Tabs
title: 'Tabs: API Table'
eleventyNavigation:
  key: API Table >> Tabs
  title: API Table
  order: 90
  parent: Tabs
---
# Tabs: API Table
 

## class: `LionTabs`, `lion-tabs`

### Fields

| Name            | Privacy   | Type     | Default | Description                         | Inherited From |
| --------------- | --------- | -------- | ------- | ----------------------------------- | -------------- |
| `panels`        | public    |          |         |                                     |                |
| `selectedIndex` | public    | `number` | `0`     | An index number of the selected tab |                |
| `tabs`          | public    |          |         |                                     |                |
| `_pairCount`    | protected |          |         |                                     |                |

### Methods

| Name                         | Privacy   | Description | Parameters      | Return | Inherited From |
| ---------------------------- | --------- | ----------- | --------------- | ------ | -------------- |
| `_setSelectedIndexWithFocus` | protected |             | `value: number` |        |                |

### Events

| Name               | Type    | Description | Inherited From |
| ------------------ | ------- | ----------- | -------------- |
| `selected-changed` | `Event` |             |                |

### Attributes

| Name             | Field         | Inherited From |
| ---------------- | ------------- | -------------- |
| `selected-index` | selectedIndex |                |

### Slots

| Name    | Description                     |
| ------- | ------------------------------- |
| `tab`   | The tab elements for the tabs   |
| `panel` | The panel elements for the tabs |

<hr/>
