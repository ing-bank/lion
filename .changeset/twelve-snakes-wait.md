---
'@lion/ui': patch
---

Overlay System uses `<dialog>` for top layer functionality of all overlays.
This means overlays positioned relative to viewport won't be moved to the body.

This has many benefits for the App Developer:

- "context" will be kept:
  - css variables and parts/theme will work
  - events work without the need for "repropagation" (from body to original context)
  - accessibility relations between overlay content and its context do not get lost
- initial renderings become more predictable (since we don't need multiple initializations on multiple connectedCallbacks)
- performance: less initialization, thus better performance
- maintainability: handling all edge cases involved in moving an overlay to the body grew out of hand
- developer experience:
  - no extra container components like overlay-frame/calendar-frame needed that maintain styles
  - adding a contentWrapperNode is not needed anymore

There could be small differences in timings though (usually we're done rendering quicker now).
Code that relies on side effects could be affected. Like:

- the existence of a global Root node)
- the fact that global styles would reach a dialog placed in the body

For most users using either OverlayController, OverlayMixin or an element that uses OverlayMixin (like LionInputDatepicker, LionRichSelect etc. etc.)
nothing will change in the public api.
