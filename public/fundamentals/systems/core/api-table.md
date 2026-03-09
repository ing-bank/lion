---
parts:
  - API Table
  - Core
  - Systems
title: 'Core: API Table'
eleventyNavigation:
  key: API Table >> Core >> Systems
  title: API Table
  order: 90
  parent: Systems >> Core
---
# Core: API Table
 

## class: `EventTargetShim`

### Fields

| Name                  | Privacy | Type | Default                        | Description | Inherited From |
| --------------------- | ------- | ---- | ------------------------------ | ----------- | -------------- |
| `addEventListener`    | public  |      | `delegatedAddEventListener`    |             |                |
| `dispatchEvent`       | public  |      | `delegatedDispatchEvent`       |             |                |
| `removeEventListener` | public  |      | `delegatedRemoveEventListener` |             |                |

<hr/>
 

## class: `ScopedStylesController`

### Fields

| Name          | Privacy | Type | Default                                                             | Description | Inherited From |
| ------------- | ------- | ---- | ------------------------------------------------------------------- | ----------- | -------------- |
| `scopedClass` | public  |      | `` `${this.host.localName}-${Math.floor(Math.random() * 10000)}` `` |             |                |

### Methods

| Name            | Privacy | Description | Parameters | Return | Inherited From |
| --------------- | ------- | ----------- | ---------- | ------ | -------------- |
| `hostConnected` | public  |             |            |        |                |

<hr/>
