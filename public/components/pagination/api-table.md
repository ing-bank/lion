---
parts:
  - API Table
  - Pagination
title: 'Pagination: API Table'
eleventyNavigation:
  key: API Table >> Pagination
  title: API Table
  order: 90
  parent: Pagination
---
# Pagination: API Table
 

## class: `LionPagination`, `lion-pagination`

### Fields

| Name      | Privacy | Type     | Default | Description | Inherited From |
| --------- | ------- | -------- | ------- | ----------- | -------------- |
| `count`   | public  | `number` | `0`     |             |                |
| `current` | public  | `number` | `1`     |             |                |

### Methods

| Name                      | Privacy   | Description                                                                                                      | Parameters                                             | Return             | Inherited From |
| ------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------ | -------------- |
| `first`                   | public    | Go to first page                                                                                                 |                                                        |                    |                |
| `goto`                    | public    | Go to the specific page                                                                                          | `pageNumber: number`                                   |                    |                |
| `last`                    | public    | Go to the last page                                                                                              |                                                        |                    |                |
| `next`                    | public    | Go next in pagination                                                                                            |                                                        |                    |                |
| `previous`                | public    | Go back in pagination                                                                                            |                                                        |                    |                |
| `_disabledButtonTemplate` | protected | Get disabled button template.&#xA;This method can be overridden to apply customized template in wrapper.         | `label: String`                                        | `TemplateResult`   |                |
| `_prevNextButtonTemplate` | protected | Get next or previous button template.&#xA;This method can be overridden to apply customized template in wrapper. | `label: String, pageNumber: Number, namespace: String` | `TemplateResult`   |                |
| `_prevNextIconTemplate`   | protected | Get previous or next button template.&#xA;This method can be overridden to apply customized template in wrapper. | `label: String`                                        | `TemplateResult`   |                |
| `_renderNavList`          | protected | Render navigation list                                                                                           |                                                        | `TemplateResult[]` |                |

### Attributes

| Name      | Field   | Inherited From |
| --------- | ------- | -------------- |
| `current` | current |                |
| `count`   | count   |                |

<hr/>
