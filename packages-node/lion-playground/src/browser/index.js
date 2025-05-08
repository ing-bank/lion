/**
 * @typedef {import('custom-elements-manifest/schema').Package} CustomElementsManifestSchema;
 */

/**
 * For security, we make sure the iframe can never call its parent
 * This needs to be performant and simple (no in-browser ast parsing), but solid.
 * All calls to `parent` or `window.parent` for instance, will become `$parent` and `window.$parent`
 * @param {string} fileString
 * @returns {string}
 */
export function sanitizeIframeFromSameDomain(fileString) {
  // All parent calls get prefixed with a $ to prevent them from being called
  const resultWithoutParentCalls = fileString.replace(
    /(document\.defaultView\.|window\.|\n|\r|\s)(parent|top)/g,
    '$1$$2',
  );
  // We also avoid the use of eval, by removing it (breaking the code)
  // N.B. this regex is a bit aggressive, as it would also remove potentially custom defined eval functions
  // like myeval() or myObject.eval(). But, better safe than sorry and we can always finetune might people actually need it
  const resultWithoutEvalAndWithoutParentCalls = resultWithoutParentCalls.replace(
    /(eval\(.*?\))/g,
    '',
  );

  return resultWithoutEvalAndWithoutParentCalls;
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
 * As a best practice, it uses ScopedElementsMixin.
 * However, we can also provide demos that load the element definitions, not using ScopedElementsMixin.
 * Also, it should be possible to load elements inside frameworks like React, Vue, Angular, etc.
 * @param {string} demo a string with html
 * @param {{
 *  webComponents: {
 *    source: string;
 *    klass: string;
 *    tag: string;
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
    return html\`
      ${demo.trim()}
    \`;
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
    const [, , classes, , , source] = imp.match(re) || [];
    const [, tag, klass] = imp.match(/(.*)\s+as\s+(.*)/) || imp.match(/(.*)\s+from\s+(.*)/);
    imports.push({ tag, klass, source });
  }
  return imports;
}

/**
 *
 * @param {string} mdjsStoriesFile
 * @returns {{script: string; stories: string[]; storiesSetup: string}}
 */
export function getMdJsStoriesFileSections(mdjsStoriesFile) {
  const [, , script, , storiesString, , storiesSetup] = mdjsStoriesFile.split(
    /\/\*\* (script|stories|stories setup) code \*\*\//g,
  );
  const stories = storiesString
    .split(/^export |\nexport /)
    .filter(Boolean)
    .map(storyTail => `export ${storyTail}`);
  return { script, stories, storiesSetup };
}

/**
 * @param {string} localPathWithDotSlashOrSlash
 * @returns {string}
 */
function normalizeLocalPath(localPathWithDotSlashOrSlash) {
  return localPathWithDotSlashOrSlash.replace(/^\.?\//, '');
}

/**
 * Configures ide to run a demo app
 * @param {HTMLElement} ide
 * @param {{demoFileName: string; indexHtmlFile: string; jsFile: string; importMapPerPackage: {[pkgName:string]: {[exposedRelative:string]: string}} }} opts
 */
export function setupIde(ide, { demoFileName, indexHtmlFile, jsFile, importMapPerPackage }) {
  // N.B. We need below string concatenation to prevent path rewrites from Rocket
  const basePath = `${window.location.origin}/__wds-outside-root__/1`;

  // rewrite import map, so that all keys (pakcage names) are joined with their internal paths
  // e.g. '@lion/ui/button.js': 'packages/ui/exports/button.js'
  const importMapEntriesWithInternalPaths = {};
  for (const [packageName, entries] of Object.entries(importMapPerPackage)) {
    for (const [entry, internalPath] of Object.entries(entries)) {
      importMapEntriesWithInternalPaths[
        `${packageName}/${entry.replace(/^\.\/?/, '')}`.replace(/\/$/, '')
      ] = `${basePath}/${internalPath}`;
    }
  }

  // console.debug(importMapEntriesWithInternalPaths);

  ide.sandboxBaseUrl = `${basePath}/node_modules/playground-elements`;
  ide.config = {
    importMap: {
      // imports: {
      //   '@webcomponents/scoped-custom-element-registry': `${basePath}/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js`,
      //   '@open-wc/scoped-elements/lit-element.js': `${basePath}/node_modules/@open-wc/scoped-elements/lit-element.js`,
      //   '@lion/ui/button.js': `${basePath}/packages/ui/exports/button.js`,
      //   lit: `${basePath}/node_modules/lit/index.js`,
      //   '@lion/ui/accordion.js': `${basePath}/packages/ui/exports/accordion.js`,
      // },
      imports: importMapEntriesWithInternalPaths,
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

/**
 * @param {string} htmlToRenderInJsContext
 * @returns {string[]} like ['lion-accordion', 'lion-button']
 */
function getCustomElementTagNamesFromHtml(htmlToRenderInJsContext) {
  /** @type {string[]} */
  const tagNames = [];
  const re = /<([a-zA-Z0-9-]+)(\s|>)/g;
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = re.exec(htmlToRenderInJsContext)) !== null) {
    const tagName = match[1];
    if (tagName.includes('-') && !tagNames.includes(tagName)) {
      tagNames.push(tagName);
    }
  }
  return tagNames;
}

/**
 * @param {string} htmlToRenderInJsContext like `<lion-accordion .prop="${someJs}">some content</lion-accordion>`
 * @param {{ceManifestObject: { packageName: string; packagePath: string; customElementsJson: CustomElementsManifestSchema}; importMapPerPackage: {[pkgName:string]: {[exposedRelative:string]: string}}  }} opts
 * @returns {{tag: string; klass: string; source: string}[]} like [{ tag:'lion-accordion', klass: 'LionAccordion', source: '@lion/ui/accordion.js' }];
 */
export function extractWebComponentObject(
  htmlToRenderInJsContext,
  { ceManifestObject, importMapPerPackage },
) {
  // First, we extract tag names from the htmlToRenderInJsContext
  const tagNames = getCustomElementTagNamesFromHtml(htmlToRenderInJsContext);
  if (tagNames.length === 0) {
    throw new Error('No tag names found in the provided HTML string');
  }

  // Second, we look for the tag names in the ceManifestObject
  const { customElementsJson } = ceManifestObject;
  const webComponents = [];
  for (const tagName of tagNames) {
    const moduleContainingTagDefinition = customElementsJson.modules.find(module =>
      module.exports?.find(m => m.kind === 'custom-element-definition' && m.name === tagName),
    );
    if (!moduleContainingTagDefinition) {
      // eslint-disable-next-line no-console
      console.warn(`No module found for tag name ${tagName}`);
      continue; // eslint-disable-line no-continue
    }
    const { declaration } =
      moduleContainingTagDefinition.exports?.find(
        (/** @type {{ kind: string; name: string; }} */ m) =>
          m.kind === 'custom-element-definition' && m.name === tagName,
      ) || {};
    if (!declaration || !declaration.module) {
      throw new Error(`No declaration found for tag name ${tagName}`);
    }
    const importMapForOurPackage = importMapPerPackage[ceManifestObject.packageName] || {};
    let source = '';
    for (const [exposedRelative, internalPathFromMonoRoot] of Object.entries(
      importMapForOurPackage,
    )) {
      if (internalPathFromMonoRoot.endsWith(declaration.module)) {
        source = `${ceManifestObject.packageName}/${normalizeLocalPath(exposedRelative)}`;
        break;
      }
    }
    webComponents.push({ tag: tagName, klass: declaration.name, source });
  }

  return webComponents;
}
