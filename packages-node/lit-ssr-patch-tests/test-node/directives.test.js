/**
 * @license
 * Copyright 2026 ING Bank N.V.
 * SPDX-License-Identifier: MIT
 *
 * Proves that `@lit-labs/ssr` renders *element directives* (directives bound to
 * an element part, e.g. `<div ${myDirective()}>`) during server rendering, and
 * that the attributes they set on the (light) DOM are serialized.
 *
 * This behavior comes from the local patch on `@lit-labs/ssr`
 * (see `patches/@lit-labs+ssr+*.patch`). Upstream lit deliberately skips
 * element parts during SSR: the directive's `update()` is never called and
 * nothing is emitted, so parts reported by a directive are missing from the
 * server output and hydration mismatches.
 */
import { expect } from 'chai';
import { html as litHtml, LitElement } from 'lit';
import { html as serverHtml } from '@lit-labs/ssr';

import {
  DirectiveHost,
  LightDomPartHost,
  invocationLog,
  part,
  resetInvocationLog,
  renderToString,
} from './fixtures.js';

describe('lit-ssr: element directives', () => {
  before(() => {
    customElements.define('ssr-directive-host', DirectiveHost);
    customElements.define('ssr-light-dom-part-host', LightDomPartHost);
  });

  beforeEach(() => {
    resetInvocationLog();
  });

  it('runs an element directive while rendering on the server', () => {
    const result = renderToString(litHtml`<ssr-directive-host></ssr-directive-host>`);

    expect(result).to.contain('<ssr-directive-host');
    // The directive actually executed on the server.
    expect(invocationLog).to.include('part:root');
  });

  it('serializes the attributes an element directive sets on a shadow DOM element', () => {
    const result = renderToString(litHtml`<ssr-directive-host></ssr-directive-host>`);

    expect(result).to.contain('data-part="root"');
  });

  it('lets element directives read attributes back through part.element.getAttribute()', () => {
    const result = renderToString(litHtml`<ssr-directive-host></ssr-directive-host>`);

    expect(invocationLog).to.include('round-trip:data-rt');
    expect(result).to.contain('data-rt="round-trip"');
    // The value was read back off the element renderer and re-serialized.
    expect(result).to.contain('data-rt-read="round-trip"');
  });

  it('exposes the custom element host to element directives via part.options.host', () => {
    const result = renderToString(litHtml`<ssr-directive-host></ssr-directive-host>`);

    expect(invocationLog).to.include('host:data-host');
    expect(result).to.contain('data-host="ssr-directive-host"');
  });

  it('renders element directives that live in light DOM (renderLight)', () => {
    const result = renderToString(litHtml`<ssr-light-dom-part-host></ssr-light-dom-part-host>`);

    expect(invocationLog).to.include('part:root');
    expect(result).to.contain('class="light"');
    expect(result).to.contain('data-part="root"');
  });

  it('renders element directives in server-only (non-hydratable) templates', () => {
    // Server-only templates used to throw for element parts. They must render
    // them like any other template now.
    class ServerOnlyHost extends LitElement {
      refs = {};

      render() {
        return serverHtml`<b ${part(this, 'server')} data-server-only>server</b>`;
      }
    }
    customElements.define('ssr-server-only-host', ServerOnlyHost);

    const result = renderToString(serverHtml`<ssr-server-only-host></ssr-server-only-host>`);

    expect(invocationLog).to.include('part:server');
    expect(result).to.contain('data-server-only');
    expect(result).to.contain('data-part="server"');
  });
});
