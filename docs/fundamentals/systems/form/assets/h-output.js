import { css, html, LitElement } from '@lion/core';
import { LionField } from '@lion/form-core';
import { LionFieldset } from '@lion/fieldset';

export class HelperOutput extends LitElement {
  static properties = {
    field: Object,
    show: Array,
    title: String,
    readyPromise: Object,
  };

  static styles = [
    css`
      :host {
        display: block;
        margin-top: 8px;
      }

      code {
        font-size: 8px;
        background-color: #eee;
      }

      caption {
        position: absolute;
        top: 0;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(100%);
        clip: rect(1px, 1px, 1px, 1px);
        white-space: nowrap;
        border: 0;
        margin: 0;
        padding: 0;
      }

      table,
      th,
      td {
        border-bottom: 1px solid rgb(204, 204, 204);
        border-image: initial;
        padding: 4px;
        font-size: 12px;
        border-left: none;
        border-right: none;
        text-align: left;
      }

      td {
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      table {
        border-collapse: collapse;
      }

      caption {
        text-align: left;
      }
    `,
  ];

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

    const storyRoot = this.field.closest('[mdjs-story-name]') || this.parentElement;

    storyRoot.addEventListener('model-value-changed', this.__rerender);
    storyRoot.addEventListener('mousemove', this.__rerender);
    // this.field.addEventListener('blur', this.__rerender);
    storyRoot.addEventListener('focusin', this.__rerender);
    storyRoot.addEventListener('focusout', this.__rerender);
    storyRoot.addEventListener('change', this.__rerender);

    if (this.field._inputNode.form) {
      this.field._inputNode.form.addEventListener('submit', this.__rerender);
    }

    if (this.readyPromise) {
      this.readyPromise.then(() => {
        this.__rerender();
      });
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
  __renderProp(prop) {
    const field = this.field || {};
    let resultText = '';

    if (typeof prop === 'string') {
      const p = field[prop];
      if (typeof p === 'boolean') {
        return p === true ? '✓' : '';
      }
      if (typeof p === 'undefined') {
        return html`<code>undefined</code>`;
      }
      if (typeof p === 'object' && p !== null) {
        return JSON.stringify(p);
      }
      resultText = p;
    } else {
      resultText = prop.processor(field);
    }

    return html`<span title="${resultText}">${resultText}</span>`;
  }

  constructor() {
    super();
    this.title = 'States';
  }

  render() {
    const computePropName = prop => (typeof prop === 'string' ? prop : prop.name);
    return html`
      <table>
        <caption>
          ${this.title}
        </caption>
        <tr>
          ${this.show.map(prop => html`<th>${computePropName(prop)}</th>`)}
        </tr>
        <tr></tr>
        <tr>
          ${this.show.map(prop => html`<td>${this.__renderProp(prop)}</td>`)}
        </tr>
      </table>
    `;
  }
}

customElements.define('h-output', HelperOutput);
