/**
 * Server side rendering (declarative shadow DOM) support for scoped custom element registries.
 *
 * A server renders a shadow root as a declarative template. The HTML parser turns that into a real
 * shadow root **before any script runs**, and - measured in Chromium, with the markers below - that
 * root ends up with a **null** registry. A null registry is assignable, but only through
 * `customElementRegistry.initialize(node)`, and only if the *shadow root itself* is passed (passing
 * the host does nothing, its registry already comes from its tree). Since the parser created the root,
 * no `attachShadow` call is involved and the registry cannot be handed over as an option.
 *
 * So a page with server rendered scoped elements has to leave an identity behind in the markup, and
 * resolve it to a registry on the client, *before* the elements upgrade:
 *
 * 1. the server renders, on every host that needs a scoped registry, the markers in
 *    `scopedRegistryMarkupAttributes()` and our own `data-scoped-registry="<hash>"`;
 * 2. the client calls `registerScopedRegistry(hash, registry)` for every version it can hydrate,
 *    with a registry that has that version's classes defined in it;
 * 3. the client calls `hydrateScopedRegistries(document)` once, which claims each server rendered
 *    shadow root for the registry its hash points at.
 *
 * The hash names a *constructor identity* - a version of a component, not a single class: the same tag
 * name maps to a different class in each version, and two versions must not resolve to one registry.
 * It is deliberately computed from stable, serializable inputs (tag name, version, optional build id)
 * rather than from a class or function, which is not stable: `Function.prototype.toString` changes
 * under minification and two copies of the same version are two distinct classes that must still share
 * one registry identity.
 *
 * Limitations, measured:
 * - the 0.x polyfill and a browser without scoped registries have no `initialize`, so declarative
 *   shadow DOM cannot be scoped there at all; this module then resolves nothing and `hydrateScopedRegistries`
 *   reports the hosts it could not scope.
 * - markup only ever says "this root has no registry yet" - which registry belongs there is decided by
 *   the client, which is why the hash is ours and not the browser's.
 */

/**
 * The attribute the server puts on a host, and the client reads, to name the constructor/version whose
 * registry that host's server rendered shadow root belongs to.
 */
export const SCOPED_REGISTRY_HASH_ATTRIBUTE = 'data-scoped-registry';

/**
 * On the `<template shadowrootmode>`, the parser consumes this attribute and leaves the shadow root
 * with a null registry. Markup should carry it for browsers with native support.
 */
export const DSD_NULL_REGISTRY_TEMPLATE_ATTRIBUTE = 'shadowrootcustomelementregistry';

/**
 * The same information for the polyfill, which cannot see the attribute the parser consumed. The
 * polyfill only knows this spelling, so markup carries both.
 */
export const DSD_NULL_REGISTRY_HOST_ATTRIBUTE = 'polyfill-shadowrootcustomelementregistry';

/**
 * Mark an element and its parsed contents as having a null registry, so a registry can still be
 * assigned to nodes inside it. The standard attribute is being renamed from `customelementregistry`
 * to `scopedcustomelementregistry`, so markup carries both standard spellings plus the polyfill-only
 * ones (which browsers ignore).
 */
export const NULL_REGISTRY_ELEMENT_ATTRIBUTES = [
  'scopedcustomelementregistry',
  'polyfill-scopedcustomelementregistry',
];

/**
 * A stable identity for "this constructor, this version" - what the server writes into
 * `data-scoped-registry` and the client resolves back to a registry.
 *
 * Deliberately built from serializable inputs: a class or a function is not a usable key, because
 * minification renames it and two copies of the same version are still two distinct constructors that
 * have to resolve to the same registry.
 *
 * @param {{ tagName: string, version: string, build?: string }} identity
 * @returns {string} e.g. `lion-input-1a2b3c4d`
 */
export function scopedRegistryHash({ tagName, version, build = '' }) {
  const input = `${tagName}\u0000${version}\u0000${build}`;
  // FNV-1a: tiny, deterministic, and the same on the server and in the browser (no crypto needed).
  // Bitwise on purpose - that is what makes it a hash.
  /* eslint-disable no-bitwise */
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  /* eslint-enable no-bitwise */
  return `${tagName}-${hash.toString(16).padStart(8, '0')}`;
}

