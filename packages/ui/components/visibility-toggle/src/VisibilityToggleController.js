import { overlays } from './singleton.js';
import { deepContains, deepClosest } from './utils/deep-contains.js';
import { isEqualConfig } from './utils/is-equal-config.js';
import { createRestorable, restore } from './utils/create-restorable.js';

import { closeOnOutsideClickHandler } from './features/closeOnOutsideClickHandler.js';
import { closeOnOutsideEscHandler } from './features/closeOnOutsideEscHandler.js';
import { closeOnEscHandler } from './features/closeOnEscHandler.js';
import { trapFocusHandler } from './features/trapFocusHandler.js';
import { placementHandler } from './features/placementHandler.js';
import { backdropHandler } from './features/backdropHandler.js';
import { focusHandler } from './features/focusHandler.js';
import { a11yHandler } from './features/a11yHandler.js';

/**
 * @typedef {import('@lion/ui/types/overlays.js').ViewportConfig} ViewportConfig
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/types/overlays.js').OverlayPhase} OverlayPhase
 * @typedef {import('@popperjs/core').Options} PopperOptions
 * @typedef {import('@popperjs/core').Placement} Placement
 * @typedef {import('@popperjs/core').createPopper} Popper
 * @typedef {{ createPopper: Popper }} PopperModule
 */

const hasAnchorPositioningSupport = CSS.supports('anchor-name', '--my-anchor');
const hasPopoverSupport = 'popover' in HTMLElement.prototype;

/**
 * DisclosureController is the fundament for every single type of disclosure (with or without overlay content).
 * With the right configuration, it can be used to build (modal) dialogs, tooltips, dropdowns, popovers,
 * bottom/top/left/right sheets etc.
 */
export class VisibilityToggleControllerLean extends EventTarget {
  /**
   * @constructor
   * @param {Partial<OverlayConfig>} config initial config. Will be remembered as shared config
   * when `.updateConfig()` is called.
   */
  constructor(config = {}, manager = overlays) {
    super();
    // TODO: should we only do this in OverlayCtrl for backw. compat? It's not really needed for disclosure
    this.manager = manager;
    /** @private */
    this.__sharedConfig = config;
    /** @private */
    this.__activeElementRightBeforeHide = null;
    /** @type {Partial<OverlayConfig>} */
    this.config = {};

    /**
     * @type {OverlayConfig}
     * @protected
     */
    this._defaultConfig = {
      placementMode: undefined,
      contentNode: config.contentNode,
      contentWrapperNode: config.contentWrapperNode,
      invokerNode: config.invokerNode,
      backdropNode: config.backdropNode,
      referenceNode: undefined,
      elementToFocusAfterHide: config.invokerNode,
      inheritsReferenceWidth: 'none',
      hasBackdrop: false,
      isBlocking: false,
      preventsScroll: false,
      trapsKeyboardFocus: false,
      hidesOnEsc: false,
      hidesOnOutsideEsc: false,
      hidesOnOutsideClick: false,
      isTooltip: false,
      isAlertDialog: false,
      invokerRelation: 'description',
      visibilityTriggerFunction: undefined,
      handlesAccessibility: false,
      popperConfig: {
        placement: 'top',
        strategy: 'fixed',
        modifiers: [
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              boundariesElement: 'viewport',
              padding: 8, // viewport-margin for shifting/sliding
            },
          },
          {
            name: 'flip',
            options: {
              boundariesElement: 'viewport',
              padding: 16, // viewport-margin for flipping
            },
          },
          {
            name: 'offset',
            enabled: true,
            options: {
              offset: [0, 8], // horizontal and vertical margin (distance between popper and referenceElement)
            },
          },
          {
            name: 'arrow',
            enabled: false,
          },
        ],
      },
      viewportConfig: {
        placement: 'center',
      },
      zIndex: 9999,
      isActivated: true,
      focusContentOnOpen: false,
      // This means that content will have visually-hidden / sr-only styles. This is handy for:
      // - hidden menus that should be "indexable" by screen readers (like the Links list in VO: https://support.apple.com/en-gb/guide/voiceover/mchlp2719/mac)
      // - "more" menus that put content in a dropdown that do not fit in the current row
      // - menus that should generally open on tab.
      // @ts-ignore - hideVisually is an extension property
      hideVisually: false,
      requireConnectedNodes: true,

