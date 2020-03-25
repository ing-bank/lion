import { css, html, LitElement } from '@lion/core';
import { LionField } from '@lion/field';
import { LionFieldset } from '@lion/fieldset';

export class HelperOutput extends LitElement {
  static get properties() {
    return {
      field: Object,
      show: Array,
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin-top: 16px;
        }

        table,
        th,
        td {
          border: 1px solid #ccc;
          padding: 4px;
          font-size: 12px;
        }

        table {
          border-collapse: collapse;
        }

        caption {
          text-align: left;
        }
      `,
    ];
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    if (!this.field) {
      // Fuzzy logic, but... practical
      const prev = this.previousElementSibling;
      if (prev instanceof LionField || prev instanceof LionFieldset) {
        this.field = prev;
      }
    }
    this.__rerender = this.__rerender.bind(this);
    this.field.addEventListener('model-value-changed', this.__rerender);
    this.field.addEventListener('mousemove', this.__rerender);
    this.field.addEventListener('blur', this.__rerender);
    this.field.addEventListener('focusin', this.__rerender);
    this.field.addEventListener('focusout', this.__rerender);

    if (this.field._inputNode.form) {
      this.field._inputNode.form.addEventListener('submit', this.__rerender);
    }
  }

  __rerender() {
    setTimeout(() => {
      const f = this.field;
      this.field = null;
      this.field = f;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  __renderProp(p) {
    if (typeof p === 'boolean') {
      return p === true ? '✓' : '';
    }
    if (typeof p === 'undefined') {
      return '?';
    }
    return p;
  }

  render() {
    const field = this.field || {};
    return html`
      <table>
        <caption>
          Interaction States
        </caption>
        <tr>
          ${this.show.map(prop => html`<th>${prop}</th>`)}
        </tr>
        <tr></tr>
        <tr>
          ${this.show.map(prop => html`<td>${this.__renderProp(field[prop])}</td>`)}
        </tr>
      </table>
    `;
  }
}

customElements.define('h-output', HelperOutput);
