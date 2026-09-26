/**
 * @license
 * Copyright 2026 ING Bank N.V.
 * SPDX-License-Identifier: MIT
 *
 * Unit tests for the in-repo Astro + Lit container renderer
 * (`@lion/astro-lit/server.js`).
 *
 * Astro renders a Lit component by calling the renderer's
 * `renderToStaticMarkup()` (for server-rendered islands) and by importing the
 * same module through the Container API. Testing this module directly proves
 * that:
 *  - Lit components render on the server (declarative shadow DOM included)
 *  - reactive props are set as properties / reflected attributes as appropriate
 *  - named slots are rewritten with the correct `slot` attribute
 *  - element directives (`<div ${part()}>`) run — which is what the local
 *    lit-labs/ssr patch enables
 */
import { expect } from 'chai';
import { LitElement, html } from 'lit';

import litServer from '@lion/astro-lit/server.js';
import { getContainerRenderer } from '@lion/astro-lit';
import { invocationLog, part, resetInvocationLog } from './fixtures.js';

class AstroGreeting extends LitElement {
  static properties = {
    greeting: { type: String },
    count: { type: Number, reflect: true },
  };

  refs = {};

  constructor() {
    super();
    this.greeting = 'hello';
    this.count = 0;
  }

  render() {
    return html`
      <div class="root">
        <span ${part(this, 'greeting')}>${this.greeting}</span>
        <slot name="footer"></slot>
      </div>
    `;
  }
}

class NotALitElement {}

describe('astro integration: Lit container renderer', () => {
  before(() => {
    customElements.define('astro-greeting', AstroGreeting);
  });

  beforeEach(() => {
    resetInvocationLog();
  });

  it('identifies itself as the lit server entrypoint', () => {
    expect(litServer.name).to.equal('@lion/astro-lit');
    expect(litServer.renderToStaticMarkup).to.be.a('function');
    expect(litServer.check).to.be.a('function');
  });

  it('recognizes Lit components and rejects everything else', async () => {
    expect(await litServer.check('astro-greeting')).to.equal(true);
    expect(await litServer.check(AstroGreeting)).to.equal(true);

    expect(await litServer.check(NotALitElement)).to.equal(false);
    expect(await litServer.check('div')).to.equal(false);
    expect(await litServer.check('not-registered-yet')).to.equal(false);
  });

  it('renders a Lit component with a declarative shadow root', async () => {
    const { html: rendered } = await litServer.renderToStaticMarkup('astro-greeting', {}, {});

    expect(rendered).to.contain('<astro-greeting');
    expect(rendered).to.contain('<template shadowroot="open" shadowrootmode="open">');
    expect(rendered).to.contain('<div class="root">');
    expect(rendered).to.contain('hello');
    expect(rendered).to.contain('</astro-greeting>');
  });

  it('sets reactive props (property + reflected attribute)', async () => {
    const { html: rendered } = await litServer.renderToStaticMarkup(
      'astro-greeting',
      { greeting: 'goodbye', count: 3 },
      {},
    );

    expect(rendered).to.contain('goodbye');
    // `count` is reflected, so it is serialized as an attribute.
    expect(rendered).to.contain('count="3"');
  });

  it('renders element directives inside Lit components (lit-ssr patch)', async () => {
    const { html: rendered } = await litServer.renderToStaticMarkup('astro-greeting', {}, {});

    expect(invocationLog).to.include('part:greeting');
    expect(rendered).to.contain('data-part="greeting"');
  });

  it('rewrites named slot content with the matching slot attribute', async () => {
    const { html: rendered } = await litServer.renderToStaticMarkup(
      'astro-greeting',
      {},
      { footer: '<span>slotted</span>' },
    );

    expect(rendered).to.contain('<span slot="footer">slotted</span>');
  });

  it('exposes a container renderer pointing at the server entrypoint', () => {
    const renderer = getContainerRenderer();

    expect(renderer.name).to.equal('@lion/astro-lit');
    // A resolvable specifier, not a `file://` URL: it has to work as a Vite
    // build input *and* as a key in Astro's client manifest, and the Container
    // API resolves the same subpath through Node.
    expect(renderer.serverEntrypoint).to.equal('@lion/astro-lit/server.js');
    expect(import.meta.resolve(renderer.serverEntrypoint)).to.match(
      /packages-node\/astro-lit\/src\/server\.js$/,
    );
  });
});
