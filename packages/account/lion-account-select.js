/* eslint-disable */
import { LionSelectRich } from '@lion/select-rich';
import {
  DynamicOverlayController,
  ModalDialogController,
  LocalOverlayController,
  GlobalOverlayController,
  BottomSheetController,
  overlays,
} from '@lion/overlays';

class ProxyCtrl extends EventTarget {
  constructor(controllers) {
    super();
    this.delegate(controllers);
    this.active = controllers[0];
  }

  delegate(controllers) {
    // Methods
    ['show', 'hide', 'toggle', 'sync', 'syncInvoker'].forEach(method => {
      this[method] = (...args) => this.active[method](...args);
    });

    // Props
    ['isShown', 'contentNode', 'content'].forEach(prop => {
      Object.defineProperty(this, prop, {
        get() {
          return this.active[prop];
        },
      });
    });

    // Events
    controllers.forEach(ctrl => {
      if (ctrl && !ctrl.__listenersDelegated) {
        ['show', 'hide', 'before-show', 'before-hide'].forEach(event => {
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

// on options --> .registrationTarget=${document.querySelector('my-form')}
export class LionAccountSelect extends LionSelectRich {
  connectedCallback() {
    this._listboxNode.registrationTarget = this;
    if (super.connectedCallback) {
      super.connectedCallback();
    }
  }

  // This gets called from the connectedCallback of the Rich Select
  // eslint-disable-next-line class-methods-use-this
  _defineOverlay({ invokerNode, contentNode } = {}) {
    const modalCtrl = overlays.add(
      new ModalDialogController({
        contentNode,
        invokerNode,
      }),
    );

    const bottomCtrl = overlays.add(
      new BottomSheetController({
        contentNode,
        invokerNode,
      }),
    );

    // Manually connect content to DOM (global overlays root node)
    // this._dynamicCtrl.active._connectContent();
    this.registrationTarget = document.querySelector('lion-account-options');

    function setActiveCtrl() {
      proxyCtrl.active = window.innerWidth >= 600 ? bottomCtrl : modalCtrl;
    }

    const proxyCtrl = new ProxyCtrl([bottomCtrl, modalCtrl]);
    proxyCtrl.addEventListener('before-open', setActiveCtrl);
    setActiveCtrl();

    // return proxyCtrl;
    return bottomCtrl;
  }

  __setupEventListeners() {
    this.__onChildActiveChanged = this.__onChildActiveChanged.bind(this);
    this.__onChildModelValueChanged = this.__onChildModelValueChanged.bind(this);
    this.__onKeyUp = this.__onKeyUp.bind(this);

    this._listboxNode.addEventListener('active-changed', this.__onChildActiveChanged);
    this._listboxNode.addEventListener('model-value-changed', this.__onChildModelValueChanged);
    this._listboxNode.addEventListener('keyup', this.__onKeyUp);
  }

  __teardownEventListeners() {
    this._listboxNode.removeEventListener('active-changed', this.__onChildActiveChanged);
    this._listboxNode.removeEventListener('model-value-changed', this.__onChildModelValueChanged);
    this._listboxNode.removeEventListener('keyup', this.__onKeyUp);
  }

  get _listboxNode() {
    return this.__overlay ? this.__overlay.contentNode : this.querySelector('[slot=input]');
  }
}
customElements.define('lion-account-select', LionAccountSelect);
