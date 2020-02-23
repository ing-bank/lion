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
        'lion-calendar-overlay-frame': locale => import(`@lion/overlays/translations/${locale}.js`),
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
