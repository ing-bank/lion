/**
 * @license
 * Copyright 2026 ING Bank N.V.
 * SPDX-License-Identifier: MIT
 *
 * Astro server entrypoint (container renderer) for Lit.
 *
 * This is an in-repo replacement for `@astrojs/lit/server.js`. It is written
 * against the lit-labs/ssr version pinned in this repo (see `overrides` in the
 * root package.json) and against the local lit-labs/ssr patch that teaches SSR
 * to run element directives and to render light DOM
 * (see `patches/@lit-labs+ssr+*.patch`).
 *
 * The server shim import must come first: it installs the DOM globals Lit SSR
 * expects before any Lit element code is evaluated.
 */
import './server-shim.js';

import { LitElementRenderer } from '@lit-labs/ssr/lib/lit-element-renderer.js';
import { RenderResultIterator } from '@lit-labs/ssr/lib/render.js';
import * as parse5 from 'parse5';

function isCustomElementTag(name) {
  return typeof name === 'string' && /-/.test(name);
}

function getCustomElementConstructor(name) {
  if (typeof customElements !== 'undefined' && isCustomElementTag(name)) {
    return customElements.get(name) || null;
  }
  if (typeof name === 'function') {
    return name;
  }
  return null;
}

async function isLitElement(Component) {
  const Ctr = getCustomElementConstructor(Component);
  return Boolean(Ctr?._$litElement$);
}

/**
 * Tell Astro whether this renderer handles a given component.
 */
async function check(Component) {
  // Lit cannot get a tagName from a constructor, so this must be a string.
  return Boolean(await isLitElement(Component));
}

/**
 * A complete lit-labs/ssr render context. Every key matters: `renderValue()`
 * reads `slotStack` / `eventTargetStack` while rendering nested elements, so
 * omitting them (as the old `@astrojs/lit` did) breaks on newer lit-labs/ssr.
 */
function createRenderInfo(instance) {
  return {
    elementRenderers: [LitElementRenderer],
    customElementInstanceStack: [instance],
    customElementHostStack: [instance],
    eventTargetStack: [],
    slotStack: [],
    deferHydration: false,
  };
}

/**
 * Yields the chunks of the rendered element. The chunks are handed to a
 * `RenderResultIterator` (see below), so they may be strings, thunks returning
 * strings/arrays, or arrays of those — exactly like lit-labs/ssr's own
 * `renderTemplateResult()` output.
 */
function* render(Component, attrs, slots) {
  let tagName = Component;
  if (typeof tagName !== 'string') {
    tagName = Component[Symbol.for('tagName')];
  }
  const instance = new LitElementRenderer(tagName);

  // LitElementRenderer creates a new element instance, so copy over.
  const Ctr = getCustomElementConstructor(tagName);
  let shouldDeferHydration = false;

  if (attrs) {
    for (const [name, value] of Object.entries(attrs)) {
      const isReactiveProperty = name in Ctr.prototype;
      const isReflectedReactiveProperty = Ctr.elementProperties.get(name)?.reflect;

      // Only defer hydration if we are setting a reactive property that cannot
      // be reflected / serialized as an attribute.
      shouldDeferHydration ||= isReactiveProperty && !isReflectedReactiveProperty;

      if (isReactiveProperty) {
        instance.setProperty(name, value);
      } else {
        instance.setAttribute(name, value);
      }
    }
  }

  instance.connectedCallback();

  yield `<${tagName}${shouldDeferHydration ? ' defer-hydration' : ''}`;
  yield () => instance.renderAttributes();
  yield '>';

  const renderInfo = createRenderInfo(instance);
  const shadowContents = instance.renderShadow(renderInfo);
  if (shadowContents !== undefined) {
    const { mode = 'open', delegatesFocus } = instance.shadowRootOptions ?? {};
    // `delegatesFocus` is intentionally allowed to coerce to boolean to match
    // web platform behavior.
    const delegatesFocusAttr = delegatesFocus ? ' shadowrootdelegatesfocus' : '';
    yield `<template shadowroot="${mode}" shadowrootmode="${mode}"${delegatesFocusAttr}>`;
    // Materialize the generator: `renderShadow()` yields thunks that
    // `RenderResultIterator` knows how to trampoline.
    yield () => [...shadowContents];
    yield '</template>';
  }

  if (slots) {
    for (const [slot, slotContent = ''] of Object.entries(slots)) {
      let value = slotContent;
      if (slot !== 'default' && value) {
        // Parse the value as a concatenated string and add the missing slot
        // attribute to the child element nodes.
        const fragment = parse5.parseFragment(`${value}`);
        for (const node of fragment.childNodes) {
          if (node.tagName && !node.attrs.some(({ name }) => name === 'slot')) {
            node.attrs.push({ name: 'slot', value: slot });
          }
        }
        value = parse5.serialize(fragment);
      }
      yield value;
    }
  }

  yield `</${tagName}>`;
}

async function renderToStaticMarkup(Component, props, slots) {
  const result = new RenderResultIterator(render(Component, props, slots));

  let out = '';
  for (const chunk of result) {
    out += chunk;
  }

  return { html: out };
}

export default {
  name: '@lion/astro-lit',
  check,
  renderToStaticMarkup,
};
