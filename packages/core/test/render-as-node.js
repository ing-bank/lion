import { expect } from '@open-wc/testing';

import { html } from '../src/lit-html.js';
import { renderAsNode } from '../src/render-as-node.js';

describe.only('renderAsNode', () => {
  it('returns a node from a lit template', async () => {
    const result = renderAsNode(
      html`
        <div>test</div>
      `,
    );
    expect(result).to.be.instanceOf('Node');
  });

  it('renders offline from DOM', async () => {
    const result = renderAsNode(
      html`
        <div>test</div>
      `,
    );
    expect(result.isConnected).to.be.false;
  });
});
