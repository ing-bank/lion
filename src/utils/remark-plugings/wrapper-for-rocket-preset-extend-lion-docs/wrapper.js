import { extendLionDocs } from './assets/rocket-preset-extend-lion-docs/extendLionDocs.js';

// Almost completely copied from P00019-ing-web/rocket.config.mjs. See "UPDATED" comment for more details
export const extendLionDocsInstance = await extendLionDocs({
  classPrefix: 'Ing',
  classBareImport: 'ing-web/',
  tagPrefix: 'ing-',
  tagBareImport: '#',
  globalReplaceFunction: node => {
    if (node.type === 'link' || node.type === 'image') {
      const replacements = [
        /**
         * All internal links to '/systems/' (like '(../../fundamentals/systems/overlays/configuration.md)'),
         * will be changed into '/web-systems/' ('(../../fundamentals/web-systems/overlays/configuration.md)').
         */
        { from: '/systems/', to: '/web-systems/' },
        { from: '/tools/', to: '/web-tools/' },
        { from: '/principles/', to: '/web-principles/' },
        /**
         * Now, we will make sure that all links end with '/index.html' instead of '/'
         */
        { from: /^(?!http).*\/$/g, to: '/index.html' },
        /**
         * Some specific listings
         */ {
          from: '/guides/principles/subclasser-apis/',
          to: '/fundamentals/web-principles/subclasser-apis/',
        },
        {
          from: '/components/inputs/input/',
          to: '/components/input/',
        },

        // These are replacements of relative paths that need to be hardcoded atm.
        // Ideally, remark-extend should provide the path to the currently processed md file,
        // so absolute paths can be computed. Via a helper function for remark-extend we could then
        // allow  smth like '/docs/systems/*' -> '/docs/fundamentals/web-systems/*'
        {
          from: '../../../guides/principles/subclasser-apis/',
          to: '../../../fundamentals/web-principles/subclasser-apis/index.html',
        },
        {
          from: '../../../docs/systems/core/#deduping-of-mixins',
          to: '../../../../fundamentals/web-systems/core/index.html#deduping-of-mixins',
        },
        {
          from: '../../../docs/web-systems/form/model-value/index.html',
          to: '../../../fundamentals/web-systems/form/model-value/index.html',
        },
      ];

      // replaceHelper({ node, nodeTypes: ['link', 'image'], propToReplace: 'url', replacements });
      let res = node.url;
      replacements.forEach(({ from, to }) => {
        res = res.replace(from, to);
      });
      node.url = res;
    }
    return node;
  },
});
