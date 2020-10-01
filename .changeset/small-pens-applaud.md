---
'@lion/fieldset': patch
'@lion/form-core': patch
'@lion/input': patch
'@lion/select': patch
'@lion/switch': patch
'@lion/textarea': patch
---

Refactor of some fields to ensure that \_inputNode has the right type. It starts as HTMLElement for LionField, and all HTMLInputElement, HTMLSelectElement and HTMLTextAreaElement logic, are moved to the right places.
