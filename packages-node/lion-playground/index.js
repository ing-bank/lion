/**
 * For security, we make sure the iframe can never call its parent
 * This needs to be cheap and simple (no in-browser ast parsing), but solid =>
 * `content.replace(/(document\.defaultView\.|window\.|\n|\r|\s)(parent|top)/g, '$1$$2');`.
 * All calls to `parent` or `window.parent` for instance, will become `$parent` and `window.$parent`
 * @param {string} fileString
 * @returns {string}
 */
export function sanitizeIframeFromSameDomain(fileString) {
  return fileString.replace(/(document\.defaultView\.|window\.|\n|\r|\s)(parent|top)/g, '$1$$2');
}

// function sanitizeIframeFromSameDomain(fileString) {
//   // For security, we make sure the iframe can never call its parent
//   // This needs to be cheap and simple (no in-browser ast parsing), but solid =>
//   // `content.replace(/(document\.defaultView\.|window\.|\n|\r|\s)(parent|top)/g, '$1$$2');`.
//   // All calls to `parent` or `window.parent` for instance, will become `$parent` and `window.$parent`

//   return fileString.replace(/(document\.defaultView\.|window\.|\n|\r|\s)(parent|top)/g, '$1$$2');
// }

// TODO: run through Prettier
/**
 * By default, we run in a LitElement context that can be copy-pasted.
 * As a best practice, it uses ScopedElementsMixin
 * @param {string} demo a string with html
 * @param {{
 *  webComponents: {
 *    tag: string;
 *    klass:string;
 *    source: string;
 *  }[];
 * }} opts
 */
export function createScopedLitElementDemo(demo, { webComponents = [] }) {
  const demoTag = 'my-app';
  const scopedMap = [];
  for (const { tag, klass } of webComponents) {
    scopedMap.push(`'${tag}': ${klass}`);
  }

  const jsFile = `/* playground-fold */
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { html, LitElement } from 'lit';

${webComponents.map(({ source, klass }) => `import { ${klass} } from '${source}';`).join('\n')}

export class MyApp extends ScopedElementsMixin(LitElement) {
  static scopedElements = { ${scopedMap.join(', ')} };

  render() {
    /* playground-fold-end */
    return html\`${demo.trim()}\`;
    /* playground-fold */
  }
}
customElements.define('${demoTag}', MyApp);
/* playground-fold-end */
`;

  const indexHtmlFile = `<${demoTag}></${demoTag}>`;
  return { jsFile, indexHtmlFile };
}

/**
 *
 * @param {string} fileString
 */
export function extractImports(fileString) {
  const re = /import(\s+\{(.*)\})?\s+from\s+(("|').*("|'));?\n/;

  // Get imports... we either find a ce definition or a constructors
  const importString = fileString.match(new RegExp(re, 'gm'));
  if (!importString) {
    return [];
  }

  const imports = [];
  for (const imp of importString) {
    const [, , classes, , , source] = imp.match(re);
    const [, tag, klass] = imp.match(/(.*)\s+as\s+(.*)/) || imp.match(/(.*)\s+from\s+(.*)/);
    imports.push({ tag, klass, source });
  }
  return imports;
}

/**
 *
 * @param {string} fileString
 */
export function extractWebComponentObject(fileString) {
  const imports = extractImports(fileString);

  console.log({ imports });

  // based on tag names, we check what components we have
  // and need to look for in CE manifest

  // Then, we

  // check if we have element definitions

  const webComponents = [];
}

/**
 *
 * @param {string} mdjsStoriesFile
 * @returns {{script: string; stories: string; storiesSetup: string}}
 */
export function getMdJsStoriesFileSections(mdjsStoriesFile) {
  const [, , script, , stories, , storiesSetup] = mdjsStoriesFile.split(
    /\/\*\* (script|stories|stories setup) code \*\*\//g,
  );
  return { script, stories, storiesSetup };
}

/**
 * Configures ide to run a demo app
 * @param {HTMLElement} ide
 * @param {{demoFileName: string; indexHtmlFile: string; jsFile: string; }} opts
 */
export function setupIde(ide, { demoFileName, indexHtmlFile, jsFile }) {
  const importMap = createImportMap([]);

  // N.B. We need below string concatenation to prevent path rewrites from Rocket

  const basePath = `${window.location.origin}/__wds-outside-root__/1`;
  ide.sandboxBaseUrl = `${basePath}/node_modules/playground-elements`;
  ide.config = {
    importMap: {
      imports: {
        '@webcomponents/scoped-custom-element-registry': `${basePath}/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js`,
        '@open-wc/scoped-elements/lit-element.js': `${basePath}/node_modules/@open-wc/scoped-elements/lit-element.js`,
        '@lion/ui/button.js': `${basePath}/packages/ui/exports/button.js`,
        lit: `${basePath}/node_modules/lit/index.js`,
        '@lion/ui/accordion.js': `${basePath}/packages/ui/exports/accordion.js`,
      },
    },
    files: {
      'index.html': {
        contentType: 'sample/html',
        content:
          `<!-- playground-hide -->
<!doctype html>
<head>
<!-- playground-hide-end -->
<script type="module">
  import '${basePath}/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
  import ` +
          `'./${demoFileName}';
<` +
          `/script>
<!-- playground-hide -->
</head>
<body>  
<!-- playground-hide-end -->
${indexHtmlFile}
<!-- playground-hide -->
</body>
<!-- playground-hide-end -->`,
      },
      [demoFileName]: {
        filename: demoFileName,
        contentType: 'sample/js',
        content: [sanitizeIframeFromSameDomain(jsFile).trim()].join('\n'),
        selected: true,
      },
    },
  };
}
