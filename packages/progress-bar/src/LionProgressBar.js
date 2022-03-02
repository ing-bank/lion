import { LitElement, css, html } from '@lion/core';

export class LionProgressBar extends LitElement {
  static get properties() {
    return {
      value: {
        type: Number,
        reflect: true,
      },
      max: {
        type: Number,
        reflect: true,
      },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        --progress-bar-width: 100%;
        --progress-bar-height: 5px;
        --progress-bar-color: #00bcd4;
        --progress-background: #eeeeee;
        --progress-font-size: 4px;
      }
      progress {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: var(--progress-bar-width);
        height: var(--progress-bar-height);
        border: none;
        color: var(--progress-bar-color);
      }

      progress::-webkit-progress-bar {
        background-color: var(--progress-background);
        border-radius: 2px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
      }
      progress[value]::-webkit-progress-value {
        background-color: var(--progress-bar-color);
      }

      progress:not([value]) {
        position: relative;
      }
      progress:not([value]) + .after {
        position: absolute;
        top: 13px;
        left: 0%;
        background-color: var(--progress-bar-color);
        border-radius: 2px;
        display: block;
        width: calc(var(--progress-bar-height) * 4);
        height: var(--progress-bar-height);
        animation-name: slide;
        animation-duration: 1s;
        animation-fill-mode: forwards;
        animation-timing-function: ease-in-out;
        animation-direction: alternate;
        animation-iteration-count: infinite;
      }

      @keyframes slide {
        from {
          left: 0%;
        }
        to {
          left: calc(100% - calc(var(--progress-bar-height) * 4));
        }
      }

      progress[value]::-moz-progress-bar {
        background-color: var(--progress-bar-color);
      }

      #container {
        width: var(--progress-bar-width);
      }

      #progress-container {
        width: 100%;
        position: relative;
        display: inline-block;
        height: 5px;
        overflow: visible;
      }
      progress[value] #progress-container {
        margin-top: 20px;
      }
      #progress-container #progress-value {
        width: var(--progress-value, 0%);
        height: 20px;
        position: absolute;
        top: -7px;
      }
      #progress-value {
        display: none;
      }
      :host([value]) #progress-value {
        display: block;
      }
      :host([no-percentage]) #progress-value {
        display: none;
      }
      #progress-value::after {
        position: absolute;
        content: attr(data-value) '%';
        color: var(--progress-bar-color);
      }
    `;
  }

  constructor() {
    super();
    this.__value = '';
    this.__max = this.hasAttribute('max')
      ? LionProgressBar.__toPositiveInt(this.getAttribute('max'))
      : 100;
  }

  static __toPositiveInt(value) {
    const val = parseInt(Math.max(0, value), 10);

    return Number.isNaN(val) ? 0 : val;
  }

  get value() {
    return this.__value;
  }

  set value(value) {
    this.__value = (this.__toPositiveInt(value) / this.max) * 100;
    this.requestUpdate();
  }

  get max() {
    return this.__max;
  }

  set max(value) {
    this.__max = value;
  }

  render() {
    return html`
      <div id="container">
        <div id="progress-container">
          <div id="progress-value" style="width: ${this.value}%" data-value="${this.value}"></div>
          <progress value="${this.value}" max="${this.max}"></progress>
          <div class="after"></div>
        </div>
      </div>
    `;
  }
}
