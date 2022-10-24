import { expect, fixture, defineCE } from '@open-wc/testing';
import { LitElement, html } from 'lit';

import { getFocusableElements } from '@lion/components/overlays.js';

class ElementB extends LitElement {
  render() {
    const marker = this.getAttribute('marker') || '';
    return html`
      <a id="el-b-${marker}-1" href="#">foo</a>

      <div>
        <div id="el-b-${marker}-2" tabindex="0">
          <input id="el-b-${marker}-3" />
        </div>
      </div>
    `;
  }
}

customElements.define('element-b', ElementB);

describe('getFocusableElements()', () => {
  it('collects focusable nodes', async () => {
    const element = await fixture(`
      <div>
        <button id='el1'></button>
        <a id='el2' href='#'></a>
        <div id='el3' tabindex='0'></div>
        <input id='el4'>
        <div id='el5' contenteditable></div>
        <textarea id='el6'></textarea>
        <select id='el7'>
          <option>1</option>
        </select>
      </div>
    `);
    const nodes = getFocusableElements(element);
    const ids = nodes.map(n => n.id);

    expect(ids).eql(['el1', 'el2', 'el3', 'el4', 'el5', 'el6', 'el7']);
  });

  it('handles nested nodes', async () => {
    const element = await fixture(`
      <div>
        <a id='el1' href='#'></a>

        <div>
          <button id='el2'></button>

          <div id='el3' tabindex='0'>
            <input id='el4'>
          </div>
        </div>

        <div style='display: contents;'>
          <button id='el5'></button>
        </div>
      </div>
    `);
    const nodes = getFocusableElements(element);
    const ids = nodes.map(n => n.id);

    expect(ids).eql(['el1', 'el2', 'el3', 'el4', 'el5']);
  });

  it('skips elements that should not receive focus', async () => {
    const element = await fixture(`
      <div>
        <input id='el1'>
        <input id='el2' disabled>

        <a id='el3' href='#'>foo</a>
        <a id='el4'>foo</a>

        <span id='el5'>foo</span>
        <h1 id='el6'>foo</h1>

        <div id='el7'>

          <a id='el8' href='foo'>foo</a>
          <a id='el9'>
            <button id='el10' disabled>foo</button>
            <button id='el11'>foo</button>
          </a>

        </div>
      </div>
    `);
    const nodes = getFocusableElements(element);
    const ids = nodes.map(n => n.id);

    expect(ids).eql(['el1', 'el3', 'el8', 'el11']);
  });

  it('respects tabindex order', async () => {
    const element = await fixture(`
      <div>
        <div id='el1' tabindex='0'></div>
        <div id='el2' tabindex='0'></div>
        <div id='el3' tabindex='0'></div>
        <div id='el4' tabindex='-1'></div>
        <div id='el5' tabindex='3'></div>
        <div id='el6' tabindex='4'></div>
        <div id='el7' tabindex='5'></div>
        <div>
          <div id='el8' tabindex='1'></div>
          <div id='el9' tabindex='6'></div>
        </div>
        <div id='el10' tabindex='2'></div>
      </div>
    `);
    const nodes = getFocusableElements(element);
    const ids = nodes.map(n => n.id);

    expect(ids).eql(['el8', 'el10', 'el5', 'el6', 'el7', 'el9', 'el1', 'el2', 'el3']);
  });

  it('handles shadow dom', async () => {
    const element = await fixture(`
      <div>
        <element-b marker='marker'></element-b>
      </div>
    `);

    const nodes = getFocusableElements(element);
    const ids = nodes.map(n => n.id);

    expect(ids).eql(['el-b-marker-1', 'el-b-marker-2', 'el-b-marker-3']);
  });

  it('handles slotted elements', async () => {
    const elTag = defineCE(
      class extends LitElement {
        render() {
          return html`
            <button id="el-a-1"></button>

            <element-b marker="marker-1"></element-b>

            <slot name="slot-a"></slot>

            <a id="el-a-2" href="#">foo</a>

            <slot></slot>

            <slot name="slot-b"></slot>

            <element-b id="el-a-3" marker="marker-2" tabindex="0"></element-b>
          `;
        }
      },
    );

    const element = await fixture(`
      <div>
        <${elTag}>

          <button id='el-1' slot='slot-b'></button>
          <div>
            <a id='el-2' href='#'></a>
          </div>

          <div id='el-3' tabindex='0' slot='slot-a'>
            <input id='el-4'>
          </div>

          <div id='el-5' slot='slot-b' contenteditable></div>
          <textarea id='el-6' slot='slot-a'></textarea>

        </${elTag}>
      </div>
    `);
    const nodes = getFocusableElements(element);
    const ids = nodes.map(n => n.id);

    expect(ids).eql([
      'el-a-1',
      'el-b-marker-1-1',
      'el-b-marker-1-2',
      'el-b-marker-1-3',
      'el-3',
      'el-4',
      'el-6',
      'el-a-2',
      'el-2',
      'el-1',
      'el-5',
      'el-a-3',
      'el-b-marker-2-1',
      'el-b-marker-2-2',
      'el-b-marker-2-3',
    ]);
  });
});
