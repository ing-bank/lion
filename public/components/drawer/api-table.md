---
parts:
  - API Table
  - Drawer
title: 'Drawer: API Table'
eleventyNavigation:
  key: API Table >> Drawer
  title: API Table
  order: 90
  parent: Drawer
---
# Drawer: API Table
 

## class: `LionDrawer`, `lion-drawer`

### Fields

| Name             | Privacy   | Type      | Default | Description                                                                  | Inherited From  |
| ---------------- | --------- | --------- | ------- | ---------------------------------------------------------------------------- | --------------- |
| `opened`         | public    | `boolean` | `false` |                                                                              | LionCollapsible |
| `position`       | public    | `string`  |         | Setter for position property, available values are 'top', 'left' and 'right' |                 |
| `transitioning`  | public    | `boolean` |         |                                                                              |                 |
| `_contentHeight` | protected |           |         |                                                                              | LionCollapsible |
| `_contentNode`   | protected |           |         |                                                                              | LionCollapsible |
| `_contentWidth`  | protected |           |         |                                                                              |                 |
| `_invokerNode`   | protected |           |         |                                                                              | LionCollapsible |

### Methods

| Name                 | Privacy   | Description                                                    | Parameters                                                                 | Return          | Inherited From  |
| -------------------- | --------- | -------------------------------------------------------------- | -------------------------------------------------------------------------- | --------------- | --------------- |
| `hide`               | public    | Hide extra content.                                            |                                                                            |                 | LionCollapsible |
| `show`               | public    | Show extra content.                                            |                                                                            |                 | LionCollapsible |
| `toggle`             | public    | Toggle the current(opened/closed) state.                       |                                                                            |                 | LionCollapsible |
| `_hideAnimation`     | protected | Trigger hide animation and wait for transition to be finished. | `{ contentNode }, options: @param {HTMLElement} options.contentNode    * ` |                 | LionCollapsible |
| `_openedChanged`     | protected |                                                                |                                                                            |                 |                 |
| `_showAnimation`     | protected | Trigger show animation and wait for transition to be finished. | `{ contentNode }, options: @param {HTMLElement} options.contentNode    * ` |                 | LionCollapsible |
| `_updateContentSize` | protected |                                                                |                                                                            |                 |                 |
| `_waitForTransition` | protected | Wait until the transition event is finished.                   | `{ contentNode }, options: @param {HTMLElement} options.contentNode    * ` | `Promise<void>` |                 |

### Events

| Name             | Type          | Description | Inherited From  |
| ---------------- | ------------- | ----------- | --------------- |
| `opened-changed` | `CustomEvent` |             | LionCollapsible |

### Attributes

| Name            | Field         | Inherited From  |
| --------------- | ------------- | --------------- |
| `transitioning` | transitioning |                 |
| `opened`        | opened        | LionCollapsible |
| `position`      | position      |                 |

### Slots

| Name       | Description                         |
| ---------- | ----------------------------------- |
| `invoker`  | The invoker element for the drawer  |
| `content`  | The content element for the drawer  |
| `headline` | The headline element for the drawer |

<hr/>
