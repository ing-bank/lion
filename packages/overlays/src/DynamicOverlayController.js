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

export class DynamicOverlayController {
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
   * @property {HTMLElement} [invokerNode] (currently exclusive to LocalOverlayController)
   * @property {HTMLElement} [contentNode] (currently exclusive to LocalOverlayController)
   * @property {boolean} isModal - sets aria-modal and/or aria-hidden="true" on siblings
   * @property {boolean} isGlobal - determines the connection point in DOM (body vs handled by user) TODO: rename to renderToBody?
   * @property {boolean} isTooltip - has a totally different interaction- and accessibility pattern from all other overlays, so needed for internals.
   * @property {boolean} handlesUserInteraction - sets toggle on click, or hover when `isTooltip`
   * @property {boolean} handlesAccessibility -
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
  constructor(primaryConfig, secondaryConfigs, syncOptions = {}) {
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
      invokerNode: primaryConfig.invokerNode,
      contentNode: primaryConfig.contentNode,
      isModal: false,
      isGlobal: false,
      isTooltip: false,
      handlesUserInteraction: false,
      handlesAccessibility: false,
      popperConfig: null,
      viewportPlacement: null,
    };

    /** @type {OverlayConfig} */
    this.__primaryConfig = primaryConfig;
    /** @type {DynamicOverlayConfig[]} */
    this.__secondaryConfigs = secondaryConfigs;
    /** @type {OverlayConfig} */
    this.__activeConfig = null;
    /** @type {OverlayController} */
    this.__activeCtrl = null;

    this.__syncOptions = syncOptions;

    fakeExtendsEventTarget(this);
    // This will initialize with the right configuration
    this.requestDynamicConfigSwitch(false);
  }

  /**
   * @desc Makes sure the config can be retrieved from the
   * @param {OverlayConfig} config
   */
  _setConfig(config) {
    const filteredConfig = Object.entries(config).reduce((result, [key, value]) => {
      return Object.assign(result, (key !== 'condition') ? { [key]: value } : {});
    }, {});
    Object.assign(this, filteredConfig);
    this._init();
  }

  // TODO: most of this logic can be removed when GlobalOverlayController and Local are merged
  _init(config = this.__activeConfig) {
    if (this.isGlobal) {
      // create render context
      // lazy import GlobalOverlayController
      // const { GlobalOverlayController } = await loadGlobalOverlayController();
      if (!this.__globalOverlayController) {
        this.__globalOverlayController = new GlobalOverlayController(config);
      }
      this.__prevCtrl = this.__activeCtrl;
      this.__activeCtrl = this.__globalOverlayController;
      this.contentNode.style.position = 'fixed';
    } else {
      // lazy import LocalOverlayController
      // const { LocalOverlayController } = await loadLocalOverlayController();
      if(!this.__localOverlayController) {
        this.__localOverlayController = new LocalOverlayController(config);
      }
      this.__prevCtrl = this.__activeCtrl;
      this.__activeCtrl = this.__localOverlayController;
      this.contentNode.style.position = 'absolute';
    }
    this._delegateApi();
  }

  /**
   * TODO: create one shared OverlayControllerMixin (not to be used on HTMLElement) having this
   * interface and delete this method.
   * @desc For all public functions and properties, forward to the currently active
   * controller. Should be run once
   * @param {GlobalOverlayController|LocalOverlayController} ctrl
   */
  _delegateApi() {
    if (!this.__hasDelegated) {
      // Intercepted methods
      ['show', 'hide'].forEach((prop) => {
        this[prop] = (...args) => {
          if (this.__syncOptions.switchesConfigOnShow) {
            this.requestDynamicConfigSwitch(false);
          }
          if (prop === 'hide' && this.__syncOptions.syncsFocus && this.__secondaryConfigs) {
            this.__latestActiveElement = this.contentNode.activeElement;
          }
          this.__activeCtrl[prop](...args);
          if (prop === 'show' && this.__syncOptions.syncsFocus && this.__secondaryConfigs) {
            this.__latestActiveElement.focus();
          }
        }
      });

      // Methods
      ['toggle', 'sync', 'syncInvoker'].forEach((prop) => {
        this[prop] = (...args) => this.__activeCtrl[prop](...args);
      });

      // Props
      Object.defineProperty(this, 'isShown', {
        get() { return this.__activeCtrl.isShown; },
      });

      this.__hasDelegated = true;
    }

    // Events
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

  /**
   * Allows an Application Developer to change the configuration of this controller
   * For instance, the window size exceeds 600px and we need to switch from a dialog to
   * a dropdown (this would mimic the behavior of a select). The supplied condition
   * in secondaryConfigs will be checked and a config switch can be the outcome.
   *
   * @example
   * myOverlayController.requestDynamicConfigSwitch();
   * @param {boolean} shouldSyncIsShown whether a switch from one type(config) to the other type
   * should synchronize the `isShown` state
   */
  requestDynamicConfigSwitch(shouldSyncIsShown = true) {
    if (!this.__secondaryConfigs) {
      return;
    }
    const useSecondaryConfig = this.__secondaryConfigs.some((config) => {
      if (config.condition()) {
        this.__activeConfig = { ...this._defaultConfig, ...config };
        return true;
      }
    });
    if (!useSecondaryConfig) {
      // If no conditions applied, we should set back the primary config
      this.__activeConfig = { ...this._defaultConfig, ...this.__primaryConfig };
    }

    const { isShown } = this;
    this._setConfig(this.__activeConfig);

    console.log('do it');
    if (isShown && shouldSyncIsShown) {
      this.__prevCtrl.hide();
      this.__activeCtrl.show();
    }
  }
}
