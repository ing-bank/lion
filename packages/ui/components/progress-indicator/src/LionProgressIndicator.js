/* eslint-disable import/no-extraneous-dependencies */
import { LitElement, nothing } from 'lit';
import { localize, LocalizeMixin } from '@lion/ui/localize.js';

/**
 * @typedef {import('lit').TemplateResult} TemplateResult
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
      _ariaLabel: { attribute: 'aria-label', type: String },
      _ariaLabelledby: { attribute: 'aria-labelledby', type: String },
    };
  }

  static get localizeNamespaces() {
    return [
      {
        'lion-progress-indicator': /** @param {string} locale */ locale => {
          switch (locale) {
            case 'bg-BG':
            case 'bg':
              return import('@lion/ui/progress-indicator-translations/bg.js');
            case 'cs-CZ':
            case 'cs':
              return import('@lion/ui/progress-indicator-translations/cs.js');
            case 'de-DE':
            case 'de':
              return import('@lion/ui/progress-indicator-translations/de.js');
            case 'en-AU':
            case 'en-GB':
            case 'en-US':
            case 'en-PH':
            case 'en':
              return import('@lion/ui/progress-indicator-translations/en.js');
            case 'es-ES':
            case 'es':
              return import('@lion/ui/progress-indicator-translations/es.js');
            case 'fr-BE':
            case 'fr-FR':
            case 'fr':
              return import('@lion/ui/progress-indicator-translations/fr.js');
            case 'hu-HU':
            case 'hu':
              return import('@lion/ui/progress-indicator-translations/hu.js');
            case 'it-IT':
            case 'it':
              return import('@lion/ui/progress-indicator-translations/it.js');
            case 'nl-BE':
            case 'nl-NL':
            case 'nl':
              return import('@lion/ui/progress-indicator-translations/nl.js');
            case 'pl-PL':
            case 'pl':
              return import('@lion/ui/progress-indicator-translations/pl.js');
            case 'ro-RO':
            case 'ro':
              return import('@lion/ui/progress-indicator-translations/ro.js');
            case 'ru-RU':
            case 'ru':
              return import('@lion/ui/progress-indicator-translations/ru.js');
            case 'sk-SK':
            case 'sk':
              return import('@lion/ui/progress-indicator-translations/sk.js');
            case 'uk-UA':
            case 'uk':
              return import('@lion/ui/progress-indicator-translations/uk.js');
            case 'zh-CN':
            case 'zh':
              return import('@lion/ui/progress-indicator-translations/zh.js');
            default:
              return import('@lion/ui/progress-indicator-translations/en.js');
          }
        },
      },
    ];
  }

  /**
   * @readonly
   * @type {boolean}
   */
  get indeterminate() {
    return !this.hasAttribute('value');
  }

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

  constructor() {
    super();
    this.value = 0;
    this.min = 0;
    this.max = 100;
    this._ariaLabel = '';
    this._ariaLabelledby = '';
    this.__hasDefaultLabelSet = false;
  }

  /** @protected */
  // eslint-disable-next-line class-methods-use-this
  _graphicTemplate() {
    return nothing;
  }

  render() {
    return this._graphicTemplate();
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'progressbar');
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
        if (!this.value || typeof this.value !== 'number') {
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
          this.removeAttribute('aria-label');
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

  _setDefaultLabel() {
    if (this._ariaLabelledby) {
      this.removeAttribute('aria-label');
    } else if (!this._ariaLabel) {
      this.setAttribute('aria-label', localize.msg('lion-progress-indicator:loading'));
      this.__hasDefaultLabelSet = true;
    }
  }
}
