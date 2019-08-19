import { fakeExtendsEventTarget } from './utils/fake-extends-target.js';
import { GlobalOverlayController } from './GlobalOverlayController.js';
import { LocalOverlayController } from './LocalOverlayController.js';

// const loadGlobalOverlayController = async() => import('./GlobalOverlayController.js');
// const loadLocalOverlayController = async() => import('./LocalOverlayController.js');

/**
 * @see https://popper.js.org/
 * @typedef {object} PopperConfig
 * @property {'auto'|'top'|'right'|'bottom'|'left'|'top-start'|'top-end'|'right-start'|'right-end'|'bottom-start'|'bottom-end'|'left-start'|'left-end'} [placement='bottom']
 * @property {boolean} [positionFixed=false]
 * @property {boolean} [eventsEnabled=true]
 * @property {boolean} [removeOnDestroy=false]
 * @property {object} [modifiers]
 * @property {Function} [onCreate]
 * @property {Function} [onUpdate]
 */

export class OverlayController {
  /**
   * @typedef {object} OverlayConfig
   * @property {HTMLElement} [elementToFocusAfterHide=document.body] - the element that should be
   * called `.focus()` on after dialog closes
   * @property {boolean} [hasBackdrop=false] - whether it should have a backdrop (currently
   * exclusive to globalOverlayController)
   * @property {boolean} [isBlocking=false] - hides other overlays when mutiple are opened
   * (currently exclusive to globalOverlayController)
   * @property {boolean} [preventsScroll=false] - prevents scrolling body content when overlay
   * opened (currently exclusive to globalOverlayController)
   * @property {boolean} [trapsKeyboardFocus=false] - rotates tab, implicitly set when 'isModal'
   * @property {boolean} [hidesOnEsc=false] - hides the overlay when pressing [ esc ]
   * @property {boolean} [hidesOnOutsideClick=false] - hides the overlay when clicking next to it,
   * exluding invoker. (currently exclusive to localOverlayController)
   * https://github.com/ing-bank/lion/pull/61
   * @property {TemplateResult} [contentTemplate]
   * @property {TemplateResult} [invokerTemplate] (currently exclusive to LocalOverlayController)
   * @property {HTMLElement} invokerNode
   * @property {HTMLElement} contentNode
   * @property {boolean} [isModal=false] - sets aria-modal and/or aria-hidden="true" on siblings
   * @property {boolean} [isGlobal=false] - determines the connection point in DOM (body vs next
   * to invoker). This is what other libraries often refer to as 'portal'. TODO: rename to renderToBody?
   * @property {boolean} [isTooltip=false] - has a totally different interaction- and accessibility pattern from all other overlays, so needed for internals.
   * @property {boolean} [handlesUserInteraction] - sets toggle on click, or hover when `isTooltip`
   * @property {boolean} [handlesAccessibility] -
   *  - For non `isTooltip`:
   *    - sets aria-expanded="true/false" and aria-haspopup="true" on invokerNode
   *    - sets aria-controls on invokerNode
   *    - returns focus to invokerNode on hide
   *    - sets focus to overlay content(?)
   *  - For `isTooltip`:
   *    - sets role="tooltip" and aria-labelledby/aria-describedby on the content
   * @property {PopperConfig} popperConfig
   */

  /**
   * @typedef {Function} DynamicOverlaySwitchCondition
   * @property {Function} condition
   *
   * @typedef {OverlayConfig & DynamicOverlaySwitchCondition} DynamicOverlayConfig
   */

  /**
   * @constructor
   * @param {OverlayConfig} primaryConfig usually the 'mobile first' approach: for instance, a
   * centered dialog
   * @param {DynamicOverlayConfig[]} [secondaryConfigs] can be a desktop
   * @param {object} [syncOptions] extra options for interaction between different types of overlays
   * @param {boolean} [syncOptions.syncsFocus=true] synchronize focus between overlays rendered locally and
   * globally (to the body)
   */
  constructor(config) {
    this._defaultConfig = {
      elementToFocusAfterHide: document.body,
      hasBackdrop: false,
      isBlocking: false,
      preventsScroll: false,
      trapsKeyboardFocus: false,
      hidesOnEsc: false,
      hidesOnOutsideClick: false,
      contentTemplate: null,
      invokerTemplate: null,
      invokerNode: config.invokerNode,
      contentNode: config.contentNode,
      isModal: false,
      isGlobal: false,
      isTooltip: false,
      handlesUserInteraction: false,
      handlesAccessibility: false,
      popperConfig: null,
      viewportPlacement: null,
      syncsFocus: false,
    };

    /** @type {OverlayController} */
    this.__activeCtrl = null;

    fakeExtendsEventTarget(this);
    this._delegateApi();
    this.setConfig(config);
  }

  /**
   * @desc Makes sure the config can be retrieved from the
   * @param {OverlayConfig} config
   */
  setConfig(config) {
    if (config.contentNode) {
      this.__originalContentParent = config.contentNode.parentElement;
    }
    const newConfig = { ...this._defaultConfig, ...config };
    Object.assign(this, newConfig);
    this._init(newConfig);
  }

  // TODO: most of this logic can be removed when GlobalOverlayController and Local are merged
  _init(config) {
    if (this.isGlobal) {
      if (!this.__globalOverlayController) {
        this.__globalOverlayController = new GlobalOverlayController(config);
      }
      this.__activeCtrl = this.__globalOverlayController;
      this.contentNode.style.position = 'fixed';
    } else {
      if (!this.__localOverlayController) {
        this.__localOverlayController = new LocalOverlayController(config);
      }
      this.__activeCtrl = this.__localOverlayController;
      this.contentNode.style.position = '';
      this.__originalContentParent.appendChild(this.contentNode);
    }
    this._delegateEvents();
  }

  /**
   * TODO: create one shared OverlayControllerMixin (not to be used on an HTMLElement) having this
   * interface and delete this method.
   * @desc For all public functions and properties, forward to the currently active
   * controller. Should be run once
   * @param {GlobalOverlayController|LocalOverlayController} ctrl
   */
  _delegateApi() {
    if (!this.__hasDelegated) {

      // Intercepted methods
      this.show = (...args) => {
        this.dispatchEvent(new Event('before-show'));
        this.__activeCtrl.show(...args);
        if (this.syncsFocus) {
          this.__latestActiveElement.focus();
        }
      }

      this.hide = (...args) => {
        if (this.syncsFocus) {
          this.__latestActiveElement = this.contentNode.activeElement;
        }
        this.dispatchEvent(new Event('before-hide'));
        this.__activeCtrl.hide(...args);
      }

      // Other Methods
      ['toggle', 'sync', 'syncInvoker'].forEach((prop) => {
        this[prop] = (...args) => this.__activeCtrl[prop](...args);
      });

      // Props
      Object.defineProperty(this, 'isShown', {
        get() { return this.__activeCtrl.isShown; },
      });

      this.__hasDelegated = true;
    }
  }

  _delegateEvents() {
    // Events: we can't use this._activeCtrl, since we need to listen to both
    [this.__globalOverlayController, this.__localOverlayController].forEach((ctrl) => {
      if (ctrl && !ctrl.__listenersDelegated) {
        ['show', 'hide'].forEach((event) => {
          ctrl.addEventListener(event, this.__delegateEvent.bind(this));
        });
        ctrl.__listenersDelegated = true; // eslint-disable-line no-param-reassign
      }
    });
  }

  __delegateEvent(ev) {
    ev.stopPropagation();
    this.dispatchEvent(new Event(ev.type));
  }
}
