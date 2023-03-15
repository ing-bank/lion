---
'@lion/ui': patch
---

lion-accordion: changed selectors for invokers and content to only select slotted elements that are direct descendants. This is to prevent that slotted elements in accordion content and invokers are also selected and the amount of invokers and content is incorrect
