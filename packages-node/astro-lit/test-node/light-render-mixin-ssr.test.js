/**
 * Server side rendering of `LightRenderMixin`.
 *
 * The mixin implements the light dom protocol of `@lit-labs/ssr` (`renderLight()`), so the slot
 * templates end up as light dom in the initial html response: available to crawlers (which ignore
 * the content of a `<template>`, so declarative shadow dom alone is invisible to them) and to
 * clients that do not run JavaScript.
 *
 * Proves that:
 *  - the light dom is in the response, including the accessible relation between the nodes
 *  - it carries the `slot` attribute, so it is assigned to the shadow dom outlets
 *  - it is marked (`data-light-render="ssr"`) so the client render takes over without duplication
 *  - the declarative shadow root is still emitted
 *  - a conditional slot (a template returning undefined) is not rendered
 */
import { expect } from 'chai';
import { LitElement, html } from 'lit';
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { renderLight } from '@lit-labs/ssr-client/directives/render-light.js';

import { LightRenderMixin } from '@lion/ui/core.js';

class SsrField extends LightRenderMixin(LitElement) {
  static get properties() {
    return { labelText: { type: String } };
  }

  constructor() {
    super();
    this.labelText = 'server rendered label';
  }

  get slots() {
    return {
      input: () => html`<input id="the-input" />`,
      label: () => html`<label for="the-input">${this.labelText}</label>`,
      conditional: () => undefined,
    };
  }

  render() {
    return html`<div class="wrapper"><slot name="label"></slot><slot name="input"></slot></div>`;
  }
}
customElements.define('lion-ssr-field', SsrField);

const renderToString = template => collectResult(render(template));

describe('LightRenderMixin server side rendering', () => {
  it('renders the slot templates as light dom in the response', async () => {
    const result = await renderToString(html`<lion-ssr-field>${renderLight()}</lion-ssr-field>`);

    expect(result).to.include('server rendered label');
    expect(result).to.include('id="the-input"');
    expect(result).to.match(/<label[^>]*for="the-input"/);
    expect(result).to.include('slot="label"');
    expect(result).to.include('slot="input"');
  });

  it('marks the server rendered light dom so the client render takes it over', async () => {
    const result = await renderToString(html`<lion-ssr-field>${renderLight()}</lion-ssr-field>`);

    expect(result).to.include('data-light-render="ssr"');
  });

  it('still emits the declarative shadow root with the slot outlets', async () => {
    const result = await renderToString(html`<lion-ssr-field>${renderLight()}</lion-ssr-field>`);

    expect(result).to.match(/<template shadowroot[^>]*>/);
    expect(result).to.include('<slot name="label">');
    expect(result).to.include('<slot name="input">');
  });

  it('does not render a conditional slot (template returning undefined)', async () => {
    const result = await renderToString(html`<lion-ssr-field>${renderLight()}</lion-ssr-field>`);

    expect(result).to.not.include('slot="conditional"');
  });

  it('renders no light dom when the template does not ask for it', async () => {
    const result = await renderToString(html`<lion-ssr-field></lion-ssr-field>`);

    expect(result).to.not.include('server rendered label');
    // the shadow dom render is unaffected
    expect(result).to.include('<slot name="label">');
  });
});