      // hides children overlays when parent is closed...
      syncChildrenCloseState: false,
      // // In next major, we remove this prop. Now we disable it for backwards compatibility and enable it in the places we need it internally
      // _shouldTeardownDomStructure: false,
    };

    /** @protected */
    this._contentId = `overlay-content--${Math.random().toString(36).slice(2, 10)}`;

    this.updateConfig(config);
  }

  __hasSetup = false;

  /**
   * Allows to dynamically change the overlay configuration. Needed in case the
   * presentation of the overlay changes depending on screen size.
   * Note that this method is the only allowed way to update a configuration of an
   * OverlayController instance.
   * @param { Partial<OverlayConfig> } cfgToAdd
   */
  updateConfig(cfgToAdd) {
    /**
     * @type {OverlayConfig}
     * @private
     */
    const prevConfig = this.config;

    /** @type {OverlayConfig} */
    const newConfig = {
      ...this._defaultConfig, // our basic ingredients
      ...this.__sharedConfig, // the initial configured overlayController
      ...cfgToAdd, // the added config
      popperConfig: {
        ...(this._defaultConfig.popperConfig || {}),
        ...(this.__sharedConfig.popperConfig || {}),
        ...(cfgToAdd.popperConfig || {}),
        modifiers: [
          ...(this._defaultConfig.popperConfig?.modifiers || []),
          ...(this.__sharedConfig.popperConfig?.modifiers || []),
          ...(cfgToAdd.popperConfig?.modifiers || []),
        ],
      },
    };

    const shouldUpdate = !this.__hasSetup || !isEqualConfig(prevConfig, newConfig);
    if (!shouldUpdate) return;
    // Teardown all previous configs

    this.teardown();

    this.config = newConfig;

    /** @private */
    this.#validateConfiguration(this.config);
    /** @protected */
    this._init();

    if (!this.#isRegisteredOnManager()) {
      this.manager.add(this);
    }
  }

  #isRegisteredOnManager() {
    return Boolean(this.manager?.list.find(ctrl => this === ctrl));
  }

  /**
   * @param {OverlayConfig} newConfig
   */
  // eslint-disable-next-line class-methods-use-this
  #validateConfiguration(newConfig) {
    if (!newConfig.placementMode) {
      throw new Error(
        '[OverlayController] You need to provide a .placementMode ("global"|"local"|"none")',
      );
    }
    if (!['global', 'local', 'none'].includes(newConfig.placementMode)) {
      throw new Error(
        `[OverlayController] "${newConfig.placementMode}" is not a valid .placementMode, use ("global"|"local"|"none")`,
      );
    }
    if (!newConfig.contentNode) {
      throw new Error('[OverlayController] You need to provide a .contentNode');
    }
    if (newConfig.isTooltip && !newConfig.handlesAccessibility) {
      throw new Error(
        '[OverlayController] .isTooltip only takes effect when .handlesAccessibility is enabled',
      );
    }
  }

  /** @type {{ invoker?: HTMLElement; content?: HTMLElement }} */
  #proxies = {};

  /**
   * @protected
   */
  _init() {
    if (!this.config.isActivated) return;

    /** @type {(value:any) => void} */
    let resolveInitComplete;
    this.initComplete = new Promise(resolve => {
      resolveInitComplete = resolve;
    });

    const attrsToStore = [
      'aria-describedby',
      'aria-labelledby',
      'aria-expanded',
      'aria-haspopup',
      'aria-details',
      'data-content',
      'data-open',
      'tabindex',
      'style',
      'class',
      'role',
      'id',
    ];

    this.#proxies.invoker = this.config.invokerNode
      ? createRestorable(this.config.invokerNode, attrsToStore)
      : undefined;
    this.#proxies.content = createRestorable(this.config.contentNode, attrsToStore);

    this._handleFeatures({ phase: 'init' });
    this.#hideContent();

    /** @private */
    this.__elementToFocusAfterHide = undefined;

    this.#proxies.content.setAttribute('data-content', '');

    // Use event delegation to listen for clicks on close buttons...
    // TODO: later allow for multiple invokers
    this.#proxies.content.addEventListener('click', this.__hideOnCloseButtonClick);

    this.__hasSetup = true;
    // @ts-expect-error
    resolveInitComplete(undefined);
  }

  __hideOnCloseButtonClick = (/** @type {{ target: any; }} */ ev) => {
    const isOurCloseButton =
      ev.target.hasAttribute('data-close') &&
      deepClosest(ev.target, '[data-content]') === this.config.contentNode;
    if (!isOurCloseButton) return;

    this.hide();
  };

  #hideContent() {
    const wrappingDialogNode = /** @type {HTMLDialogElement} */ (this.__wrappingDialogNode);
    if ('HTMLDialogElement' in window && wrappingDialogNode instanceof HTMLDialogElement) {
      wrappingDialogNode.close();
    }
    wrappingDialogNode.style.display = 'none';
    this.config.contentNode?.removeAttribute('data-open');
  }

  #showContent() {
    const wrappingDialogNode = /** @type {HTMLDialogElement} */ (this.__wrappingDialogNode);
    if ('HTMLDialogElement' in window && wrappingDialogNode instanceof HTMLDialogElement) {
      wrappingDialogNode.open = true;
    }
    wrappingDialogNode.style.display = '';
    this.config.contentNode?.setAttribute('data-open', '');
  }

  get isShown() {
    return Boolean(this.__wrappingDialogNode && this.__wrappingDialogNode.style.display !== 'none');
  }

  /**
   * @event before-show right before the overlay shows. Used for animations and switching overlays
   * @event show right after the overlay is shown
   * @param {HTMLElement|undefined} elementToFocusAfterHide
   */
  async show(elementToFocusAfterHide = this.config.elementToFocusAfterHide) {
    // Subsequent shows could happen, make sure we await it first.
    // Otherwise it gets replaced before getting resolved, and places awaiting it will time out.
    if (this._showComplete) {
      await this._showComplete;
    }
    this._showComplete = new Promise(resolve => {
      this._showResolve = resolve;
    });

    this.manager?.show(this);

    if (this.isShown) {
      /** @type {function} */
      (this._showResolve)();
      return;
    }

    const event = new CustomEvent('before-show', { cancelable: true });
    this.dispatchEvent(event);
    if (!event.defaultPrevented) {
      this.#showContent();

      this.__elementToFocusAfterHide = elementToFocusAfterHide;

      this._keepBodySize({ phase: 'before-show' });
      await this._handleFeatures({ phase: 'show' });
      this._keepBodySize({ phase: 'show' });
      // await this._handlePosition({ phase: 'show' });
      this.dispatchEvent(new Event('show'));
      await this.transitionShow({
        backdropNode: this.backdropNode,
        contentNode: this.config.contentNode,
      });

      if (this.config.focusContentOnOpen) {
        this.config.contentNode.focus();
      }
    }

    /** @type {function} */
    (this._showResolve)();
  }

  /**
   * @param {{ phase: OverlayPhase }} config
   * @protected
   */
  _keepBodySize({ phase }) {
    if (!this.config.preventsScroll) return;

    this.manager.requestToKeepBodySize({ phase });
  }

  /**
   * @event before-hide right before the overlay hides. Used for animations and switching overlays
   * @event hide right after the overlay is hidden
   */
  async hide() {
    // Function like a no-op for dynamic edge cases...
    if (!this.config.isActivated) return;

    this._hideComplete = new Promise(resolve => {
      this._hideResolve = resolve;
    });

    if (this.#isRegisteredOnManager()) {
      this.manager.hide(this);
    }

    if (!this.isShown) {
      /** @type {function} */ (this._hideResolve)();
      return;
    }

    this._handleFeatures({ phase: 'before-hide' });

    const event = new CustomEvent('before-hide', { cancelable: true });
    this.dispatchEvent(event);
    if (!event.defaultPrevented) {
      await this.transitionHide({
        backdropNode: this.backdropNode,
        contentNode: this.config.contentNode,
      });

      this.#hideContent();

      this._handleFeatures({ phase: 'hide' });
      this._keepBodySize({ phase: 'hide' });
      this.dispatchEvent(new Event('hide'));
    }
    /** @type {function} */ (this._hideResolve)();
  }

  /**
   * Method to be overriden by subclassers
   *
   * @param {{backdropNode:HTMLElement, contentNode:HTMLElement}} hideConfig
   */
  // @ts-ignore
  // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
  async transitionHide(hideConfig) {}

  /**
   * N.B. this is an optional hook for when js libraries are used.
   * We advise to use CSS animations instead, as this works fine with display:none these days
   * To be overridden by subclassers
   * @param {{backdropNode:HTMLElement; contentNode:HTMLElement}} showConfig
   */
  // @ts-ignore
  // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
  async transitionShow(showConfig) {}

  async toggle() {
    return this.isShown ? this.hide() : this.show();
  }

  /**
   * All features are handled here.
   * @param {{ phase: OverlayPhase }} config
   * @protected
   */
  async _handleFeatures({ phase }) {
    // We catch all __handleFeature calls in this promise array, allowing ourselves to keep timing backwards compatible (and to use concurrency when dependencies need to be downloaded)
    const promises = [];
    if (this.config.handlesAccessibility) {
      promises.push(this.__handleFeature('handlesAccessibility', a11yHandler, { phase }));
    }
    if (this.config.placementMode === 'none' && (phase === 'init' || phase === 'teardown')) {
      // If we want just a collapsible (or want to provide styles ourselves), no need to create a complex dom structure.
      // Doing this in teardown avoids unexpected "null pointers" in cleanup logic
      this.__contentWrapperNode = this.config.contentNode;
      this.__wrappingDialogNode = this.config.contentNode;
    } else {
      // N.B. initial popper load is async... we keep it sync for now,
      // to keep things backward compatible.
      promises.push(this.__handleFeature('placementMode', placementHandler, { phase }));
    }

    if (this.config.preventsScroll) {
      this._handlePreventsScroll({ phase });
    }
    if (this.config.isBlocking) {
      this._handleBlocking({ phase });
    }
    if (this.config.trapsKeyboardFocus) {
      promises.push(this.__handleFeature('trapsKeyboardFocus', trapFocusHandler, { phase }));
    }
    if (this.config.hidesOnEsc) {
      promises.push(this.__handleFeature('hidesOnEsc', closeOnEscHandler, { phase }));
    }
    if (this.config.hidesOnOutsideEsc) {
      promises.push(this.__handleFeature('hidesOnOutsideEsc', closeOnOutsideEscHandler, { phase }));
    }
    if (this.config.hidesOnOutsideClick) {
      promises.push(
        this.__handleFeature('hidesOnOutsideClick', closeOnOutsideClickHandler, { phase }),
      );
    }

    if (this.config.inheritsReferenceWidth) {
      this._handleInheritsReferenceWidth();
    }
    if (this.config.visibilityTriggerFunction) {
      this._handleVisibilityTriggers({ phase });
    }
    if (this.config.syncChildrenCloseState) {
      this._handleSyncChildrenCloseState({ phase });
    }
    if (this.config.focusContentOnOpen) {
      this._handleFocusContentOnOpen({ phase });
    }

    if (this.hasBackdrop) {
      promises.push(this.__handleFeature('hasBackdrop', backdropHandler, { phase }));
    }

    // N.B. this is obliged, as we need to return focus no matter what...
    promises.push(this.__handleFeature('elementToFocusAfterHide', focusHandler, { phase }));
    await Promise.all(promises);
  }

  /**
   * @param {{phase: OverlayPhase}} opts
   * @returns {void}
   */
  _handleFocusContentOnOpen({ phase }) {
    if (phase === 'init') {
      this.config.contentNode?.setAttribute('tabindex', '-1');
    } else if (phase === 'teardown') {
      // TODO: capture initial attr, use Resettable mechanism of VisibilityToggleCtrl in whole Controller
      this.config.contentNode?.removeAttribute('tabindex');
    }
  }

  /**
   * @param {{phase: OverlayPhase}} opts
   * @returns {void}
   */
  _handleSyncChildrenCloseState({ phase }) {
    if (phase !== 'hide') return;

    const visibleChildren = this.manager.shownList.filter(
      ctrl => ctrl !== this && deepContains(this.contentNode, ctrl.contentNode),
    );
    visibleChildren.forEach(ctrl => ctrl.hide());
  }

  /**
   * @param {{ phase: OverlayPhase }} config
   */
  _handleVisibilityTriggers({ phase }) {
    if (typeof this.config.visibilityTriggerFunction !== 'function') return;

    // Here we initialize the __visibilityTriggerHandler of our invokerNode. It's important that we ONLY do this on init,
    // otherwise we risk not being able to properly clean up listeners...
    if (phase === 'init') {
      this.__visibilityTriggerHandler = this.config.visibilityTriggerFunction({ controller: this });
    }
    // Here we run the appropriate lifecycle, if defined in our handler
    this.__visibilityTriggerHandler[phase]?.();
  }

  /**
   * @param {{ phase: OverlayPhase }} config
   * @protected
   */
  _handlePreventsScroll({ phase }) {
    switch (phase) {
      case 'show':
        this.manager.requestToPreventScroll();
        break;
      case 'hide':
        this.manager.requestToEnableScroll();
        break;
      case 'teardown':
        this.manager.requestToEnableScroll(this);
        break;
      /* no default */
    }
  }

  /**
   * @param {{ phase: OverlayPhase }} config
   * @protected
   */
  _handleBlocking({ phase }) {
    switch (phase) {
      case 'show':
        this.manager.requestToShowOnly(this);
        break;
      case 'hide':
        this.manager.retractRequestToShowOnly(this);
        break;
      /* no default */
    }
  }

  get hasActiveBackdrop() {
    return this.config.hasBackdrop && this.isShown;
  }

  /** @type {Map<keyof OverlayConfig, any>} */
  #handlers = new Map();

  /**
   * @param {keyof OverlayConfig} featureName
   * @param {any} handler
   * @param {{ phase: OverlayPhase }} config
   */
  async __handleFeature(featureName, handler, { phase }) {
    if (phase === 'init') {
      this.#handlers.set(
        featureName,
        handler({
          controller: this,
          invoker: this.#proxies.invoker,
          content: this.#proxies.content,
        }),
      );
    }

    // Here we run the appropriate lifecycle, if defined in our handler
    return this.#handlers.get(featureName)?.[phase]?.();
  }

  /** @protected */
  _handleInheritsReferenceWidth() {
    if (!this._referenceNode || this.config.placementMode !== 'local') {
      return;
    }
    const referenceWidth = `${this._referenceNode.getBoundingClientRect().width}px`;
    switch (this.config.inheritsReferenceWidth) {
      case 'max':
        this.contentWrapperNode.style.maxWidth = referenceWidth;
        break;
      case 'full':
        this.contentWrapperNode.style.width = referenceWidth;
        break;
      case 'min':
        this.contentWrapperNode.style.minWidth = referenceWidth;
        this.contentWrapperNode.style.width = 'auto';
        break;
      /* no default */
    }
  }

  teardown() {
    if (!this.__hasSetup) return;
    if (this.isShown) {
      this._keepBodySize({ phase: 'teardown' });
    }
    this._handleFeatures({ phase: 'teardown' });
    if (this.#isRegisteredOnManager()) {
      this.manager.remove(this);
    }
    restore(this.config.contentNode);
    if (this.config.invokerNode) {
      restore(this.config.invokerNode);
    }
    this.config.contentNode?.removeEventListener('click', this.__hideOnCloseButtonClick);
    this.#showContent();
    this.__hasSetup = false;
  }
}

