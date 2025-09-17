---
'singleton-manager': minor
---

Add `lazifyInstantiation` method to singleton-manager. It will help create side-effect-free app setups, avoiding hosisting problems during bundling conflicts and/or long-winded, multi-file setup logic.
