// Backwards compatible deep import. The implementation lives in the disclosure-system package now;
// this path keeps working for consumers (and for the generated types of menu/ and input-*-dropdown)
// that import `overlays/src/OverlayController.js` directly.
export { DisclosureController as OverlayController } from '../../disclosure-system/src/DisclosureController.js';
