---
'@lion/collapsible': patch
'@lion/form-core': patch
'@lion/helpers': patch
'@lion/listbox': patch
'@lion/overlays': patch
'@lion/pagination': patch
---

Always use CSSResultArray for styles getters and be consistent. This makes typing for subclassers significantly easier. Also added some fixes for missing types in mixins where the superclass was not typed properly. This highlighted some issues with incomplete mixin contracts
