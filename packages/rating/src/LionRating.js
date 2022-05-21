/* eslint-disable import/no-extraneous-dependencies */
import { LitElement, css } from '@lion/core';

/**
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 */

/**
 * `LionRating` is a class for custom Rating element (`<lion-rating>` web component).
 *
 * @customElement lion-rating
 */
export class LionRating extends LitElement {
  static get styles() {
    return css`
      :host {
        --uiRatingColor: var(--ratingColor, #eee);
        --uiRatingColorActive: var(--ratingColorActive, #ffcc00);

        font-size: var(--ratingSize, 1rem);
        color: var(--uiRatingColor);
      }
      .rating {
        display: var(--ratingDisplay, flex);
        flex-direction: row-reverse;
        justify-content: flex-end;
      }
      .rating__label {
        cursor: pointer;
        color: var(--uiRatingColor);
      }

      .rating__input {
        display: none;
      }

      .ratintg__label_icon {
        font-size: 1.5rem;
      }
      .rating input:checked ~ .rating__label .ratintg__label_icon,
      .rating:not(:checked) > .rating__label:hover .ratintg__label_icon,
      .rating:not(:checked) > .rating__label:hover ~ .rating__label .ratintg__label_icon {
        color: var(--uiRatingColorActive);
      }

      .screen__reader {
        width: var(--screenReaderWidth, 1px) !important;
        height: var(--screenReaderHeight, 1px) !important;
        padding: var(--screenReaderPadding, 0) !important;
        border: var(--screenReaderBorder, none) !important;

        position: var(--screenReaderPosition, absolute) !important;
        clip: var(--screenReaderClip, rect(1px, 1px, 1px, 1px)) !important;
        overflow: var(--screenReaderOverflow, hidden) !important;
      }
    `;
  }

  static get properties() {
    return {
      // current rate
      currentRate: {
        type: Number,
        reflect: true,
      },
      // total stars to show
      totalItemsToShow: {
        type: Number,
        reflect: true,
      },
    };
  }

  /** @param {number} value */
  set currentRate(value) {
    if (value !== this.currentRate) {
      this.__currentRate = value;
      this.dispatchEvent(this.changeRateEvent);
    }
  }

  /** @returns {number} */
  get currentRate() {
    return this.__currentRate || 0;
  }

  constructor() {
    super();
    this.totalItemsToShow = 5;
    this.currentRate = 0;

    this.changeRateEvent = new CustomEvent('on-rate-change', {
      bubbles: true,
      cancelable: false,
      composed: true,
    });
  }

  /**
   * Create total items that we need to show as an Array
   * @returns {number[]}}
   * @protected
   */
  _getTotalItemsToShow() {
    return Array.from({ length: this.totalItemsToShow }, (_, i) => this.totalItemsToShow - i);
  }

  /**
   * Create Rate element container
   * @returns {HTMLDivElement}
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _prepareParentElement() {
    const parentElement = document.createElement('div');
    parentElement.className = 'rating';
    return parentElement;
  }

  /**
   * Create Rate Input Element
   * @returns {HTMLInputElement}
   * @param {number} itemValue id of label which is rate number
   * @protected
   */
  _prepareInputElement(itemValue) {
    const InputElement = document.createElement('input');

    InputElement.setAttribute('type', 'radio');
    InputElement.setAttribute('name', 'rating');
    InputElement.setAttribute('id', `rating-${itemValue}`);
    InputElement.setAttribute('class', 'rating__input');

    const setEventListeners = () => {
      InputElement.addEventListener('change', () => {
        this.currentRate = itemValue;
      });
    };
    const handleCheckedState = () => {
      if (itemValue === this.currentRate) {
        InputElement.setAttribute('checked', '');
      }
    };

    setEventListeners();
    handleCheckedState();

    return InputElement;
  }

  /**
   * Create Label element
   * @param {number} itemValue id of label which is rate number
   * @returns {HTMLLabelElement}
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _prepareLabelElement(itemValue) {
    const LabelElement = document.createElement('label');

    LabelElement.setAttribute('for', `rating-${itemValue}`);
    LabelElement.setAttribute('class', 'rating__label');
    LabelElement.setAttribute('aria-label', `${itemValue}stars`);

    const addIconAndScreenReaderData = () => {
      LabelElement.innerHTML = `
      <span class="ratintg__label_icon">★</span>
      <span class="screen__reader">${itemValue}</span>
    `;
    };

    addIconAndScreenReaderData();

    return LabelElement;
  }

  render() {
    const totalItemsToShow = this._getTotalItemsToShow();
    const parentElement = this._prepareParentElement();

    totalItemsToShow.map(itemValue => {
      const InputElement = this._prepareInputElement(itemValue);
      const LabelElement = this._prepareLabelElement(itemValue);

      parentElement.appendChild(InputElement);
      parentElement.appendChild(LabelElement);

      return null;
    });
    this.shadowRoot?.appendChild(parentElement);
  }
}
