import { css, html, LitElement } from '@lion/core';
import { OverlayMixin } from '@lion/overlays';

/**
 * @extends {LitElement}
 */
export class LionMenu extends OverlayMixin(LitElement) {
  static get properties() {
    return {
      activeIndex: { type: Number },
      disabled: { type: Boolean, reflect: true },
      hasArrow: { type: Boolean, reflect: true, attribute: 'has-arrow' },
      placement: { type: String, reflect: true },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          --menu-arrow-width: 12px;
          --menu-arrow-height: 8px;
        }
        :host([hidden]) {
          display: none;
        }
        :host([disabled]) {
          color: #adadad;
        }
        :host #overlay-content-node-wrapper {
          border: 1px solid #ccc;
        }
        :host #overlay-content-node-wrapper[x-placement^='top'] {
          margin: 0 0 8px 0;
        }
        :host #overlay-content-node-wrapper[x-placement^='right'] {
          margin: 0 0 0 8px;
        }
        :host #overlay-content-node-wrapper[x-placement^='bottom'] {
          margin: 8px 0 0 0;
        }
        :host #overlay-content-node-wrapper[x-placement^='left'] {
          margin: 0 8px 0 0;
        }
        :host ::slotted([slot='content']) {
          display: block;
          overflow-y: auto;
        }

        /* Arrow */
        .arrow {
          position: absolute;
          width: var(--menu-arrow-width);
          height: var(--menu-arrow-height);
          display: none;
          z-index: -1;
        }
        :host([has-arrow]) .arrow {
          display: block;
        }
        .arrow svg {
          display: block;
        }
        [x-placement^='bottom'] .arrow {
          top: calc(-1 * var(--menu-arrow-height));
          transform: rotate(180deg);
          margin-top: 1px;
        }
        [x-placement^='left'] .arrow {
          right: calc(
            -1 * (var(--menu-arrow-height) + (var(--menu-arrow-width) - var(--menu-arrow-height)) /
                  2)
          );
          transform: rotate(270deg);
          margin-right: 1px;
        }
        [x-placement^='right'] .arrow {
          left: calc(
            -1 * (var(--menu-arrow-height) + (var(--menu-arrow-width) - var(--menu-arrow-height)) /
                  2)
          );
          transform: rotate(90deg);
          margin-left: 1px;
        }
        [x-placement^='top'] .arrow {
          margin-top: -1px;
        }
        :host([has-arrow]) #overlay-content-node-wrapper[x-placement^='top'] {
          margin: 0 0 12px 0;
        }
        :host([has-arrow]) #overlay-content-node-wrapper[x-placement^='right'] {
          margin: 0 0 0 12px;
        }
        :host([has-arrow]) #overlay-content-node-wrapper[x-placement^='bottom'] {
          margin: 12px 0 0 0;
        }
        :host([has-arrow]) #overlay-content-node-wrapper[x-placement^='left'] {
          margin: 0 12px 0 0;
        }
      `,
    ];
  }

  get _arrowNode() {
    return this.shadowRoot.querySelector('[x-arrow]');
  }

  get _invokerNode() {
    return Array.from(this.children).find(child => child.slot === 'invoker');
  }

  get _contentNode() {
    return (
      (this._overlayCtrl && this._overlayCtrl.contentNode) ||
      Array.from(this.children).find(child => child.slot === 'content')
    );
  }

  get _menuItems() {
    return Array.from(this._contentNode.children).filter(
      el => el.getAttribute('menu-type') === 'menu-item',
    );
  }

  get _scrollTargetNode() {
    return this._overlayContentNode._scrollTargetNode || this._overlayContentNode;
  }

  get activeIndex() {
    return this._menuItems.findIndex(el => el === this.getRootNode().activeElement);
  }

  set activeIndex(index) {
    const activeEl = this._menuItems.find(el => el.active);

    if (this._menuItems[index]) {
      const el = this._menuItems[index];
      el.focus();
    } else if (activeEl) {
      activeEl.blur();
    }
  }

  constructor() {
    super();
    this.disabled = false;
    this.hasArrow = false;

    this.config.popperConfig = {
      modifiers: {
        preventOverflow: { enabled: true },
      },
      onUpdate: popper => {
        this.placement = popper.placement;
        this._invokerNode.placement = popper.placement;
      },
    };
  }

  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();

    this.__setupInvokerNode();
    this.__setupContentNode();
    this.__setupEventListeners();

    this.__toggleInvokerDisabled();
  }

  requestUpdateInternal(name, oldValue) {
    super.requestUpdateInternal(name, oldValue);
    if (name === 'disabled') {
      this.__toggleInvokerDisabled();
    }
    if (name === 'opened' && !this.opened) {
      this.activeIndex = -1;
    }
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <slot name="_overlay-shadow-outlet"></slot>
      <div id="overlay-content-node-wrapper">
        <slot name="content">
          <slot name="item"></slot>
        </slot>
        <div class="arrow" x-arrow>${this._arrowTemplate()}</div>
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  _arrowTemplate() {
    return html`
      <svg viewBox="0 0 12 8">
        <path d="M 0,0 h 12 L 6,8 z"></path>
      </svg>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return {
      placementMode: 'local',
      elementToFocusAfterHide: null,
      hidesOnEsc: true,
      hidesOnOutsideEsc: true,
      hidesOnOutsideClick: true,
      popperConfig: {
        placement: 'bottom-start',
        modifiers: {
          offset: {
            enabled: false,
          },
          keepTogether: {
            enabled: true,
          },
          flip: {
            boundariesElement: 'viewport',
            padding: 16,
            flipVariationsByContent: true,
          },
          arrow: {
            enabled: this.hasArrow,
          },
        },
      },
      handlesAccessibility: true,
    };
  }

  __setupEventListeners() {
    this.__onChildActiveChanged = this.__onChildActiveChanged.bind(this);

    this._contentNode.addEventListener('active-changed', this.__onChildActiveChanged);
  }

  __teardownEventListeners() {
    this._contentNode.removeEventListener('active-changed', this.__onChildActiveChanged);
  }

  __toggleInvokerDisabled() {
    if (this._invokerNode) {
      this._invokerNode.disabled = this.disabled;
    }
  }

  __onChildActiveChanged({ target }) {
    if (target.active === true) {
      this._menuItems.forEach(contentElement => {
        if (contentElement !== target) {
          // eslint-disable-next-line no-param-reassign
          contentElement.active = false;
        }
      });
      this._contentNode.setAttribute('aria-activedescendant', target.id);
    }
  }

  __getNextEnabledItem(currentIndex, offset = 1) {
    for (let i = currentIndex + offset; i < this._menuItems.length; i += 1) {
      if (this._menuItems[i] && !this._menuItems[i].disabled) {
        return i;
      }
    }
    return currentIndex;
  }

  __getPreviousEnabledItem(currentIndex, offset = -1) {
    for (let i = currentIndex + offset; i >= 0; i -= 1) {
      if (this._menuItems[i] && !this._menuItems[i].disabled) {
        return i;
      }
    }
    return currentIndex;
  }

  /**
   * @desc
   * Handle various keyboard controls; UP/DOWN will shift focus; SPACE selects
   * an item.
   *
   * @param ev - the keydown event object
   */
  __contentOnKeyUp(ev) {
    if (this.disabled) {
      return;
    }

    const { key } = ev;

    switch (key) {
      case 'Escape':
        ev.preventDefault();
        this.opened = false;
        break;
      case 'Enter':
      case ' ':
        ev.preventDefault();
        this._menuItems[this.activeIndex].click();
        this.opened = false;
        break;
      case 'ArrowUp':
        ev.preventDefault();
        this.activeIndex = this.__getPreviousEnabledItem(this.activeIndex);
        break;
      case 'ArrowDown':
        ev.preventDefault();
        this.activeIndex = this.__getNextEnabledItem(this.activeIndex);
        break;
      case 'Home':
        ev.preventDefault();
        this.activeIndex = this.__getNextEnabledItem(0, 0);
        break;
      case 'End':
        ev.preventDefault();
        this.activeIndex = this.__getPreviousEnabledItem(this._menuItems.length - 1, 0);
        break;
      /* no default */
    }
  }

  __contentOnKeyDown(ev) {
    if (this.disabled) {
      return;
    }

    const { key } = ev;

    switch (key) {
      case 'Tab':
        // Tab can only be caught in keydown
        ev.preventDefault();
        this.opened = false;
        break;
      /* no default */
    }
  }

  __syncFromPopperState(data) {
    if (!data) {
      return;
    }
    if (this._arrowNode && data.placement !== this._arrowNode.placement) {
      this.__repositionCompleteResolver(data.placement);
      this.__setupRepositionCompletePromise();
    }
  }

  __setupInvokerNode() {
    this._invokerNode.id = `invoker-${this.localName}-${Math.random().toString(36).substr(2, 10)}`;
    this._invokerNode.setAttribute('aria-haspopup', 'listbox');
    this.__setupInvokerNodeEventListener();
  }

  __setupInvokerNodeEventListener() {
    this.__invokerOnClick = () => {
      if (!this.disabled) {
        this._overlayCtrl.toggle();
      }
    };
    this._invokerNode.addEventListener('click', this.__invokerOnClick);

    this.__invokerOnBlur = () => {
      this.dispatchEvent(new Event('blur'));
    };
    this._invokerNode.addEventListener('blur', this.__invokerOnBlur);
  }

  __teardownInvokerNode() {
    this._invokerNode.removeEventListener('click', this.__invokerOnClick);
    this._invokerNode.removeEventListener('blur', this.__invokerOnBlur);
  }

  __setupContentNode() {
    if (this._contentNode) {
      this.__setupContentNodeEventListener();
    } else {
      const contentSlot = this.shadowRoot.querySelector('slot[name=content]');
      if (contentSlot) {
        contentSlot.addEventListener('slotchange', () => {
          this.__setupContentNodeEventListener();
        });
      }
    }
  }

  __setupContentNodeEventListener() {
    this.__contentOnClick = () => {
      this.opened = false;
    };

    this._contentNode.addEventListener('click', this.__contentOnClick);

    this.__contentOnKeyUp = this.__contentOnKeyUp.bind(this);
    this._contentNode.addEventListener('keyup', this.__contentOnKeyUp);

    this.__contentOnKeyDown = this.__contentOnKeyDown.bind(this);
    this._contentNode.addEventListener('keydown', this.__contentOnKeyDown);
  }

  __teardownContentNode() {
    if (this._contentNode) {
      this._contentNode.removeEventListener('click', this.__contentOnClick);
      this._contentNode.removeEventListener('keyup', this.__contentOnKeyUp);
      this._contentNode.removeEventListener('keydown', this.__contentOnKeyDown);
    }
  }

  _setupOverlayCtrl() {
    super._setupOverlayCtrl();
    this.__overlayOnShow = () => {
      this.activeIndex = -1;
      this._contentNode.focus();
    };

    this._overlayCtrl.addEventListener('before-show', this.__overlayBeforeShow);
    this._overlayCtrl.addEventListener('show', this.__overlayOnShow);

    this.__overlayOnHide = () => {
      this._invokerNode.focus();
    };
    this._overlayCtrl.addEventListener('hide', this.__overlayOnHide);

    this.__preventScrollingWithArrowKeys = this.__preventScrollingWithArrowKeys.bind(this);
    this._scrollTargetNode.addEventListener('keydown', this.__preventScrollingWithArrowKeys);
  }

  _teardownOverlayCtrl() {
    super._teardownOverlayCtrl();
    this._overlayCtrl.removeEventListener('show', this.__overlayOnShow);
    this._overlayCtrl.removeEventListener('before-show', this.__overlayBeforeShow);
    this._overlayCtrl.removeEventListener('hide', this.__overlayOnHide);
    this._scrollTargetNode.removeEventListener('keydown', this.__overlayOnHide);
    this.__teardownInvokerNode();
    this.__teardownContentNode();
    this.__teardownEventListeners();
  }

  __preventScrollingWithArrowKeys(ev) {
    if (this.disabled) {
      return;
    }
    const { key } = ev;
    switch (key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'Home':
      case 'End':
        ev.preventDefault();
      /* no default */
    }
  }

  /**
   * @override Configures OverlayMixin
   */
  get _overlayInvokerNode() {
    return this._invokerNode;
  }

  /**
   * @override Configures OverlayMixin
   */
  get _overlayContentNode() {
    return this._contentNode;
  }
}
