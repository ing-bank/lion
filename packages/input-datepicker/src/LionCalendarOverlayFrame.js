import { html, css, LitElement } from '@lion/core';
import { LocalizeMixin } from '@lion/localize';

export class LionCalendarOverlayFrame extends LocalizeMixin(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
          background: white;
          position: relative;
        }

        .calendar-overlay__header {
          display: flex;
        }

        .calendar-overlay__heading {
          padding: 16px 16px 8px;
          flex: 1;
        }

        .calendar-overlay__heading > .calendar-overlay__close-button {
          flex: none;
        }

        .calendar-overlay__close-button {
          min-width: 40px;
          min-height: 32px;
          border-width: 0;
          padding: 0;
          font-size: 24px;
        }
      `,
    ];
  }

  static get localizeNamespaces() {
    return [
      {
        /* FIXME: This awful switch statement is used to make sure it works with polymer build.. */
        'lion-calendar-overlay-frame': locale => {
          switch (locale) {
            case 'bg-BG':
              return import('@lion/overlays/translations/bg-BG.js');
            case 'cs-CZ':
              return import('@lion/overlays/translations/cs-CZ.js');
            case 'de-DE':
              return import('@lion/overlays/translations/de-DE.js');
            case 'en-AU':
              return import('@lion/overlays/translations/en-AU.js');
            case 'en-GB':
              return import('@lion/overlays/translations/en-GB.js');
            case 'en-US':
              return import('@lion/overlays/translations/en-US.js');
            case 'en-PH':
              return import('@lion/overlays/translations/en.js');
            case 'es-ES':
              return import('@lion/overlays/translations/es-ES.js');
            case 'fr-FR':
              return import('@lion/overlays/translations/fr-FR.js');
            case 'fr-BE':
              return import('@lion/overlays/translations/fr-BE.js');
            case 'hu-HU':
              return import('@lion/overlays/translations/hu-HU.js');
            case 'it-IT':
              return import('@lion/overlays/translations/it-IT.js');
            case 'nl-BE':
              return import('@lion/overlays/translations/nl-BE.js');
            case 'nl-NL':
              return import('@lion/overlays/translations/nl-NL.js');
            case 'pl-PL':
              return import('@lion/overlays/translations/pl-PL.js');
            case 'ro-RO':
              return import('@lion/overlays/translations/ro-RO.js');
            case 'ru-RU':
              return import('@lion/overlays/translations/ru-RU.js');
            case 'sk-SK':
              return import('@lion/overlays/translations/sk-SK.js');
            case 'uk-UA':
              return import('@lion/overlays/translations/uk-UA.js');
            case 'zh-CN':
              return import('@lion/overlays/translations/zh.js');
            default:
              return import(`@lion/overlays/translations/${locale}.js`);
          }
        },
      },
      ...super.localizeNamespaces,
    ];
  }

  __dispatchCloseEvent() {
    this.dispatchEvent(new Event('close-overlay'), { bubbles: true });
  }

  render() {
    // eslint-disable-line class-methods-use-this
    return html`
      <div class="calendar-overlay">
        <div class="calendar-overlay__header">
          <h1 class="calendar-overlay__heading">
            <slot name="heading"></slot>
          </h1>
          <button
            @click="${this.__dispatchCloseEvent}"
            id="close-button"
            title="${this.msgLit('lion-calendar-overlay-frame:close')}"
            aria-label="${this.msgLit('lion-calendar-overlay-frame:close')}"
            class="calendar-overlay__close-button"
          >
            <slot name="close-icon">&times;</slot>
          </button>
        </div>
        <slot></slot>
      </div>
    `;
  }
}
