import { LitElement, html, css } from '@lion/core';

export class LionSpinbutton extends LitElement {
  static get properties() {
    return {
      now: { type: Number },
      min: { type: Number },
      max: { type: Number },
      unit: { type: String },
      step: { type: Number },
    };
  }

  get _decreaseNode() {
    return this.shadowRoot.querySelector('[data-ref=decrease]');
  }

  get _increaseNode() {
    return this.shadowRoot.querySelector('[data-ref=increase]');
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        align-items: center;
        cursor: default;
      }
    `;
  }

  render() {
    return this._mainTemplate({ ariaText: this._getAriaText() });
  }

  _mainTemplate({ ariaText }) {
    return html`${ariaText}${this._decreaseBtnTemplate()}${this._increaseBtnTemplate()}`;
  }

  _decreaseBtnTemplate() {
    return html`<span data-ref="decrease">▼</span>`;
  }

  _increaseBtnTemplate() {
    return html`<span data-ref="increase">▲</span>`;
  }

  constructor() {
    super();
    this.unit = '';

    this.step = 1;

    this.__decrease = this.__decrease.bind(this);
    this.__increase = this.__increase.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.__isSetup) {
      return;
    }

    this.setAttribute('tabindex', '0');
    this.__isSetup = true;
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);

    this._decreaseNode.addEventListener('mousedown', this.__decrease);
    this._increaseNode.addEventListener('mousedown', this.__increase);
    this.addEventListener('keydown', this._onKeydown);

    this.addEventListener('mousedown', () => {
      this.__isMousedown = true;
    });
    this.addEventListener('mouseup', () => {
      this.__isMousedown = false;
    });
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('now')) {
      this.setAttribute('aria-valuenow', `${this.now}`);
    }

    if (changedProperties.has('now') || changedProperties.has('unit')) {
      this.setAttribute('aria-valuetext', this._getAriaText());
    }

    if (changedProperties.has('min')) {
      this.setAttribute('aria-valuemin', `${this.min}`);
    }

    if (changedProperties.has('max')) {
      this.setAttribute('aria-valuemax', `${this.max}`);
    }
  }

  /**
   * @overridable
   */
  _getAriaText() {
    return `${this.now}${this.unit ? this.unit : ''}`;
  }

  __decrease(ev, step = this.step, timeout = 100) {
    if (this.min !== undefined && this.now - 1 >= this.min) {
      this.now -= 1; // TODO: support step/increment?
    }
    if (ev.type === 'mousedown') {
      setTimeout(() => {
        if (this.__isMousedown) {
          this.__decrease(ev, step, timeout / 1.3);
        }
      }, timeout);
    }
  }

  __increase(ev, step = this.step, timeout = 100) {
    if (this.max !== undefined && this.now + 1 <= this.max) {
      this.now += 1; // TODO: support step/increment?
    }
    if (ev.type === 'mousedown') {
      setTimeout(() => {
        if (this.__isMousedown) {
          this.__increase(ev, step, timeout / 1.3);
        }
      }, timeout);
    }
  }

  _onKeydown(ev) {
    const { key } = ev;

    switch (key) {
      case 'ArrowDown':
        ev.stopPropagation(); // In case we are inside a menu
        ev.preventDefault(); // Prevent scroll
        this.__decrease();
        break;
      case 'ArrowUp':
        ev.stopPropagation(); // In case we are inside a menu
        ev.preventDefault(); // Prevent scroll
        this.__increase();
        break;
      case 'Home':
        ev.stopPropagation(); // In case we are inside a menu
        ev.preventDefault(); // Prevent scroll
        if (this.min !== undefined) {
          this.now = this.min;
        }
        break;
      case 'End':
        ev.stopPropagation(); // In case we are inside a menu
        ev.preventDefault(); // Prevent scroll
        if (this.max !== undefined) {
          this.now = this.max;
        }
        break;
      case 'PageDown':
        this.__decrease(null, step * 2);
        break;
      case 'PageUp':
        this.__increase(null, step * 2);
        break;
    }
  }
}
