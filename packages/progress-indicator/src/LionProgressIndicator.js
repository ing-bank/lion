/* eslint-disable class-methods-use-this */

import { nothing, LitElement } from '@lion/core';
import { localize, LocalizeMixin } from '@lion/localize';

export class LionProgressIndicator extends LocalizeMixin(LitElement) {
  static get localizeNamespaces() {
    return [
      {
        'lion-progress-indicator': locale => {
          switch (locale) {
            case 'bg-BG':
            case 'bg':
              return import('../translations/bg.js');
            case 'cs-CZ':
            case 'cs':
              return import('../translations/cs.js');
            case 'de-DE':
            case 'de':
              return import('../translations/de.js');
            case 'en-AU':
            case 'en-GB':
            case 'en-US':
            case 'en-PH':
            case 'en':
              return import('../translations/en.js');
            case 'es-ES':
            case 'es':
              return import('../translations/es.js');
            case 'fr-BE':
            case 'fr-FR':
            case 'fr':
              return import('../translations/fr.js');
            case 'hu-HU':
            case 'hu':
              return import('../translations/hu.js');
            case 'it-IT':
            case 'it':
              return import('../translations/it.js');
            case 'nl-BE':
            case 'nl-NL':
            case 'nl':
              return import('../translations/nl.js');
            case 'pl-PL':
            case 'pl':
              return import('../translations/pl.js');
            case 'ro-RO':
            case 'ro':
              return import('../translations/ro.js');
            case 'ru-RU':
            case 'ru':
              return import('../translations/ru.js');
            case 'sk-SK':
            case 'sk':
              return import('../translations/sk.js');
            case 'uk-UA':
            case 'uk':
              return import('../translations/uk.js');
            case 'zh-CN':
            case 'zh':
              return import('../translations/zh.js');
            default:
              return import('../translations/en.js');
          }
        },
      },
    ];
  }

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
