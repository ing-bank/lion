/* eslint-disable import/no-extraneous-dependencies */
import { css, html, LitElement, nothing } from 'lit';
import { getLocalizeManager, LocalizeMixin } from '@lion/ui/localize-no-side-effects.js';
import { localizeNamespaceLoader } from './localizeNamespaceLoader.js';

/**
 * @typedef {import('lit').TemplateResult} TemplateResult
 */

/**
 * @customElement lion-progress-indicator
 */
export class LionProgressIndicator extends LocalizeMixin(LitElement) {
  static get properties() {
    return {
      value: {
        type: Number,
      },
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
      label: { type: String },
      _ariaLabel: { attribute: 'aria-label', type: String },
      _ariaLabelledby: { attribute: 'aria-labelledby', type: String },
    };
  }

  static localizeNamespaces = [
    { 'lion-progress-indicator': localizeNamespaceLoader },
    ...super.localizeNamespaces,
  ];

  /**
   * @readonly
   * @type {boolean}
   */
  get indeterminate() {
    return !this.hasAttribute('value');
  }

  /**
   * // TODO: check if this is a false positive or if we can improve
   * @configure ReactiveElement
   */
  static enabledWarnings = super.enabledWarnings?.filter(w => w !== 'change-in-update') || [];

  /**
   * In case of a determinate progress-indicator it returns the progress percentage
   * based on value, min & max.
   * Could be used for styling inside the _graphicTemplate
   *
   * @example
   * style="width: ${this._progressPercentage}%"
   */
  get _progressPercentage() {
    if (this.indeterminate) {
      return undefined;
    }
    return ((this.value - this.min) / (this.max - this.min)) * 100;
  }

  static get styles() {
    return css`
      .sr-only {
        position: absolute;
        overflow: hidden;
        width: 1px;
        height: 1px;
        padding: 0;
        border: 0;
        margin: 0;
        clip: rect(1px, 1px, 1px, 1px);
        clip-path: inset(100%);
        white-space: nowrap;
      }
    `;
  }

  constructor() {
    super();
    this.value = 0;
    this.min = 0;
    this.max = 100;
    /** @type {string|TemplateResult} */
    this.label = '';
    this._ariaLabel = '';
    this._ariaLabelledby = '';
    this._localizeManager = getLocalizeManager();
    this.__hasDefaultLabelSet = false;
  }

  /** @protected */
  // eslint-disable-next-line class-methods-use-this
  _graphicTemplate() {
    return nothing;
  }

  render() {
    return html`
      ${this._graphicTemplate()}
      ${this.indeterminate ? html`<span class="sr-only">${this.label}</span>` : nothing}
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.indeterminate) {
      this.setAttribute('role', 'status');
    } else {
      this.setAttribute('role', 'progressbar');
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.__hasDefaultLabelSet) {
      this._removeDefaultLabel();
    }
  }

  /**
   * Update aria labels on state change.
   * @param {import('lit').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (this.indeterminate) {
      if (changedProperties.has('_ariaLabel') || changedProperties.has('_ariaLabelledby')) {
        this._setDefaultLabel();
      }
      if (changedProperties.has('value')) {
        this._resetAriaValueAttributes();
        this._setDefaultLabel();
      }
    } else {
      if (changedProperties.has('value')) {
        if ((!this.value && this.value !== 0) || typeof this.value !== 'number') {
          this.removeAttribute('value');
        } else if (this.value < this.min) {
          this.value = this.min;
          this.setAttribute('aria-valuenow', this.min.toString());
        } else if (this.value > this.max) {
          this.value = this.max;
          this.setAttribute('aria-valuenow', this.max.toString());
        } else {
          this.setAttribute('aria-valuenow', this.value.toString());
        }
        if (this.__hasDefaultLabelSet === true) {
          this._removeDefaultLabel();
        }
      }
      if (changedProperties.has('min')) {
        this.setAttribute('aria-valuemin', this.min.toString());
        if (this.value < this.min) {
          this.value = this.min;
        }
      }
      if (changedProperties.has('max')) {
        this.setAttribute('aria-valuemax', this.max.toString());
        if (this.value > this.max) {
          this.value = this.max;
        }
      }
    }
  }

  onLocaleUpdated() {
    super.onLocaleUpdated();
    // only set default label for indeterminate
    if (this.indeterminate) {
      this._setDefaultLabel();
    }
  }

  _resetAriaValueAttributes() {
    this.removeAttribute('aria-valuenow');
    this.removeAttribute('aria-valuemin');
    this.removeAttribute('aria-valuemax');
  }

  __setLabel() {
    if (this.__hasDefaultLabelSet) {
      setTimeout(() => {
        this.label = this._localizeManager.msg('lion-progress-indicator:loading');
      }, 500);
    }
  }

  __removeLabel() {
    this.label = html`&nbsp;`;
  }

  _setDefaultLabel() {
    if (this._ariaLabelledby || this._ariaLabel) {
      this._removeDefaultLabel();
    } else if (!this.__hasDefaultLabelSet) {
      this.__hasDefaultLabelSet = true;
      this.__setLabel();
      this.repeatLabel = setInterval(() => {
        this.__removeLabel();
        this.__setLabel();
      }, 8000);
    }
  }

  _removeDefaultLabel() {
    this.label = '';
    clearInterval(this.repeatLabel);
    this.__hasDefaultLabelSet = false;
  }
}
