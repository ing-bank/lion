---
parts:
  - API Table
  - Icon
title: 'Icon: API Table'
eleventyNavigation:
  key: API Table >> Icon
  title: API Table
  order: 90
  parent: Icon
---
# Icon: API Table
 

## class: `LionIcon`, `lion-icon`

### Fields

| Name           | Privacy   | Type                                   | Default | Description                                                                                                                  | Inherited From |
| -------------- | --------- | -------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `ariaLabel`    | public    | `string`                               | `''`    |                                                                                                                              |                |
| `iconId`       | public    | `string`                               | `''`    |                                                                                                                              |                |
| `svg`          | public    | `TemplateResult\|nothing\|TagFunction` |         | On IE11, svgs without focusable false appear in the tab order&#xA;so make sure to have \<svg focusable="false"> in svg files |                |
| `_iconManager` | protected |                                        |         |                                                                                                                              |                |

### Methods

| Name               | Privacy   | Description | Parameters                             | Return | Inherited From |
| ------------------ | --------- | ----------- | -------------------------------------- | ------ | -------------- |
| `_onIconIdChanged` | protected |             | `prevIconId: string`                   |        |                |
| `_onLabelChanged`  | protected |             |                                        |        |                |
| `_renderSvg`       | protected |             | `svgObject: TemplateResult \| nothing` |        |                |

### Attributes

| Name         | Field     | Inherited From |
| ------------ | --------- | -------------- |
| `aria-label` | ariaLabel |                |
| `icon-id`    | iconId    |                |

<hr/>