export class VisibilityToggleController extends VisibilityToggleControllerLean {
  /**
   * The invokerNode
   * @type {HTMLElement | undefined}
   */
  get invoker() {
    return this.invokerNode;
  }

  /**
   * The contentWrapperNode
   * @type {HTMLDialogElement | HTMLDivElement}
   */
  get content() {
    return /** @type {HTMLDialogElement | HTMLDivElement} */ (this.__wrappingDialogNode);
  }

  /**
   * Determines the connection point in DOM (body vs next to invoker).
   * @type {'global' | 'local' | 'none' | undefined}
   */
  get placementMode() {
    return this.config?.placementMode;
  }

  /**
   * The interactive element (usually a button) invoking the dialog or tooltip
   * @type {HTMLElement | undefined}
   */
  get invokerNode() {
    return this.config?.invokerNode;
  }

  /**
   * The element that is used to position the overlay content relative to. Usually,
   * this is the same element as invokerNode. Should only be provided when invokerNode should not
   * be positioned against.
   * @type {HTMLElement}
   */
  get referenceNode() {
    return /** @type {HTMLElement} */ (this.config?.referenceNode);
  }

  /**
   * The most important element: the overlay itself
   * @type {HTMLElement}
   */
  get contentNode() {
    return /** @type {HTMLElement} */ (this.config?.contentNode);
  }

