export async function loadGlobalOverlayController() {
  return import('./GlobalOverlayController.js');
}

export async function loadLocalOverlayController() {
  return import('./LocalOverlayController.js');
}

export class OverlayController {
  constructor(params) {
    this.__config = {
      elementToFocusAfterHide: document.body,
      hasBackdrop: false,
      isBlocking: false,
      preventsScroll: false,
      trapsKeyboardFocus: false,
      hidesOnEsc: false,

      hidesOnOutsideClick: false,
      cssPosition: 'absolute',
      contentTemplate: null,
      invokerTemplate: null,
      invokerNode: null,
      contentNode: null,

      isModal: false,

      isGlobal: false,
      isTooltip: false,

      handlesUserInteraction: false,
      handlesAccessibility: false,

      popperConfig: null,
      viewportPlacement: null,

      ...params,
    };

    Object.assign(this.__config, this);
  }

  setOptions(options) {
    Object.assign(options, this);
    this.init();
  }

  async init() {
    if(this.isGlobal) {
      // create render context
      // lazy import GlobalOverlayController
      const { GlobalOverlayController } = await loadGlobalOverlayController();
      this.__globalOverlayController = new GlobalOverlayController(this.__config);
      this._forwardApi(this.__globalOverlayController);
    } else {
      // lazy import LocalOverlayController
      const { LocalOverlayController } = await loadLocalOverlayController();
      this.__localOverlayController = new LocalOverlayController(this.__config);
      this._forwardApi(this.__localOverlayController);
    }
  }

  // For all public functions and properties, forward to the currently active
  // controller.
  _forwardApi(ctrl) {
    const props = ['isShown', 'sync', 'syncInvoker', 'show', 'hide', 'toggle'];
    props.forEach((prop) => {
      if (ctrl[prop]) {
        this[prop] = ctrl[prop];
      }
    });
  }
}
