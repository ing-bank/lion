/**
 * @license
 * Copyright 2026 ING Bank N.V.
 * SPDX-License-Identifier: MIT
 *
 * Shared fixtures for the lit-ssr unit tests.
 *
 * These fixtures model the pattern that `@lion/ui` (and the Lion website
 * components) rely on: *element directives* that run while rendering on the
 * server and mutate the element they are attached to (a "part"). Lit itself
 * only runs directives attached to a child part (`${...}` as tag content),
 * not directives attached to an element part (`<div ${...}>`), unless
 * `@lit-labs/ssr` is patched (see `patches/@lit-labs+ssr+*.patch`).
 */
import { LitElement, html } from 'lit';
import { Directive, directive } from 'lit/directive.js';
import { render } from '@lit-labs/ssr';
import { renderLight } from '@lit-labs/ssr-client/directives/render-light.js';

/**
 * Records how many times every element directive below actually ran. Used by
 * the tests to prove that directives are executed during server rendering
 * instead of being skipped.
 */
export const invocationLog = [];

export function resetInvocationLog() {
  invocationLog.length = 0;
}

/**
 * Models Lion's `UIPartDirective`: attached to an element part, it marks the
 * element (`data-part`) and registers it as a "ref" on the context. Both the
 * attribute write and the registration must happen on the server for the
 * rendered (light) DOM to come out correctly.
 */
export class PartDirective extends Directive {
  update(elementPart, [context, name]) {
    invocationLog.push(`part:${name}`);
    elementPart.element.setAttribute('data-part', name);
    context.refs[name] = elementPart.element;
    return undefined;
  }

  render() {}
}
export const part = directive(PartDirective);

/**
 * Sets an attribute, reads it back off the element it is attached to, and
 * writes the read value to a second attribute. The read exercises
 * `FallbackRenderer#getAttribute`, which the patch adds (without it, reading an
 * attribute off a plain element renderer throws).
 */
export class RoundTripDirective extends Directive {
  update(elementPart, [attribute]) {
    invocationLog.push(`round-trip:${attribute}`);
    elementPart.element.setAttribute(attribute, 'round-trip');
    const read = elementPart.element.getAttribute(attribute);
    elementPart.element.setAttribute(`${attribute}-read`, read);
    return undefined;
  }

  render() {}
}
export const roundTrip = directive(RoundTripDirective);

/**
 * Reads the host element (the custom element the template belongs to) through
 * `elementPart.options.host`, which the patch populates from the renderer's
 * custom-element host stack.
 */
export class HostAwareDirective extends Directive {
  update(elementPart, [attribute]) {
    invocationLog.push(`host:${attribute}`);
    elementPart.element.setAttribute(attribute, elementPart.options.host.tagName.toLowerCase());
    return undefined;
  }

  render() {}
}
export const fromHost = directive(HostAwareDirective);

/**
 * Renders every kind of element directive inside its (declarative) shadow
 * DOM. `context.refs` mirrors the "ref registry" Lion's part directive uses.
 */
export class DirectiveHost extends LitElement {
  refs = {};

  render() {
    return html`
      <div class="shadow">
        <span ${part(this, 'root')}>shadow child</span>
        <span ${roundTrip('data-rt')}></span>
        <span ${fromHost('data-host')}></span>
      </div>
    `;
  }
}

/**
 * Renders its light DOM through `renderLight()`, the lit-ssr hook for content
 * that ends up in the light DOM. The part directive lives in that light DOM
 * template.
 */
export class LightDomPartHost extends LitElement {
  refs = {};

  render() {
    return html`<div class="shadow">${renderLight()}</div>`;
  }

  renderLight() {
    return html`<div ${part(this, 'root')} class="light">light child</div>`;
  }
}

/**
 * Renders a template on the server and concatenates the chunks into the final
 * HTML string, exactly like `@lit-labs/ssr`'s `render()` is meant to be used.
 *
 * @param {import('lit').TemplateResult} template
 * @param {import('@lit-labs/ssr').RenderInfo} [renderOptions]
 * @returns {string}
 */
export function renderToString(template, renderOptions) {
  let out = '';
  for (const chunk of render(template, renderOptions)) {
    out += chunk;
  }
  return out;
}
