/* eslint-disable max-classes-per-file */
import { html, dedupeMixin } from '@lion/core';
import { OverlayMixin, withDropdownConfig } from '@lion/overlays';
import { LionMenu } from './LionMenu.js';
import { InteractiveListMixin } from './InteractiveListMixin.js';

/**
 * Handles integration of InteractiveListMixin and OverlayMixin
 * Will be used by:
 * - LionMenuOverlay
 * - LionCombobox
 * - LionSelectRich
 *
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('@lion/core').LitElement>} superclass
 */
const OverlayWithListInvokerMixinImplementation = superclass =>
  class OverlayWithListInvokerMixin extends OverlayMixin(InteractiveListMixin(superclass)) {
    constructor() {
      super();

      /** @configure DisclosureMixin */
      this.handleFocus = true;

      this._onOverlayBeforeShow = this._onOverlayBeforeShow.bind(this);
      this._onOverlayShow = this._onOverlayShow.bind(this);
      this._onOverlayHide = this._onOverlayHide.bind(this);
    }

    _onOverlayBeforeShow() {}

    _onOverlayShow() {
      if (this.checkedIndex != null) {
        this.activeIndex = this.checkedIndex;
      }
      this._listNode.focus();
    }

    _onOverlayHide() {
      this._overlayInvokerNode.focus();
    }

    /**
     * @enhance OverlayMixin
     */
    _setupOverlayCtrl() {
      super._setupOverlayCtrl();
      this._overlayCtrl.addEventListener('before-show', this._onOverlayBeforeShow);
      this._overlayCtrl.addEventListener('show', this._onOverlayShow);
      this._overlayCtrl.addEventListener('hide', this._onOverlayHide);
    }

    /**
     * @enhance OverlayMixin
     */
    _teardownOverlayCtrl() {
      super._teardownOverlayCtrl();
      this._overlayCtrl.removeEventListener('before-show', this._onOverlayBeforeShow);
      this._overlayCtrl.removeEventListener('show', this._onOverlayShow);
      this._overlayCtrl.removeEventListener('hide', this._onOverlayHide);
    }
  };
export const OverlayWithListInvokerMixin = dedupeMixin(OverlayWithListInvokerMixinImplementation);

export class LionMenuOverlay extends OverlayWithListInvokerMixin(LionMenu) {
  render() {
    return html`
      <slot name="invoker"></slot>
      <div id="overlay-content-node-wrapper">
        <slot name="list"></slot>
      </div>
      <slot id="list-items-outlet"></slot>
    `;
  }

  _defineOverlayConfig() {
    const { parentMenu: parentList } = this;
    let placement = 'bottom-start';
    if (parentList && parentList.orientation !== 'horizontal') {
      placement = 'right-start';
    }

    const menuConfig = {};
    // if (this._activeMode === 'activedescendant') {
    //   menuConfig.elementToFocusAfterHide = this._listNode;
    // }

    const dropdownCfg = withDropdownConfig();

    return {
      ...dropdownCfg,
      hidesOnEsc: true,
      ...menuConfig,
      popperConfig: {
        ...dropdownCfg.popperConfig,
        placement,
      },
    };
  }

  /**
   * @enhance InteractiveListMixin
   */
  _onListKeyUp(ev) {
    super._onListKeyUp(ev);

    const { key } = ev;

    switch (key) {
      case 'Escape':
        // We need to stop here, or else we affect parent menu (handled by OverlayController)
        ev.stopPropagation();
        break;
      /* no default */
    }
  }
}
