---
'@lion/ui': patch
---

OverlayController: fix `TypeError` (`appendChild` argument is not a Node) when a `contentWrapperNode` that is not connected yet (e.g. in a host that is not attached to the document) wraps a projected slot and the controller is re-initialized via `updateConfig`. The relocated slot is now captured before the DOM is mutated and restored at its original position on cleanup.
