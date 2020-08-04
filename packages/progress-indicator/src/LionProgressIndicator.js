import { svg, css, LitElement } from '@lion/core';
import { localize, LocalizeMixin } from '@lion/localize';

export class LionProgressIndicator extends LocalizeMixin(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
        }

        svg.lion-progress {
          animation: progress-indicator-rotate 2s linear infinite;
          height: 40px;
          width: 40px;
        }

        @keyframes progress-indicator-rotate {
          to {
            transform: rotate(360deg);
          }
        }
      `,
    ];
  }

  static get localizeNamespaces() {
    return [
      {
        'lion-loading-indicator': locale => {
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
              return import('./translations/sk.js');
            case 'uk-UA':
            case 'uk':
              return import('../translations/uk.js');
            default:
              return import('../translations/en.js');
          }
        },
      },
    ];
  }

  // eslint-disable-next-line class-methods-use-this
  template() {
    return svg`
      <svg class="lion-progress" viewBox="22 22 44 44">
        <circle cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6" stroke="black" stroke-dasharray="88,25" />
      </svg>
    `;
  }

  render() {
    return this.template();
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'status');
    this.setAttribute('aria-live', 'polite');
  }

  onLocaleUpdated() {
    const label = localize.msg('lion-loading-indicator:loading');
    this.setAttribute('aria-label', label);
  }
}