  /**
   * The wrapper element of contentNode, used to supply inline positioning styles. When a Popper
   * arrow is needed, it acts as parent of the arrow node. Will be automatically created for global
   * and non projected contentNodes. Required when used in shadow dom mode or when Popper arrow is
   * supplied. Essential for allowing webcomponents to style their projected contentNodes
   * @type {HTMLElement}
   */
  get contentWrapperNode() {
    return /** @type {HTMLElement} */ (
      this.__contentWrapperNode || this.config?.contentWrapperNode
    );
  }

  /**
   * The element that is placed behind the contentNode. When not provided and `hasBackdrop` is true,
   * a backdropNode will be automatically created
   * @type {HTMLElement}
   */
  get backdropNode() {
    return /** @type {HTMLElement} */ (this.__backdropNode || this.config?.backdropNode);
  }

  /**
   * The element that should be called `.focus()` on after dialog closes
   * @type {HTMLElement}
   */
  get elementToFocusAfterHide() {
    return /** @type {HTMLElement} */ (
      this.__elementToFocusAfterHide || this.config?.elementToFocusAfterHide
    );
  }

  /**
   * Whether it should have a backdrop (currently exclusive to globalOverlayController)
   * @type {boolean}
   */
  get hasBackdrop() {
    return /** @type {boolean} */ (!!this.backdropNode || this.config?.hasBackdrop);
  }

