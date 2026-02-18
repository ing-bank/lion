export { OverlaysManager } from '../components/overlays/src/OverlaysManager.js';

export { OverlayController } from '../components/overlays/src/OverlayController.js';
export { OverlayMixin } from '../components/overlays/src/OverlayMixin.js';
export { ArrowMixin } from '../components/overlays/src/ArrowMixin.js';

export { withBottomSheetConfig } from '../components/overlays/src/configurations/withBottomSheetConfig.js';
export { withModalDialogConfig } from '../components/overlays/src/configurations/withModalDialogConfig.js';
export { withDropdownConfig } from '../components/overlays/src/configurations/withDropdownConfig.js';
export { withTooltipConfig } from '../components/overlays/src/configurations/withTooltipConfig.js';

export { deepContains } from '../components/overlays/src/utils/deep-contains.js';
// re-export via this entrypoint for backwards compatibility
export { getDeepActiveElement } from '../components/core/src/getDeepActiveElement.js';
export { getFocusableElements } from '../components/overlays/src/utils/get-focusable-elements.js';
export {
  unsetSiblingsInert,
  setSiblingsInert,
} from '../components/overlays/src/utils/inert-siblings.js';

export { overlays } from '../components/overlays/src/singleton.js';
