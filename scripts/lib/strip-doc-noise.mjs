/**
 * Strip docs-site-only noise from a doc page before it is merged into a skill reference.
 *
 * The docs are authored for the Eleventy/mdjs site; the skill is a derived artifact for a *code
 * consumer*. These constructs are pure noise in the skill and actively misleading: a model reading a
 * component reference may think it must import `@mdjs/mdjs-preview`, or that a `demo-*` element
 * exists as part of `@lion/ui`.
 *
 * Handled here (measured across docs/: 94 mdjs imports in 6 binding shapes, relative demo modules):
 *   - `import { html } from '@mdjs/mdjs-preview'`      -> `import { html } from 'lit'`
 *   - `import { html as previewHtml } from '...'`      -> `import { html as previewHtml } from 'lit'`
 *   - `import { css, html } from '@mdjs/mdjs-preview'` -> `import { css, html } from 'lit'`
 *   - `<mdjs-preview>...</mdjs-preview>` wrappers      -> removed
 *   - relative demo modules (`./src/demoStyle.js`, `../listbox/src/listboxData.js`) -> removed
 */
const LIT_BINDINGS = new Set(['html', 'css', 'svg', 'nothing', 'render', 'LitElement']);

export function stripDocNoise(markdown) {
  return markdown
    .replace(
      /^import\s*\{([^}]*)\}\s*from\s*['"]@mdjs\/mdjs-preview['"];?[ \t]*$/gm,
      (line, bindings) => {
        const kept = bindings
          .split(',')
          .map(binding => binding.trim())
          .filter(Boolean)
          .filter(binding => LIT_BINDINGS.has(binding.split(/\s+as\s+/)[0].trim()));
        return kept.length > 0 ? `import { ${kept.join(', ')} } from 'lit';` : '';
      },
    )
    // Relative demo modules: only paths that reach into a `src/` folder do not resolve for a consumer.
    .replace(/^import\s+[^;]*from\s*['"](?:\.\.?\/)(?:[^'"]*\/)?src\/[^'"]*['"];?[ \t]*$/gm, '')
    // Side-effect variant: `import './src/demoStyle.js';`
    .replace(/^import\s*['"](?:\.\.?\/)(?:[^'"]*\/)?src\/[^'"]*['"];?[ \t]*$/gm, '')
    .replace(/<\/?mdjs-preview[^>]*>/g, '')
    .replace(/\n{3,}/g, '\n\n');
}
