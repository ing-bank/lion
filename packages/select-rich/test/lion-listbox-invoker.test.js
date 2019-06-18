import { expect, fixture, html, defineCE } from '@open-wc/testing';
import { LionButton } from '@lion/button';
import { LionListboxInvoker } from '../src/LionListboxInvoker.js';

import '../lion-listbox-invoker.js';

describe('lion-listbox-invoker', () => {
  it('should behave as a button', async () => {
    const el = await fixture(html`
      <lion-listbox-invoker></lion-listbox-invoker>
    `);
    expect(el instanceof LionButton).to.be.true;
  });

  it('renders invoker info based on selectedElement child nodes', async () => {
    const el = await fixture(html`
      <lion-listbox-invoker></lion-listbox-invoker>
    `);
    el.selectedElement = await fixture(`<div class="option"><h2>I am</h2><p>2 lines</p></div>`);
    await el.updateComplete;

    expect(el.contentWrapper).lightDom.to.equal(`
      <h2>I am</h2>
      <p>2 lines</p>
    `);
  });

  describe('Subclassers', () => {
    it('can create complex custom invoker renderers', async () => {
      const nodes = [];

      for (let i = 0; i < 2; i += 1) {
        const myNode = document.createElement('div');
        myNode.propX = `x${i}`;
        myNode.propY = `y${i}`;
        nodes.push(myNode);
      }

      // TODO: pseudo code: api for multiple selected might change
      const myTag = defineCE(
        class extends LionListboxInvoker {
          constructor() {
            super();
            this.selectedElements = nodes;
          }

          _contentTemplate() {
            // Display multi-select as chips
            return html`
              <div>
                ${this.selectedElements.forEach(
                  sEl => html`
                    <div class="c-chip">
                      ${sEl.propX}
                      <span class="c-chip__part">
                        ${sEl.propY}
                      </span>
                    </div>
                  `,
                )}
              </div>
            `;
          }
        },
      );

      const myEl = await fixture(`<${myTag}></${myTag}>`);
      // pseudo...
      expect(myEl).lightDom.to.contain('x1');
      expect(myEl).lightDom.to.contain('x2');
      expect(myEl).lightDom.to.contain('y1');
      expect(myEl).lightDom.to.contain('y2');
    });
  });
});
