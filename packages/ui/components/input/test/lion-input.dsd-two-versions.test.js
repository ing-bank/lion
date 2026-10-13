import { expect } from '@open-wc/testing';
import { LitElement, html } from 'lit';

import { ScopedElementsMixin, supportsScopedRegistry } from '../../core/src/ScopedElementsMixin.js';
import {
  DSD_NULL_REGISTRY_HOST_ATTRIBUTE,
  DSD_NULL_REGISTRY_TEMPLATE_ATTRIBUTE,
  NULL_REGISTRY_ELEMENT_ATTRIBUTES,
  SCOPED_REGISTRY_HASH_ATTRIBUTE,
  hydrateScopedRegistries,
  registerScopedRegistry,
  scopedRegistryHash,
} from '../../core/src/scopedElementsHydration.js';
import { LionInput } from '../src/LionInput.js';

/**
 * Two versions of the same tag, server rendered as declarative shadow DOM and hydrated on the client.
 *
 * Stand-in for the future: two majors of `@lion/ui` on one page, so each has to resolve `lion-input`
 * to *its own* class. On the server there is no scoping at all, so the markup can only record which
 * version a shadow root belongs to (`data-scoped-registry`); the client resolves that hash to a
 * registry and claims the parser created root for it before the elements upgrade.
 *
 * Declarative shadow DOM cannot be scoped at all in a browser without scoped registries, nor with the
 * 0.x polyfill (it has no `initialize`), so this test skips there.
 */

/** The version that is on npm today, and a would-be next major. */
class LionInputNext extends LionInput {}

const CURRENT_VERSION = '0.21.1';
const NEXT_VERSION = '0.22.0-next';
const hashCurrent = scopedRegistryHash({ tagName: 'lion-input', version: CURRENT_VERSION });
const hashNext = scopedRegistryHash({ tagName: 'lion-input', version: NEXT_VERSION });

/**
 * `data-scoped-registry` names a constructor/version, never a class instance; two versions of the same
 * tag have to end up with different hashes, or they would share one registry.
 */
/** @param {string} hash */
const hashAttributes = hash => {
  const attributes = [
    `${SCOPED_REGISTRY_HASH_ATTRIBUTE}="${hash}"`,
    `${DSD_NULL_REGISTRY_HOST_ATTRIBUTE}`,
    ...NULL_REGISTRY_ELEMENT_ATTRIBUTES,
  ];
  return attributes.join(' ');
};

/**
 * What a server would render for a host whose shadow root should be scoped to `hash`.
 *
 * @param {string} tagName
 * @param {string} hash
 * @param {string} inputName
 */
const serverMarkup = (tagName, hash, inputName) =>
  `<${tagName} ${hashAttributes(hash)}>` +
  `<template shadowrootmode="open" ${DSD_NULL_REGISTRY_TEMPLATE_ATTRIBUTE}>` +
  `<span id="server-${inputName}">server rendered</span>` +
  `<lion-input name="${inputName}"></lion-input>` +
  '</template>' +
  `</${tagName}>`;

const hasInitialize = () =>
  typeof (/** @type {any} */ (CustomElementRegistry.prototype).initialize) === 'function';

