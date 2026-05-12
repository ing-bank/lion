/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-extraneous-dependencies */
import { html } from 'lit';
import { dedupeMixin } from '@open-wc/dedupe-mixin';

import { OverlayMixin, withDropdownConfig } from '@lion/ui/overlays.js';
import { LionMenu } from './LionMenu.js';
import { InteractiveListMixin } from './InteractiveListMixin.js';

/**
 * Handles integration of InteractiveListMixin and OverlayMixin
 * Will be used by:
 * - LionMenuOverlay
 * - LionCombobox
 * - LionSelectRich
 *
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('lit').LitElement>} superclass
 */
const OverlayWithListInvokerMixinImplementation = superclass =>
  class OverlayWithListInvokerMixin extends OverlayMixin(InteractiveListMixin(superclass)) {
    // constructor() {
    //   super();

    //   /** @configure DisclosureMixin */
    //   this.handleFocus = true;
    // }

    // _onOverlayBeforeShow = () => {};

    _onOverlayShow = () => {
      if (this.checkedIndex != null) {
        // @ts-ignore - activeIndex can be number or array
        this.activeIndex = this.checkedIndex;
      }
      // this._listNode.focus();
    };

    // _onOverlayHide = () => {
    //   console.log('hide', this._overlayInvokerNode);
    //   this._overlayInvokerNode.focus();
    // };

    /**
     * @enhance OverlayMixin
     */
    _setupOverlayCtrl() {
      super._setupOverlayCtrl();

      if (!this._overlayCtrl) return;

      // this._overlayCtrl.addEventListener('before-show', this._onOverlayBeforeShow);
      this._overlayCtrl.addEventListener('show', this._onOverlayShow);
      // this._overlayCtrl.addEventListener('hide', this._onOverlayHide);
    }

    /**
     * @enhance OverlayMixin
     */
    _teardownOverlayCtrl() {
      super._teardownOverlayCtrl();

      if (!this._overlayCtrl) return;

      // this._overlayCtrl.removeEventListener('before-show', this._onOverlayBeforeShow);
      this._overlayCtrl.removeEventListener('show', this._onOverlayShow);
      // this._overlayCtrl.removeEventListener('hide', this._onOverlayHide);
    }

    /**
     * make sure OverlayMixin gets the contentNode defined by DisclosureMixin
     */
    get _overlayContentNode() {
      // @ts-ignore - _contentNode property
      return this._contentNode;
    }

    /**
     * make sure OverlayMixin gets the invokerNode defined by DisclosureMixin
     */
    get _overlayInvokerNode() {
      // @ts-ignore - _invokerNode property
      return this._invokerNode;
    }
  };
export const OverlayWithListInvokerMixin = dedupeMixin(OverlayWithListInvokerMixinImplementation);

export class LionMenuOverlay extends OverlayWithListInvokerMixin(LionMenu) {
  // TODO: this was created 5 years ago, do we still need id="overlay-content-node-wrapper" after the "dialog refactor"?
  render() {
    return html`
      <slot name="invoker"></slot>
      <div id="overlay-content-node-wrapper">
        <slot name="list"></slot>
      </div>
      <slot id="list-items-outlet"></slot>
    `;
  }

  // @ts-ignore - overlay config return type
  _defineOverlayConfig() {
    // @ts-ignore - parentList property
    const { parentList } = this;
    let placement = 'bottom-start';
    if (parentList?.orientation !== 'horizontal') {
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
        strategy: 'absolute',
        modifiers: [
          {
            name: 'offset',
            enabled: true,
            options: {
              offset: [0, 0],
            },
          },
        ],
      },
    };
  }

  /**
   * @enhance InteractiveListMixin
   */
  /**
   * @param {*} ev
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
