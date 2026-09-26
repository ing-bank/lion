/**
 * @license
 * Copyright 2026 ING Bank N.V.
 * SPDX-License-Identifier: MIT
 *
 * Astro integration that renders Lit components on the server (via
 * `@lit-labs/ssr`) and hydrates them in the browser.
 *
 * This is an in-repo replacement for `@astrojs/lit`. It lives in the repo so it
 * can follow the lit-labs/ssr version pinned in the root package.json and the
 * local lit-labs/ssr patch this repo carries
 * (see `patches/@lit-labs+ssr+*.patch`), instead of being pinned to whatever
 * lit-labs/ssr range `@astrojs/lit` supports.
 */
import { readFileSync } from 'fs';

const name = '@lion/astro-lit';

/**
 * Entrypoints, as package subpaths (see the `exports` map in package.json).
 *
 * Astro uses these strings twice: as Vite build inputs (for the client) and as
 * the keys of the client manifest that hydrated islands point at. That is why
 * they must be stable specifiers and not `file://` URLs — Astro drops non-string
 * client entrypoints from the client build, which then fails per island with
 * "Cannot find the built path for ...". Both the Vite and the Container API
 * paths resolve the same package subpaths, so one specifier works everywhere.
 */
const serverEntrypoint = '@lion/astro-lit/server.js';
const clientEntrypoint = '@lion/astro-lit/client.js';

/** Vite configuration needed for Lit to work in dev and in builds. */
function getViteConfiguration() {
  return {
    optimizeDeps: {
      include: [
        '@lit-labs/ssr-client/lit-element-hydrate-support.js',
        '@webcomponents/template-shadowroot/template-shadowroot.js',
      ],
    },
    ssr: {
      // These need the "node" export condition of lit / lit-html.
      external: ['lit', 'lit-element', 'lit-html', '@lit-labs/ssr', '@lit-labs/ssr-client'],
    },
  };
}

/**
 * Renderer description used by Astro's Container API
 * (`experimental_AstroContainer#addServerRenderer`).
 */
export function getContainerRenderer() {
  return {
    name,
    serverEntrypoint,
  };
}

export default function lit() {
  return {
    name,
    hooks: {
      'astro:config:setup': ({ updateConfig, addRenderer, injectScript }) => {
        injectScript(
          'head-inline',
          readFileSync(new URL('./client-shim.js', import.meta.url), { encoding: 'utf-8' }),
        );
        injectScript(
          'before-hydration',
          `import '@lit-labs/ssr-client/lit-element-hydrate-support.js';`,
        );
        addRenderer({
          name,
          serverEntrypoint,
          clientEntrypoint,
        });
        updateConfig({ vite: getViteConfiguration() });
      },
      'astro:build:setup': ({ vite, target }) => {
        if (target === 'server') {
          // Astro hands the same mutable Vite config object to every
          // integration, so mutating it here is the contract of this hook.
          /* eslint-disable no-param-reassign */
          vite.ssr ??= {};
          vite.ssr.noExternal ??= [];
          /* eslint-enable no-param-reassign */
          if (Array.isArray(vite.ssr.noExternal)) {
            vite.ssr.noExternal.push('lit');
          }
        }
      },
    },
  };
}
