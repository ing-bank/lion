import { expect } from '@open-wc/testing';
import { html } from '../index.js';
import { renderLitAsNode } from '../src/renderLitAsNode.js';

describe('renderLitAsNode', () => {
  it('should return a matching HTMLElement (Node)', () => {
    const el = renderLitAsNode(html`
      <div>
        <a href="#" target="_blank">Link</a>
        Some text: <span>Hello, World</span>
      </div>
    `);

    expect(el).to.be.instanceOf(HTMLElement);
    expect(el).dom.to.equal(`
      <div>
        <a href="#" target="_blank">Link</a>
        Some text: <span>Hello, World</span>
      </div>
    `);
  });

  it('should only render and return the first (root) node in the template', () => {
    const el = renderLitAsNode(html`
      <div>
        <a href="#" target="_blank">Link</a>
        Some text: <span>Hello, World</span>
      </div>
      <div>Sibling div</div>
    `);

    expect(el).dom.to.equal(`
      <div>
        <a href="#" target="_blank">Link</a>
        Some text: <span>Hello, World</span>
      </div>
    `);
  });
});
