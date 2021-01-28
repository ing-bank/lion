---
'@lion/form': patch
---

Dispatch submit event on native form node instead of calling submit() directly, which circumvents lion-form submit logic and will always do a page reload and cannot be stopped by the user.
