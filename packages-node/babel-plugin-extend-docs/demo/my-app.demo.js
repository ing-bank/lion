/* eslint-disable import/extensions */
import { LitElement, html } from '@lion/core';

import { SourceCounter } from '#source/counter';
import '#source/counter/define';

class TenCounter extends SourceCounter {
  inc() {
    this.count += 10;
  }
}
customElements.define('ten-counter', TenCounter);

class MyApp extends LitElement {
  render() {
    return html`
      <h1>Example App</h1>
      <hr />
      <source-counter></source-counter>
      <hr />
      <ten-counter></ten-counter>
    `;
  }
}

customElements.define('my-app', MyApp);