describe('server rendered (declarative) shadow DOM with two versions of lion-input', () => {
  /** @type {HTMLElement} */ let container;
  /** @type {any} */ let CurrentHost;
  /** @type {any} */ let NextHost;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
  });

  const defineHosts = () => {
    // The app's two versions, each with its own definition of the same tag, exactly like the
    // `form-associated` demos: same tag name, different class, one registry each.
    CurrentHost = class ScopedElementsHostCurrent extends ScopedElementsMixin(LitElement) {
      static scopedElements = { 'lion-input': LionInput };

      render() {
        return html`<lion-input name="current"></lion-input>`;
      }
    };
    NextHost = class ScopedElementsHostNext extends ScopedElementsMixin(LitElement) {
      static scopedElements = { 'lion-input': LionInputNext };

      render() {
        return html`<lion-input name="next"></lion-input>`;
      }
    };
    customElements.define('poc-scoped-current-host', CurrentHost);
    customElements.define('poc-scoped-next-host', NextHost);
  };

  /**
   * @param {string} version
   * @param {typeof HTMLElement} klass
   */
  const registryFor = (version, klass) => {
    const registry = new CustomElementRegistry();
    registry.define('lion-input', klass);
    registerScopedRegistry(scopedRegistryHash({ tagName: 'lion-input', version }), registry);
    return registry;
  };

  it('scopes each server rendered root to its own version', async () => {
    if (!supportsScopedRegistry() || !hasInitialize()) {
      // No `initialize` means a parser created root cannot be scoped: nothing to assert here.
      // `no-support` mode (no scoped registries) and the 0.x polyfill land in this branch.
      return;
    }

    container.setHTMLUnsafe(
      serverMarkup('poc-scoped-current-host', hashCurrent, 'current') +
        serverMarkup('poc-scoped-next-host', hashNext, 'next'),
    );
    const hostCurrent = /** @type {any} */ (container.querySelector('poc-scoped-current-host'));
    const hostNext = /** @type {any} */ (container.querySelector('poc-scoped-next-host'));
    const rootCurrent = hostCurrent.shadowRoot;
    const rootNext = hostNext.shadowRoot;

    // the parser created both roots, and neither has a registry yet
    expect(rootCurrent, 'the server rendered root must exist').to.not.equal(null);
    expect(rootNext, 'the server rendered root must exist').to.not.equal(null);
    expect(
      rootCurrent.customElementRegistry ?? null,
      'a parser created root has no registry',
    ).to.equal(null);

    const registryCurrent = registryFor(CURRENT_VERSION, LionInput);
    const registryNext = registryFor(NEXT_VERSION, LionInputNext);

    const report = hydrateScopedRegistries(container);
    expect(report.claimed, 'both hashes must resolve and be claimed').to.have.lengthOf(2);
    expect(rootCurrent.customElementRegistry, 'the current root gets its own registry').to.equal(
      registryCurrent,
    );
    expect(rootNext.customElementRegistry, 'the next root gets its own registry').to.equal(
      registryNext,
    );

    // now the app's bundle defines the hosts; they upgrade and must reuse the existing roots
    defineHosts();
    expect(hostCurrent.shadowRoot, 'the declarative root must be reused, not re-attached').to.equal(
      rootCurrent,
    );
    expect(
      rootCurrent.getElementById('server-current'),
      'the server rendered content must survive hydration',
    ).to.not.equal(null);
    expect(
      hostCurrent.shadowRoot.customElementRegistry,
      'the mixin keeps the registry of the root',
    ).to.equal(registryCurrent);
    expect(
      hostNext.shadowRoot.customElementRegistry,
      'and the other version keeps its own',
    ).to.equal(registryNext);

    // the same tag name resolves to a different class per host, from the parser created markup
    const inputCurrent = rootCurrent.querySelector('lion-input');
    const inputNext = rootNext.querySelector('lion-input');
    expect(inputCurrent, 'current host: the server rendered input upgrades').to.be.instanceOf(
      LionInput,
    );
    expect(inputCurrent, 'current host: and not as the other version').to.not.be.instanceOf(
      LionInputNext,
    );
    expect(
      inputNext,
      'next host: the server rendered input upgrades to the next version',
    ).to.be.instanceOf(LionInputNext);

    await Promise.all([hostCurrent.updateComplete, hostNext.updateComplete]);
    expect(
      rootCurrent.querySelector('lion-input').constructor,
      'after the first client render the input is still the current version',
    ).to.equal(LionInput);
    expect(
      rootNext.querySelector('lion-input').constructor,
      'and the next host still renders the next version',
    ).to.equal(LionInputNext);
  });

  it('fails loudly when the markup names a version the client does not have', async () => {
    if (!supportsScopedRegistry() || !hasInitialize()) {
      return;
    }
    container.setHTMLUnsafe(
      serverMarkup(
        'poc-scoped-current-host',
        scopedRegistryHash({ tagName: 'lion-input', version: '9.9.9-unknown' }),
        'current',
      ),
    );
    expect(
      () => hydrateScopedRegistries(container),
      'an unregistered hash is a hydration mismatch, not something to render quietly',
    ).to.throw(/no registry was registered/);
  });
});
