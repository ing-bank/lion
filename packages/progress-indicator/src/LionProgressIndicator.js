/* eslint-disable class-methods-use-this */

import { nothing, LitElement } from '@lion/core';
import { localize, LocalizeMixin } from '@lion/localize';

export class LionProgressIndicator extends LocalizeMixin(LitElement) {
  static get localizeNamespaces() {
    return [
      {
        'lion-progress-indicator': /** @param {string} locale */ locale => {
          switch (locale) {
            case 'bg-BG':
            case 'bg':
              return import('@lion/progress-indicator/translations/bg.js');
            case 'cs-CZ':
            case 'cs':
              return import('@lion/progress-indicator/translations/cs.js');
            case 'de-DE':
            case 'de':
              return import('@lion/progress-indicator/translations/de.js');
            case 'en-AU':
            case 'en-GB':
            case 'en-US':
            case 'en-PH':
            case 'en':
              return import('@lion/progress-indicator/translations/en.js');
            case 'es-ES':
            case 'es':
              return import('@lion/progress-indicator/translations/es.js');
            case 'fr-BE':
            case 'fr-FR':
            case 'fr':
              return import('@lion/progress-indicator/translations/fr.js');
            case 'hu-HU':
            case 'hu':
              return import('@lion/progress-indicator/translations/hu.js');
            case 'it-IT':
            case 'it':
              return import('@lion/progress-indicator/translations/it.js');
            case 'nl-BE':
            case 'nl-NL':
            case 'nl':
              return import('@lion/progress-indicator/translations/nl.js');
            case 'pl-PL':
            case 'pl':
              return import('@lion/progress-indicator/translations/pl.js');
            case 'ro-RO':
            case 'ro':
              return import('@lion/progress-indicator/translations/ro.js');
            case 'ru-RU':
            case 'ru':
              return import('@lion/progress-indicator/translations/ru.js');
            case 'sk-SK':
            case 'sk':
              return import('@lion/progress-indicator/translations/sk.js');
            case 'uk-UA':
            case 'uk':
              return import('@lion/progress-indicator/translations/uk.js');
            case 'zh-CN':
            case 'zh':
              return import('@lion/progress-indicator/translations/zh.js');
            default:
              return import('@lion/progress-indicator/translations/en.js');
          }
        },
      },
    ];
  }

  /** @protected */
  _graphicTemplate() {
    return nothing;
  }

  render() {
    return this._graphicTemplate();
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'status');
    this.setAttribute('aria-live', 'polite');
  }

  onLocaleUpdated() {
    const label = localize.msg('lion-progress-indicator:loading');
    this.setAttribute('aria-label', label);
  }
}