  /**
   * Hides other overlays when mutiple are opened (currently exclusive to globalOverlayController)
   * @type {boolean}
   */
  get isBlocking() {
    return /** @type {boolean} */ (this.config?.isBlocking);
  }

  /**
   * Hides other overlays when mutiple are opened (currently exclusive to globalOverlayController)
   * @type {boolean}
   */
  get preventsScroll() {
    return /** @type {boolean} */ (this.config?.preventsScroll);
  }

  /**
   * Rotates tab, implicitly set when 'isModal'
   * @type {boolean}
   */
  get trapsKeyboardFocus() {
    return /** @type {boolean} */ (this.config?.trapsKeyboardFocus);
  }

  /**
   * Hides the overlay when pressing [ esc ]
   * @type {boolean}
   */
  get hidesOnEsc() {
    return /** @type {boolean} */ (this.config?.hidesOnEsc);
  }

  /**
   * Hides the overlay when clicking next to it, exluding invoker
   * @type {boolean}
   */
  get hidesOnOutsideClick() {
    return /** @type {boolean} */ (this.config?.hidesOnOutsideClick);
  }

  /**
   * Hides the overlay when pressing esc, even when contentNode has no focus
   * @type {boolean}
   */
  get hidesOnOutsideEsc() {
    return /** @type {boolean} */ (this.config?.hidesOnOutsideEsc);
  }

