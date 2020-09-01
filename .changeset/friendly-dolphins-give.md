---
'@lion/overlays': minor
'@lion/select-rich': minor
'@lion/dialog': minor
'@lion/input-datepicker': minor
'@lion/tooltip': minor
'@lion/form-integrations': minor
---

- Make the OverlayController constructor phase synchronous.
- Trigger a setup of the OverlayController on every connectedCallback
- Execute a new OverlayController after (shadowDom) rendering of the element is done
- Teardown the OverlayController on every disconnectedCallback
- This means moving a dialog triggers teardown in the old location and setup in the new location
- Restore the original light dom (if needed) in the teardown phase of the OverlayController
