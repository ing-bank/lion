---
'@lion/ui': patch
---

lion-select-rich: when the overlay is shown, the "autofocus" attribute is added to \_listboxNode (\_inputNode) to make sure that keyboard navigation continues to work when the element is inside a bottomsheet. When the overlay is closed the attribute is removed.