  /**
   * Will align contentNode with referenceNode (invokerNode by default) for local overlays.
   * Usually needed for dropdowns. 'max' will prevent contentNode from exceeding width of
   * referenceNode, 'min' guarantees that contentNode will be at least as wide as referenceNode.
   * 'full' will make sure that the invoker width always is the same.
   * @type {'max' | 'full' | 'min' | 'none' | undefined }
   */
  get inheritsReferenceWidth() {
    return this.config?.inheritsReferenceWidth;
  }

  /**
   * For non `isTooltip`:
   *  - sets aria-expanded="true/false" and aria-haspopup="true" on invokerNode
   *  - sets aria-controls on invokerNode
   *  - returns focus to invokerNode on hide
   *  - sets focus to overlay content(?)
   *
   * For `isTooltip`:
   *  - sets role="tooltip" and aria-labelledby/aria-describedby on the content
   *
   * @type {boolean}
   */
  get handlesAccessibility() {
    return /** @type {boolean} */ (this.config?.handlesAccessibility);
  }

  /**
   * Has a totally different interaction- and accessibility pattern from all other overlays.
   * Will behave as role="tooltip" element instead of a role="dialog" element
   * @type {boolean}
   */
  get isTooltip() {
    return /** @type {boolean} */ (this.config?.isTooltip);
  }

