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
    this._dynamicCtrl = new DynamicOverlayController();

    // const contentNodeCopy = contentNode.cloneNode(true);

    const modalCtrl = overlays.add(
      new ModalDialogController({
        contentNode,
        invokerNode,
      }),
    );

    /* const bottomCtrl = overlays.add(
      new BottomSheetController({
        contentNode,
        invokerNode,
      }),
    ); */

    [modalCtrl].forEach(ctrl => {
      this._dynamicCtrl.add(ctrl);
    });

    // Manually connect content to DOM (global overlays root node)
    this._dynamicCtrl.active._connectContent();
    this.registrationTarget = document.querySelector('lion-account-options');

    return this._dynamicCtrl;
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
    return this.__overlay ? this.__overlay.active.contentNode : this.querySelector('[slot=input]');
  }
}
customElements.define('lion-account-select', LionAccountSelect);
