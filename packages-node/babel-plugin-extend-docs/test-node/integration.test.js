const { expect } = require('chai');
const path = require('path');
const { executeBabel } = require('./helpers.js');

const extendDocsConfig = {
  changes: [
    {
      name: 'MyCounter',
      variable: {
        from: 'MyCounter',
        to: 'MyExtension',
        paths: [
          { from: './index.js', to: './my-extension/index.js' },
          { from: './src/MyCounter.js', to: './my-extension/index.js' },
        ],
      },
      tag: {
        from: 'my-counter',
        to: 'my-extension',
        paths: [{ from: './my-counter.js', to: './my-extension/my-extension.js' }],
      },
    },
  ],
  rootPath: path.resolve('./demo'),
  __filePath: '/my-app.demo.js',
};

describe('babel-plugin-extend-docs: integration tests', () => {
  it('works for the demo', () => {
    const code = `import { LitElement, html } from 'lit-element';
import { MyCounter } from './src/MyCounter.js';
import './my-counter.js';

class TenCounter extends MyCounter {
  inc() {
    this.count += 10;
  }
}
customElements.define('ten-counter', TenCounter);

class MyApp extends LitElement {
  render() {
    return html\`
      <h1>Example App</h1>
      <hr />
      <my-counter></my-counter>
      <hr />
      <ten-counter></ten-counter>
    \`;
  }
}

customElements.define('my-app', MyApp);
`;
    const output = `import { LitElement, html } from "lit-element";
import { MyExtension } from "./my-extension/index.js";
import "./my-extension/my-extension.js";

class TenCounter extends MyExtension {
  inc() {
    this.count += 10;
  }

}

customElements.define('ten-counter', TenCounter);

class MyApp extends LitElement {
  render() {
    return html\`
      <h1>Example App</h1>
      <hr />
      <my-extension></my-extension>
      <hr />
      <ten-counter></ten-counter>
    \`;
  }

}

customElements.define('my-app', MyApp);`;
    expect(executeBabel(code, extendDocsConfig)).to.equal(output);
  });
});
