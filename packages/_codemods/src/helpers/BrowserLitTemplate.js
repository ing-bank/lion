/* eslint-disable max-classes-per-file */
const puppeteer = require('puppeteer');
const babelGenerate = require('@babel/generator').default;
const pathLib = require('path');
const express = require('express');
const fs = require('fs');
const babelParser = require('@babel/parser');

function createPageFromAstNode(taggedTemplateExpressionPath, filePath) {
  const htmlString = babelGenerate(taggedTemplateExpressionPath.node).code;

  taggedTemplateExpressionPath.get('quasi').traverse({
    Identifier(path) {
      // console.log(path.node);
      const binding = path.scope.getBinding(path.node.name);

      // TODO: node.type ???
      if (binding.path.node.type === 'ImportSpecifier') {
        const importDeclPath = binding.path.findParent(path => path.isImportDeclaration());
        const source = importDeclPath.node.source.value;
        const newSourceFilePath = source; // TODO: resolve via filePath

        // Now 'treeshake' all our dependendant code until we have a working example with all
        // our scope Identifiers resolved.

        const code = fs.readFileSync(newSourceFilePath, 'utf8');
        const ast = babelParser.parse(code, {
          sourceType: 'unambiguous',
          plugins: ['importMeta', 'dynamicImport'],
        });

        // Path should also be served via express otc...
      } else {
        // The definition must be in the current file and its code needs to be copied
        // Find the binding and recursively resolve and add all found Identifiers
      }
    },
  });

  console.log('identifierBindings[0]', identifierBindings[0].path.node);

  // TODO: add imports etc.
  return `
    <html>
      <head>
        <script type="module">
          import {html, render} from './static/lit-html/lit-html.js';

          window.data = {};
          const templateResult = ${htmlString};
          render(templateResult, document.getElementById('templateContainer'));
          window.data.templateResult = templateResult;

        </script>
      </head>
      <body>
        <div id="templateContainer"></div>
      </body>
    </html>`;
}

let server;
let currentPage;
let puppeteerInstance;

let serverReadyResolve;
const serverReadyCompleted = new Promise(resolve => {
  serverReadyResolve = resolve;
});

function createServer() {
  const hostname = '127.0.0.1';
  const port = 3000; // TODO: port-scanner
  const address = `http://${hostname}:${port}/`;

  const app = express();

  app.use('/static', express.static(pathLib.resolve(__dirname, '../../node_modules')));
  app.use('/static', express.static(pathLib.resolve(__dirname, '../../../../node_modules')));

  app.get('/', (req, res) => res.send(currentPage));

  app.listen(port, () => {
    console.log(`Puppeteer target server running on ${address}`);
    serverReadyResolve();
  });
  return { app, address };
}

async function launchPuppeteer() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // await page.goto(address);
  // other actions...
  //  await puppeteerInstance.close();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('error', msg => console.log('PAGE LOG:', msg.text()));

  return { browser, page };
}

/**
 * @desc How does it work? A LitTemplate couples a TaggedTemplateExpression from an AST
 * (using lit-html) to a running instance of the template (via Puppeteer).
 * The goal of this is to get extra meta info about the elements within the template,
 * that would have been impossible to retrieve with html parsing directly inside NodeJS.
 *
 * Example:
 * `
 * <div>
 *  <lion-input .errorValidators="${[new Validator()]}" .infoValidators="${[new ValidatorInfo(null, {type: 'info'})]}">
 *  <lion-input .errorValidators="${[new Validator()]}" .warningValidators="${[new ValidatorWarning(null, {type: 'warning'})]}">
 * </div>
 * `
 * And we want to translate to:
 * `
 * <div>
 *  <lion-input .validators="${[new Validator(), new ValidatorInfo(null, { type: 'info' })]}">
 *  <lion-input .validators="${[new Validator(), new ValidatorWarning(null, { type: 'warning' })]}">
 * </div>
 * `
 * Here, in order to combine multiple properties into one (per input), we need to know about the
 * context of the properties.
 *
 */
class BrowserLitTemplate {
  constructor(path) {
    this.path = path;
  }

  async init() {
    currentPage = createPageFromAstNode(this.path);

    if (!server) {
      server = createServer();
      await serverReadyCompleted;
    }
    if (!puppeteerInstance) {
      puppeteerInstance = await launchPuppeteer(server.address);
    }
    console.log('hier');
    // Not sure if same address results in page refresh, but it should...
    await puppeteerInstance.page.goto(server.address);
    console.log('hier B');

    // eslint-disable-next-line arrow-body-style
    this._meta = await puppeteerInstance.page.evaluate((...args) => {
      console.log('args', args);

      // return document.body;
      return {
        node: document.querySelector('#templateContainer'),
        test: window.data.test,
        templateResult: window.data.templateResult,
      };
    });

    console.log('hier C');
    console.log('meta', this._meta);

    // puppeteerInstance.page.goto();
  }

  get node() {
    return this._meta.node;
  }

  get templateResult() {
    return this._meta.templateResult;
  }

  // async evaluate() {
  //   // proxy for puppeteer evaluate
  // }
}

module.exports = { BrowserLitTemplate };