/**
 * The attributes the server renders on a host whose shadow root should become scoped.
 *
 * @param {string} hash - from `scopedRegistryHash`
 * @returns {Record<string, string>}
 */
export function scopedRegistryMarkupAttributes(hash) {
  return {
    [SCOPED_REGISTRY_HASH_ATTRIBUTE]: hash,
    [DSD_NULL_REGISTRY_HOST_ATTRIBUTE]: '',
    ...Object.fromEntries(NULL_REGISTRY_ELEMENT_ATTRIBUTES.map(name => [name, ''])),
  };
}

/**
 * Registers resolved per hash, and shared by *every* copy of this module on the page: two versions of
 * Lion each ship this code, and they have to agree on one map, otherwise a hash resolves to the wrong
 * registry (or to none).
 *
 * @returns {{ schemaVersion: number, registries: Map<string, CustomElementRegistry> }}
 */
export function scopedRegistryPageState() {
  const globalScope = /** @type {any} */ (globalThis);
  if (!globalScope.__lionScopedRegistryHydration) {
    globalScope.__lionScopedRegistryHydration = { schemaVersion: 1, registries: new Map() };
  }
  return globalScope.__lionScopedRegistryHydration;
}

/**
 * Declares that the registry for `hash` is this one. Call it for every version the client can hydrate,
 * before `hydrateScopedRegistries`.
 *
 * @param {string} hash
 * @param {CustomElementRegistry} registry
 */
export function registerScopedRegistry(hash, registry) {
  scopedRegistryPageState().registries.set(hash, registry);
}

/**
 * Gives a server rendered (declarative) shadow root the registry of the version that owns it.
 *
 * The *root* must be passed, not the host: a host already has the registry of the tree it was created
 * in, so it is not a node `initialize` will touch (measured). Without this, elements the parser put
 * inside that root resolve against a null registry and never upgrade.
 *
 * @param {ShadowRoot} root - a shadow root the parser created, with a null registry
 * @param {CustomElementRegistry} registry
 * @returns {boolean} whether the registry was assigned
 */
export function claimScopedRegistry(root, registry) {
  if (!root || !registry) {
    return false;
  }
  const current = /** @type {any} */ (root).customElementRegistry;
  if (current) {
    return false; // a registry cannot change once set
  }
  const { initialize } = /** @type {any} */ (registry);
  if (typeof initialize !== 'function') {
    return false; // 0.x polyfill and browsers without support have no `initialize`
  }
  initialize.call(registry, root);
  return true;
}

/**
 * Claims every server rendered shadow root in `root` for the registry its `data-scoped-registry` hash
 * points at. Run this once, before the elements upgrade.
 *
 * A hash that was never registered is a hydration mismatch - the markup names a version the client
 * bundle does not have - so it throws: rendering something else silently would hide a real deployment
 * problem (measured: the alternative is a root that looks fine and is simply unscoped).
 *
 * @param {ParentNode} [root]
 * @returns {{ claimed: string[], unscoped: string[], unknown: string[] }}
 */
export function hydrateScopedRegistries(root = document) {
  const { registries } = scopedRegistryPageState();
  const claimed = [];
  const unscoped = [];
  const unknown = [];
  const hosts = /** @type {HTMLElement[]} */ ([
    ...root.querySelectorAll(`[${SCOPED_REGISTRY_HASH_ATTRIBUTE}]`),
  ]);
  for (const host of hosts) {
    const hash = host.getAttribute(SCOPED_REGISTRY_HASH_ATTRIBUTE);
    const registry = hash ? registries.get(hash) : undefined;
    if (!registry) {
      unknown.push(String(hash));
    } else if (claimScopedRegistry(/** @type {ShadowRoot} */ (host.shadowRoot), registry)) {
      claimed.push(String(hash));
    } else {
      unscoped.push(String(hash));
    }
  }
  if (unknown.length) {
    throw new Error(
      [
        `Cannot hydrate server rendered scoped elements: no registry was registered for ${unknown
          .map(hash => `"${hash}"`)
          .join(', ')}.`,
        'The client has to call `registerScopedRegistry(hash, registry)` - with the registry of that',
        'version - before hydrating, because the markup names a version the bundle does not define.',
      ].join(' '),
    );
  }
  return { claimed, unscoped, unknown };
}
