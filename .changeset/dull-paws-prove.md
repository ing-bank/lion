---
'@lion/listbox': patch
---

Fix listbox to take into account that offsetTop by itself may not be sufficient with regards to scrolling active options in view when the page contains sticky or fixed elements blocking the view.
