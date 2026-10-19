export { OverlaysManager } from '../components/disclosure-system/src/OverlaysManager.js';

// export { OverlayController } from '../components/overlays/src/OverlayController.js';
export { DisclosureController as OverlayController } from '../components/disclosure-system/src/DisclosureController.js';
export { OverlayMixin } from '../components/disclosure-system/src/OverlayMixin.js';
export { ArrowMixin } from '../components/disclosure-system/src/ArrowMixin.js';

export { withBottomSheetConfig } from '../components/disclosure-system/src/configurations/withBottomSheetConfig.js';
export { withModalDialogConfig } from '../components/disclosure-system/src/configurations/withModalDialogConfig.js';
export { withDropdownConfig } from '../components/disclosure-system/src/configurations/withDropdownConfig.js';
export { withTooltipConfig } from '../components/disclosure-system/src/configurations/withTooltipConfig.js';
export { withPopoverConfig } from '../components/disclosure-system/src/configurations/withPopoverConfig.js';
export { withClickInteraction } from '../components/disclosure-system/src/configurations/visibility-trigger-partials/withClickInteraction.js';
export { withHoverInteraction } from '../components/disclosure-system/src/configurations/visibility-trigger-partials/withHoverInteraction.js';

export { deepContains } from '../components/disclosure-system/src/utils/deep-contains.js';
// re-export via this entrypoint for backwards compatibility
export { getDeepActiveElement } from '../components/core/src/getDeepActiveElement.js';
export { getFocusableElements } from '../components/disclosure-system/src/utils/get-focusable-elements.js';
export {
  unsetSiblingsInert,
  setSiblingsInert,
} from '../components/overlays/src/utils/inert-siblings.js';

// export { overlays } from '../components/overlays/src/singleton.js';
export { overlays } from '../components/disclosure-system/src/singleton.js';

/**
 * @typedef {import('../components/overlays/types/OverlayConfig.js').OverlayConfig} OverlayConfig
 */
