---
parts:
  - API Table
  - Dialog
title: 'Dialog: API Table'
eleventyNavigation:
  key: API Table >> Dialog
  title: API Table
  order: 90
  parent: Dialog
---
# Dialog: API Table
 

## class: `LionDialog`, `lion-dialog`

### Fields

| Name                         | Privacy   | Type                     | Default | Description                                                                                                                                                           | Inherited From |
| ---------------------------- | --------- | ------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `config`                     | public    | `Partial<OverlayConfig>` | `{}`    | Configure the many options of the \`OverlayController\`                                                                                                               | OverlayMixin   |
| `isAlertDialog`              | public    | `boolean`                | `false` |                                                                                                                                                                       |                |
| `opened`                     | public    | `boolean`                | `false` | If you add the opened attribute a dialog will be opened on page load. The invoker can be left out&#xA;in case the user does not need to be able to reopen the dialog. | OverlayMixin   |
| `_overlayBackdropNode`       | protected |                          |         |                                                                                                                                                                       | OverlayMixin   |
| `_overlayContentNode`        | protected |                          |         |                                                                                                                                                                       | OverlayMixin   |
| `_overlayContentWrapperNode` | protected |                          |         |                                                                                                                                                                       | OverlayMixin   |
| `_overlayInvokerNode`        | protected |                          |         |                                                                                                                                                                       | OverlayMixin   |
| `_overlayReferenceNode`      | protected |                          |         |                                                                                                                                                                       | OverlayMixin   |

### Methods

| Name                               | Privacy   | Description                                                                                                                                                                                                                                                                                                                | Parameters                                                                                                   | Return              | Inherited From |
| ---------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------- | -------------- |
| `close`                            | public    | Hides the overlay                                                                                                                                                                                                                                                                                                          |                                                                                                              |                     | OverlayMixin   |
| `open`                             | public    | Shows the overlay                                                                                                                                                                                                                                                                                                          |                                                                                                              |                     | OverlayMixin   |
| `repositionOverlay`                | public    | Sometimes it's needed to recompute Popper position of an overlay, for instance when we have&#xA;an opened combobox and the surrounding context changes (the space consumed by the textbox&#xA;increases vertically)                                                                                                        |                                                                                                              |                     | OverlayMixin   |
| `toggle`                           | public    | Toggles the overlay                                                                                                                                                                                                                                                                                                        |                                                                                                              |                     | OverlayMixin   |
| `_defineOverlay`                   | protected |                                                                                                                                                                                                                                                                                                                            | `{ contentNode, invokerNode, referenceNode, backdropNode, contentWrapperNode }, config: DefineOverlayConfig` | `OverlayController` | OverlayMixin   |
| `_defineOverlayConfig`             | protected |                                                                                                                                                                                                                                                                                                                            |                                                                                                              | `OverlayConfig`     | OverlayMixin   |
| `_isPermanentlyDisconnected`       | protected | When we're moving around in dom, disconnectedCallback gets called.&#xA;Before we decide to teardown, let's wait to see if we were not just moving nodes around.                                                                                                                                                            |                                                                                                              | `Promise<boolean>`  | OverlayMixin   |
| `_setOpenedWithoutPropertyEffects` | protected | When the opened state is changed by an Application Developer,cthe OverlayController is&#xA;requested to show/hide. It might happen that this request is not honoured&#xA;(intercepted in before-hide for instance), so that we need to sync the controller state&#xA;to this webcomponent again, preventing eternal loops. | `newOpened: boolean`                                                                                         |                     | OverlayMixin   |
| `_setupOpenCloseListeners`         | protected |                                                                                                                                                                                                                                                                                                                            |                                                                                                              |                     | OverlayMixin   |
| `_setupOverlayCtrl`                | protected |                                                                                                                                                                                                                                                                                                                            |                                                                                                              |                     | OverlayMixin   |
| `_teardownOpenCloseListeners`      | protected |                                                                                                                                                                                                                                                                                                                            |                                                                                                              |                     | OverlayMixin   |
| `_teardownOverlayCtrl`             | protected |                                                                                                                                                                                                                                                                                                                            |                                                                                                              |                     | OverlayMixin   |

### Events

| Name             | Type          | Description | Inherited From |
| ---------------- | ------------- | ----------- | -------------- |
| `opened-changed` | `CustomEvent` |             | OverlayMixin   |

### Attributes

| Name              | Field         | Inherited From |
| ----------------- | ------------- | -------------- |
| `is-alert-dialog` | isAlertDialog |                |
| `opened`          | opened        | OverlayMixin   |

<hr/>
