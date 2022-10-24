import { html, css } from 'lit';
import { dedupeMixin } from '@lion/components/core.js';

export const MdFieldMixin = dedupeMixin(
  superclass =>
    class extends superclass {
      static get styles() {
        return [
          ...super.styles,
          css`
            /** @configure FormControlMixin */

            /* =======================
            block | .form-field
            ======================= */

            :host {
              position: relative;
              font-family: 'Roboto', sans-serif;
              padding-top: 16px;
            }

            /* ==========================
            element | .form-field__label
            ========================== */

            .form-field__label ::slotted(label) {
              display: block;
              color: var(--text-color, #545454);
              font-size: 1rem;
              line-height: 1.5rem;
            }

            :host([disabled]) .form-field__label ::slotted(label) {
              color: var(--disabled-text-color, lightgray);
            }

            .form-field__label {
              position: absolute;
              top: 4px;
              left: 0;
              font: inherit;
              pointer-events: none;
              width: 100%;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              transform: perspective(100px);
              -ms-transform: none;
              transform-origin: 0 0;
              transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
                color 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
                width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
              /* z-index: 1; */
            }

            :host([focused]) .form-field__label,
            :host([filled]) .form-field__label {
              transform: translateY(-1.28125em) scale(0.75) perspective(100px) translateZ(0.001px);
              width: 133.333333333333333333%;
            }

            :host([focused]) .form-field__label {
              color: var(--color-primary, royalblue);
            }

            /* ==============================
            element | .form-field__help-text
            ============================== */

            .form-field__help-text {
              visibility: hidden;
              margin-top: 8px;
              position: relative;
              font-size: 0.8em;
              display: block;
            }

            :host([disabled]) .form-field__help-text ::slotted(*) {
              color: var(--disabled-text-color, lightgray);
            }

            :host([focused]) .form-field__help-text {
              visibility: visible;
            }

            :host([shows-feedback-for~='error']) .form-field__help-text {
              display: none;
            }

            /* ==============================
            element | .form-field__feedback
            ============================== */

            .form-field__feedback {
              margin-top: 8px;
              position: relative;
              font-size: 0.8em;
              display: block;
            }

            :host([shows-feedback-for~='error']) .form-field__feedback {
              color: var(--color-error, red);
            }

            /* ==============================
            element | .input-group
            ============================== */

            .input-group {
              display: flex;
            }

            /* ==============================
            element | .input-group__container
            ============================== */

            .input-group__container {
              position: relative;
              display: flex;
              flex-wrap: wrap;
              align-items: stretch;
              width: 100%;
            }

            /* ==============================
            element | .input-group__input
            ============================== */

            .input-group__input {
              display: flex;
              flex: 1;
              position: relative;
            }

            /* ==============================
            element | [slot="input"]
            ============================== */

            * > ::slotted([slot='input']) {
              display: block;
              box-sizing: border-box;
              flex: 1 1 auto;
              width: 1%;
              padding: 0.5rem 0;
              outline: none;
              border: none;
              color: var(--primary-text-color, #333333);
              background: transparent;
              background-clip: padding-box;
              font-size: 100%;
            }

            :host([disabled])
              .input-group__container
              > .input-group__input
              ::slotted([slot='input']) {
              color: var(--disabled-text-color, lightgray);
            }

            /* ==============================
            element | .input-group__prefix,
            element | .input-group__suffix
            ============================== */

            .input-group__prefix,
            .input-group__suffix {
              display: flex;
            }

            .input-group__prefix ::slotted(*),
            .input-group__suffix ::slotted(*) {
              align-self: center;
              text-align: center;
              padding: 0.375rem 0.75rem;
              line-height: 1.5;
              display: flex;
              white-space: nowrap;
              margin-bottom: 0;
            }

            .input-group__container > .input-group__prefix ::slotted(button),
            .input-group__container > .input-group__suffix ::slotted(button) {
              height: 100%;
              border: none;
              background: transparent;

              position: relative;
              overflow: hidden;
              transform: translate3d(0, 0, 0);
            }

            .input-group__container > .input-group__prefix ::slotted(button)::after,
            .input-group__container > .input-group__suffix ::slotted(button)::after {
              content: '';
              display: block;
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              pointer-events: none;
              background-image: radial-gradient(circle, #000 10%, transparent 10.01%);
              background-repeat: no-repeat;
              background-position: 50%;
              transform: scale(10, 10);
              opacity: 0;
              transition: transform 0.25s, opacity 0.5s;
            }

            .input-group__container > .input-group__prefix ::slotted(button:active)::after,
            .input-group__container > .input-group__suffix ::slotted(button:active)::after {
              transform: scale(0, 0);
              opacity: 0.2;
              transition: 0s;
            }

            /* ====  state | :focus  ==== */

            /* ==============================
            element | .input-group__before,
            element | .input-group__after
            ============================== */

            .input-group__before,
            .input-group__after {
              display: flex;
            }

            .input-group__before ::slotted(*),
            .input-group__after ::slotted(*) {
              align-self: center;
              text-align: center;
              padding: 0.375rem 0.75rem;
              line-height: 1.5;
            }

            .input-group__before ::slotted(*) {
              padding-left: 0;
            }

            .input-group__after ::slotted(*) {
              padding-right: 0;
            }

            /** @enhance FormControlMixin */

            /* ==============================
            element | .md-input__underline
            ============================== */

            .md-input__underline {
              position: absolute;
              height: 1px;
              width: 100%;
              background-color: rgba(0, 0, 0, 0.42);
              bottom: 0;
            }

            :host([disabled]) .md-input__underline {
              border-top: 1px var(--disabled-text-color, lightgray) dashed;
              background-color: transparent;
            }

            :host([shows-feedback-for~='error']) .md-input__underline {
              background-color: var(--color-error, red);
            }

            /* ==============================
            element | .md-input__underline-ripple
            ============================== */

            .md-input__underline-ripple {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 2px;
              transform-origin: 50%;
              transform: scaleX(0.5);
              visibility: hidden;
              opacity: 0;
              transition: background-color 0.3s cubic-bezier(0.55, 0, 0.55, 0.2);
              background-color: var(--color-primary, royalblue);
            }

            :host([focused]) .md-input__underline-ripple {
              visibility: visible;
              opacity: 1;
              transform: scaleX(1);
              transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
                opacity 0.1s cubic-bezier(0.25, 0.8, 0.25, 1),
                background-color 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            }

            :host([shows-feedback-for~='error']) .md-input__underline-ripple {
              background-color: var(--color-error, red);
            }
          `,
        ];
      }

      /**
       * @override FormControlMixin
       */
      _groupOneTemplate() {
        return html``;
      }

      /**
       * @override FormControlMixin
       */
      _inputGroupInputTemplate() {
        return html`
          <div class="input-group__input">
            ${this._labelTemplate()}
            <slot name="input"></slot>
          </div>
        `;
      }

      /**
       * @enhance FormControlMixin
       */
      _inputGroupTemplate() {
        return html`
          <div class="input-group">
            ${this._inputGroupBeforeTemplate()}
            <div class="input-group__container">
              ${this._inputGroupPrefixTemplate()} ${this._inputGroupInputTemplate()}
              ${this._inputGroupSuffixTemplate()}
              <div class="md-input__underline">
                <span class="md-input__underline-ripple"></span>
              </div>
            </div>
            ${this._inputGroupAfterTemplate()}
          </div>
        `;
      }
    },
);