  /**
   * The alertdialog role is to be used on modal alert dialogs that interrupt a user's workflow
   * to communicate an important message and require a response.
   */
  get isAlertDialog() {
    return /** @type {boolean} */ (this.config?.isAlertDialog);
  }

  /**
   * By default, the tooltip content is a 'description' for the invoker (uses aria-describedby).
   * Setting this property to 'label' makes the content function as a label (via aria-labelledby)
   * @type {'label' | 'description'| undefined}
   */
  get invokerRelation() {
    return this.config?.invokerRelation;
  }

  /**
   * Popper configuration. Will be used when placementMode is 'local'
   * @type {PopperOptions}
   */
  get popperConfig() {
    return /** @type {PopperOptions} */ (this.config?.popperConfig);
  }

  /**
   * Viewport configuration. Will be used when placementMode is 'global'
   * @type {ViewportConfig}
   */
  get viewportConfig() {
    return /** @type {ViewportConfig} */ (this.config?.viewportConfig);
  }

  get visibilityTriggerFunction() {
    return /** @type {function} */ (this.config?.visibilityTriggerFunction);
  }

  /**
   * @desc The element our local overlay will be positioned relative to.
   * @type {HTMLElement | undefined}
   * @protected
   */
  get _referenceNode() {
    return this.referenceNode || this.invokerNode;
  }

  /**
   * @param {number} value
   */
  set elevation(value) {
    // @ts-expect-error find out why config would/could be undfined
    this.__wrappingDialogNode.style.zIndex = `${this.config.zIndex + value}`;
  }

  /**
   * @type {number}
   */
  get elevation() {
    return Number(this.contentWrapperNode?.style.zIndex);
  }

  // /**
  //  * All features are handled here.
  //  * @param {{ phase: OverlayPhase }} config
  //  * @protected
  //  */
  // async _handleFeatures({ phase }) {
  //   super._handleFeatures({ phase });
  //   if (this.hasBackdrop) {
  //     this.__handleFeature('hasBackdrop', backdropHandler, { phase });
  //   }
  // }
}
