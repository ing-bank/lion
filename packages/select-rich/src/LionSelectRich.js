import { LionField } from '@lion/field';
import { html, css } from '@lion/core';
import { LocalOverlayController, overlays } from '@lion/overlays'; // eslint-disable-line
import '../lion-listbox-invoker.js'; // eslint-disable-line

/**
 * LionSelectRich: wraps the <lion-listbox> element
 *
 * @customElement
 * @extends LionField
 */
export class LionSelectRich extends LionField {
  static get styles() {
    return [
      css`
      .input-group__input {
        display: block;
      }
      `
    ]
  }

  get slots() {
    return {
      ...super.slots,
      invoker: () => {
        return document.createElement('lion-listbox-invoker');
      },
    };
  }

  constructor() {
    super();
    this.__syncSelectedStateWithInvoker = this.__syncSelectedStateWithInvoker.bind(this);
    this.__toggleListboxOverlay = this.__toggleListboxOverlay.bind(this);
    this.__checkShowListbox = this.__checkShowListbox.bind(this);
    this.__checkHideListbox = this.__checkHideListbox.bind(this);
    this._hideListbox = this._hideListbox.bind(this);
  }

  get _listboxElement() {
    return this.$$slot('input');
  }

  get _invokerElement() {
    return this.$$slot('invoker');
  }

  get __listboxBehavior() {
    return this._listboxElement._listbox;
  }

  connectedCallback() {
    super.connectedCallback(); // eslint-disable-line
    this.__handleA11ySelect();
    this.__createDropdownSelect();
    this.$$slot('input').addEventListener(
      'user-input-changed',
      this.__syncSelectedStateWithInvoker,
    );
  }

  __createDropdownSelect() {
    this._overlayCtrl = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        hidesOnOutsideClick: true,
        placement: 'bottom center',
        invokerNode: this._invokerElement,
        contentNode: this._listboxElement,

        // fullWIdth: true,
        // offset: 8px
        // pointer: true | false | element
      }),
    );


    // TODO: get rid of fuzzyiness created by fuzzyiness
    requestAnimationFrame(() => requestAnimationFrame(() => {
      this._invokerElement.addEventListener('click', this.__toggleListboxOverlay);
      this._invokerElement.addEventListener('keyup', this.__checkShowListbox);
      this.__listboxBehavior.listboxNode.addEventListener('blur', this._hideListbox);
      this.__listboxBehavior.listboxNode.addEventListener('keydown', this.__checkHideListbox);
      this.__listboxBehavior.setHandleFocusChange(this.__syncSelectedStateWithInvoker);
    }));
  }

  __syncSelectedStateWithInvoker() {
    const selected = this._listboxElement.querySelector(`#${this.__listboxBehavior.activeDescendant}`);
    this._invokerElement.selectedElement = selected;
  }

  __toggleListboxOverlay() {
    if (this._overlayCtrl.isShown) {
      this._overlayCtrl.hide();
    } else {
      this._showListbox();
    }
  }

  __handleA11ySelect() {
    this.$$slot('invoker').setAttribute('aria-haspopup', 'listbox');
  }

  /**
   * @override
   */
  // eslint-disable-next-line
  inputGroupInputTemplate() {
    return html`
      <div class="input-group__input">
        <slot name="invoker"></slot>
        <slot name="input"></slot>
      </div>
    `;
  }

  __checkShowListbox(evt) {
    switch (evt.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        evt.preventDefault();
        this._showListbox();
        this.__listboxBehavior.checkKeyPress(evt);
        break;
      default:
    }
  };

  __checkHideListbox(evt) {
    switch (evt.key) {
      case 'Enter':
      case 'Escape':
        evt.preventDefault();
        this._hideListbox();
        this._invokerElement.focus();
        break;
      default:
    }
  };

  async _showListbox() {
    this._overlayCtrl.show();
    await this._listboxElement.updateComplete;
    this._invokerElement.setAttribute('aria-expanded', 'true');
    this.__listboxBehavior.listboxNode.focus();
  };

  _hideListbox() {
    this._overlayCtrl.hide();
    this._invokerElement.setAttribute('aria-expanded', 'false');
  }
}
