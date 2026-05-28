import { LionMenuOverlay } from './LionMenuOverlay.js';

/**
 * LionMenuHybrid allows to choose whether the menu opens as overlay or as disclosure.
 */

// TODO: remove
// @ts-ignore - class extension properties mismatch
export class LionMenuHybrid extends LionMenuOverlay {
  static get properties() {
    return {
      openableMode: { type: String, attribute: 'openable-mode' },
    };
  }

  constructor() {
    super();

    // By default, we go for disclosure behavior
    // a TODO: in the future, bring disclosure behavior to a controller (and therefore directive).
    // Take inspiration from VisibilityToggleCtrl of portal elements
    /**
     * Terminology aligned with https://open-ui.org/components/openable.explainer/
     * @type {'tabbable-disclosure'|'overlay'}
     */
    this.openableMode = 'tabbable-disclosure';

    this._shouldSetupOverlay = false;
  }

  /**
   * @param {import('lit').PropertyValues} changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('openableMode')) {
      if (this.openableMode === 'overlay') {
        this._shouldSetupOverlay = true;
        this._setupOverlayCtrl();
      } else {
        this._teardownOverlayCtrl();
      }
    }
  }
}
