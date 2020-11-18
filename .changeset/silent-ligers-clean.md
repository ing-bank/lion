---
'singleton-manager': minor
---

Changed on how to handle multiple instances of the singleton manager

- save the map instance on the window object so multiple singleton manager versions can share the data.
- ignore subsequential set calls if the key is already set (did throw before)
