import { storiesOf, html } from '@open-wc/demoing-storybook';
import { LitElement, css } from '@lion/core';
import '../lion-tabs.js';

const tabsDemoStyle = css`
  .demo-tabs__tab[selected] {
    font-weight: bold;
  }
`;

storiesOf('Tabs', module)
  .add(
    'Default',
    () => html`
      <style>
        ${tabsDemoStyle}
      </style>
      <lion-tabs>
        <button slot="tab" class="demo-tabs__tab">Info</button>
        <div slot="panel">
          <h2>Info</h2>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laboriosam sequi odit cumque,
            enim aut assumenda itaque quis voluptas est quos fugiat unde labore reiciendis saepe,
            iure, optio officiis obcaecati quibusdam.
          </p>
        </div>
        <button slot="tab" class="demo-tabs__tab">About</button>
        <div slot="panel">
          <h2>About</h2>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laboriosam sequi odit cumque,
            enim aut assumenda itaque quis voluptas est quos fugiat unde labore reiciendis saepe,
            iure, optio officiis obcaecati quibusdam.
          </p>
        </div>
      </lion-tabs>
    `,
  )
  .add(
    'selectedIndex',
    () => html`
      <lion-tabs .selectedIndex=${1}>
        <button slot="tab">Info</button>
        <button slot="tab">About</button>
        <div slot="panel">
          <h2>Info</h2>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laboriosam sequi odit cumque,
            enim aut assumenda itaque quis voluptas est quos fugiat unde labore reiciendis saepe,
            iure, optio officiis obcaecati quibusdam.
          </p>
        </div>
        <div slot="panel">
          <h2>About</h2>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laboriosam sequi odit cumque,
            enim aut assumenda itaque quis voluptas est quos fugiat unde labore reiciendis saepe,
            iure, optio officiis obcaecati quibusdam.
          </p>
        </div>
      </lion-tabs>
    `,
  )
  .add(
    'Slots order',
    () => html`
      <lion-tabs>
        <button slot="tab">Info</button>
        <button slot="tab">About</button>
        <div slot="panel">
          <h2>Info</h2>
          <p>This is exactly the same just in the code it's differently ordered.</p>
        </div>
        <div slot="panel">
          <h2>About</h2>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laboriosam sequi odit cumque,
            enim aut assumenda itaque quis voluptas est quos fugiat unde labore reiciendis saepe,
            iure, optio officiis obcaecati quibusdam.
          </p>
        </div>
      </lion-tabs>
    `,
  )
  .add('Distribute new elements', () => {
    const tagName = 'lion-tabs-experimental';
    if (!customElements.get(tagName)) {
      customElements.define(
        tagName,
        class extends LitElement {
          static get properties() {
            return {
              __collection: { type: Array },
            };
          }

          render() {
            return html`
              <h3>Append</h3>
              <button @click="${this.__handleAppendClick}">
                Append
              </button>
              <lion-tabs id="appendTabs">
                <button slot="tab">tab 1</button>
                <p slot="panel">panel 1</p>
                <button slot="tab">tab 2</button>
                <p slot="panel">panel 2</p>
              </lion-tabs>
              <hr />
              <h3>Push</h3>
              <button @click="${this.__handlePushClick}">
                Push
              </button>
              <lion-tabs id="pushTabs">
                <button slot="tab">tab 1</button>
                <p slot="panel">panel 1</p>
                <button slot="tab">tab 2</button>
                <p slot="panel">panel 2</p>
                ${this.__collection.map(
                  item => html`
                    <button slot="tab">${item.button}</button>
                    <p slot="panel">${item.panel}</p>
                  `,
                )}
              </lion-tabs>
            `;
          }

          constructor() {
            super();
            this.__collection = [];
          }

          __handleAppendClick() {
            const tabsElement = this.shadowRoot.querySelector('#appendTabs');
            const c = 2;
            const n = Math.floor(tabsElement.children.length / 2);
            for (let i = n + 1; i < n + c; i += 1) {
              const tab = document.createElement('button');
              tab.setAttribute('slot', 'tab');
              tab.innerText = `tab ${i}`;
              const panel = document.createElement('p');
              panel.setAttribute('slot', 'panel');
              panel.innerText = `panel ${i}`;
              tabsElement.append(tab);
              tabsElement.append(panel);
            }
          }

          __handlePushClick() {
            const tabsElement = this.shadowRoot.querySelector('#pushTabs');
            const i = Math.floor(tabsElement.children.length / 2) + 1;
            this.__collection = [
              ...this.__collection,
              {
                button: `tab ${i}`,
                panel: `panel ${i}`,
              },
            ];
          }
        },
      );
    }
    return html`
      <lion-tabs-experimental></lion-tabs-experimental>
    `;
  });
