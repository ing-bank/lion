const fs = require('fs');
const path = require('path');

module.exports = {
  stories: [
    '../packages/*/stories/*.stories.{js,mdx}',
    '../packages/helpers/*/stories/*.stories.{js,mdx}',
    '../demo/stories/*.stories.{js,mdx}',
  ],
  addons: [
    'storybook-prebuilt/addon-docs/register.js',
    'storybook-prebuilt/addon-actions/register.js',
    'storybook-prebuilt/addon-knobs/register.js',
    'storybook-prebuilt/addon-a11y/register.js',
    'storybook-prebuilt/addon-backgrounds/register.js',
    'storybook-prebuilt/addon-links/register.js',
    'storybook-prebuilt/addon-viewport/register.js',
  ],
  esDevServer: {
    nodeResolve: true,
    watch: true,
    open: true,
  },
  rollup: config => {
    // temporarily hard copy all needed global files as all tested rollup plugins flatten the
    // directory structure
    // `rollup-plugin-copy` might work if issue 37 is resolved
    // https://github.com/vladshcherbin/rollup-plugin-copy/issues/37
    config.plugins.push({
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'packages/form-system/dev-assets/FormatMixinDiagram-1.svg',
          source: fs.readFileSync(
            path.join(__dirname, '../packages/form-system/dev-assets/FormatMixinDiagram-1.svg'),
          ),
        });
        this.emitFile({
          type: 'asset',
          fileName: 'packages/form-system/dev-assets/FormatMixinDiagram-2.svg',
          source: fs.readFileSync(
            path.join(__dirname, '../packages/form-system/dev-assets/FormatMixinDiagram-2.svg'),
          ),
        });
        this.emitFile({
          type: 'asset',
          fileName: 'packages/form-system/dev-assets/FormatMixinDiagram-3.svg',
          source: fs.readFileSync(
            path.join(__dirname, '../packages/form-system/dev-assets/FormatMixinDiagram-3.svg'),
          ),
        });
      },
    });
  },
};
