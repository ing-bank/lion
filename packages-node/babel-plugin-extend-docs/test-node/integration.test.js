const { expect } = require('chai');
const { executeBabel } = require('./helpers.js');

const extendDocsConfig = {
  changes: [
    {
      name: 'MyCounter',
      variable: {
        from: 'MyCounter',
        to: 'MyExtension',
        paths: [{ from: 'source/counter', to: 'extension/counter' }],
      },
      tag: {
        from: 'my-counter',
        to: 'my-extension',
        paths: [{ from: 'source/counter/define', to: '#counter/define' }],
      },
    },
  ],
};

describe('babel-plugin-extend-docs: integration tests', () => {
  it('works for the demo', () => {
    const code = `import { LitElement, html } from '@lion/core';
import { MyCounter } from 'source/counter';
import 'source/counter/define';

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
    const output = `import { LitElement, html } from "@lion/core";
import { MyExtension } from "extension/counter";
import "#counter/define";

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
