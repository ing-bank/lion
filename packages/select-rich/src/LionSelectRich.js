import { LionField } from '@lion/field';
import { html, css, render } from '@lion/core';
import { LocalOverlayController, overlays } from '@lion/overlays'; // eslint-disable-line
import { managePosition } from '@lion/overlays/src/utils/manage-position.js'; // eslint-disable-line

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
      `,
    ];
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
        verticalMargin: 0,
        horizontalMargin: 0,
        // pointer: true | false | element
        // fullWidth
      }),
    );

    // TODO: add verticalMargin and horizontalMargin. See: https://github.com/ing-bank/lion/pull/61
    // eslint-disable-next-line
    this._overlayCtrl._createOrUpdateOverlay = function(
      shown = this._prevShown,
      data = this._prevData,
    ) {
      if (shown) {
        this._contentData = { ...this._contentData, ...data };

        // let lit-html manage the template and update the properties
        if (this.contentTemplate) {
          render(this.contentTemplate(this._contentData), this.content);
          this.contentNode = this.content.firstElementChild;
        }
        this.contentNode.style.display = 'inline-block';
        this.contentNode.id = this.contentId;
        this.invokerNode.setAttribute('aria-expanded', true);

        managePosition(this.contentNode, this.invokerNode, {
          placement: this.placement,
          position: this.position,
          verticalMargin: 0,
          horizontalMargin: 0,
        });

        if (this.trapsKeyboardFocus) this._setupTrapsKeyboardFocus();
        if (this.hidesOnOutsideClick) this._setupHidesOnOutsideClick();
      } else {
        this._updateContent();
        this.invokerNode.setAttribute('aria-expanded', false);
        if (this.hidesOnOutsideClick) this._teardownHidesOnOutsideClick();
      }
      this._prevShown = shown;
      this._prevData = data;
    }.bind(this._overlayCtrl);

    // TODO: get rid of fuzzyiness created by fuzzyiness
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        this._invokerElement.addEventListener('click', this.__toggleListboxOverlay);
        this._invokerElement.addEventListener('keyup', this.__checkShowListbox);
        this.__listboxBehavior.listboxNode.addEventListener('blur', this._hideListbox);
        this.__listboxBehavior.listboxNode.addEventListener('keydown', this.__checkHideListbox);
        this.__listboxBehavior.setHandleFocusChange(this.__syncSelectedStateWithInvoker);
      }),
    );
  }

  __syncSelectedStateWithInvoker() {
    const selected = this._listboxElement.querySelector(
      `#${this.__listboxBehavior.activeDescendant}`,
    );
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
  }

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
  }

  async _showListbox() {
    // measure invoker height and apply as min-width:
    this._listboxElement.style.minWidth = window.getComputedStyle(this._invokerElement).width;
    console.log('sdds', this._listboxElement.style.minWidth);

    // TODO: decide if we need to apply above in OverlayController

    this._overlayCtrl.show();
    await this._listboxElement.updateComplete;
    this._invokerElement.setAttribute('aria-expanded', 'true');
    this.__listboxBehavior.listboxNode.focus();
  }

  _hideListbox() {
    this._overlayCtrl.hide();
    this._invokerElement.setAttribute('aria-expanded', 'false');
  }
}
