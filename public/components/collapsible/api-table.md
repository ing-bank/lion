---
parts:
  - API Table
  - Collapsible
title: 'Collapsible: API Table'
eleventyNavigation:
  key: API Table >> Collapsible
  title: API Table
  order: 90
  parent: Collapsible
---
# Collapsible: API Table
 

## class: `LionCollapsible`, `lion-collapsible`

### Fields

| Name             | Privacy   | Type      | Default | Description | Inherited From |
| ---------------- | --------- | --------- | ------- | ----------- | -------------- |
| `opened`         | public    | `boolean` | `false` |             |                |
| `_contentHeight` | protected |           |         |             |                |
| `_contentNode`   | protected |           |         |             |                |
| `_invokerNode`   | protected |           |         |             |                |

### Methods

| Name             | Privacy   | Description                                   | Parameters     | Return | Inherited From |
| ---------------- | --------- | --------------------------------------------- | -------------- | ------ | -------------- |
| `hide`           | public    | Hide extra content.                           |                |        |                |
| `show`           | public    | Show extra content.                           |                |        |                |
| `toggle`         | public    | Toggle the current(opened/closed) state.      |                |        |                |
| `_hideAnimation` | protected | Hide animation implementation in sub-classer. | `opts: Object` |        |                |
| `_showAnimation` | protected | Show animation implementation in sub-classer. | `opts: Object` |        |                |

### Events

| Name             | Type          | Description | Inherited From |
| ---------------- | ------------- | ----------- | -------------- |
| `opened-changed` | `CustomEvent` |             |                |

### Attributes

| Name     | Field  | Inherited From |
| -------- | ------ | -------------- |
| `opened` | opened |                |

### Slots

| Name      | Description                             |
| --------- | --------------------------------------- |
| `invoker` | The invoker element for the collapsible |
| `content` | The content element for the collapsible |

<hr/>
