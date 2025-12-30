---
'@lion/ui': minor
---

[SlotMixin] Throw a user-friendly error when SlotMixin is used without a shadowRoot instead of logging to console. This helps developers quickly identify the issue when they accidentally use SlotMixin in a component that overrides createRenderRoot() to return 'this'.
