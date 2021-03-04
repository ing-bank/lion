const fs = require('fs');
const path = require('path');
const globby = require('globby');

module.exports = {
  stories: globby
    .sync([
      './{packages,packages-node}/*/README.md',
      './{packages,packages-node}/*/docs/*.md',
      './{packages,packages-node}/*/docs/!(assets)**/*.md',
      './{packages,packages-node}/*/docs/validate/!(assets)**/*.md',
      './packages/helpers/*/README.md',
      './docs/README.md',
      './docs/**/*.md',
      './README.md',
      './demo/README.md',
      './demo/docs/*.md',
    ])
    .filter(file => file !== 'packages/form-core/docs/validate/assets/FlowDiagram.md') // filter out this one
    .map(url => `../${url}`), // map glob results relative to root which is '../' from .storybook/main.js
  addons: ['@web/storybook-prebuilt/addons.js'],
  rollupConfig(config) {
    // temporarily hard copy all needed global files as all tested rollup plugins flatten the
    // directory structure
    // `rollup-plugin-copy` might work if issue 37 is resolved
    // https://github.com/vladshcherbin/rollup-plugin-copy/issues/37
    config.plugins.push({
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'packages/form-integrations/dev-assets/FormatMixinDiagram-1.svg',
          source: fs.readFileSync(
            path.join(
              __dirname,
              '../packages/form-integrations/dev-assets/FormatMixinDiagram-1.svg',
            ),
          ),
        });
        this.emitFile({
          type: 'asset',
          fileName: 'packages/form-integrations/dev-assets/FormatMixinDiagram-2.svg',
          source: fs.readFileSync(
            path.join(
              __dirname,
              '../packages/form-integrations/dev-assets/FormatMixinDiagram-2.svg',
            ),
          ),
        });
        this.emitFile({
          type: 'asset',
          fileName: 'packages/form-integrations/dev-assets/FormatMixinDiagram-3.svg',
          source: fs.readFileSync(
            path.join(
              __dirname,
              '../packages/form-integrations/dev-assets/FormatMixinDiagram-3.svg',
            ),
          ),
        });
        this.emitFile({
          type: 'asset',
          fileName: 'packages/ajax/docs/pabu.json',
          source: fs.readFileSync(path.join(__dirname, '../packages/ajax/docs/pabu.json')),
        });
        this.emitFile({
          type: 'asset',
          fileName: 'packages/ajax/docs/naga.json',
          source: fs.readFileSync(path.join(__dirname, '../packages/ajax/docs/naga.json')),
        });
      },
    });
  },
};
