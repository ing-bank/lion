import { css } from '@lion/core';
import { OverlayController, withBottomSheetConfig, withModalDialogConfig } from '@lion/overlays';
import { LionSelectRich } from '@lion/select-rich';
// import { IngFieldMixin } from '../field-mixin/IngFieldMixin.js';
import './ing-select-account-invoker.js';

/**
 * # <ing-select-account> web component
 *
 * @customElement ing-select-account
 * @extends LionSelectRich
 */
export class IngSelectAccount extends LionSelectRich {
  static get styles() {
    return [
      super.styles,
      css`
        ::slotted([slot="invoker"]) {
          width: 100%;
        }

        .input-group__container > .input-group__input ::slotted(.form-control) {
          height: auto;
          padding: 0;
        }
      `,
    ];
  }

  get slots() {
    return {
      ...super.slots,
      invoker: () => document.createElement('ing-select-account-invoker'),
    };
  }

  /**
   * @override
   * @returns {OverlayController}
   */
  // eslint-disable-next-line class-methods-use-this
  _defineOverlay({ contentNode, invokerNode }) {
    const ctrl = new OverlayController({
      ...withBottomSheetConfig(),
      hidesOnOutsideClick: true,
      invokerNode,
      contentNode,
    });

    ctrl.addEventListener('before-show', () => {
      if (window.innerWidth >= 600) {
        ctrl.updateConfig(withModalDialogConfig());
      } else {
        ctrl.updateConfig(withBottomSheetConfig());
      }
    });

    return ctrl;
  }
}
