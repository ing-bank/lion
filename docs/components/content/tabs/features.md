# Content >> Tabs >> Features ||20

```js script
import { LitElement, html } from '@lion/core';

import '@lion/tabs/define';
```

## Selected Index

You can set the `selectedIndex` to select a certain tab.

```js preview-story
export const selectedIndex = () => html`
  <lion-tabs .selectedIndex=${1}>
    <button slot="tab">Info</button>
    <p slot="panel">Info page with lots of information about us.</p>
    <button slot="tab">Work</button>
    <p slot="panel">Work page that showcases our work.</p>
  </lion-tabs>
`;
```

## Slots Order

The tab and panel slots are ordered by DOM order.

This means you can switch the grouping in your `lion-tabs` from tab + panel to all tabs first or all panels first.

```js preview-story
export const slotsOrder = () => html`
  <lion-tabs>
    <button slot="tab">Info</button>
    <button slot="tab">Work</button>
    <p slot="panel">Info page with lots of information about us.</p>
    <p slot="panel">Work page that showcases our work.</p>
  </lion-tabs>
`;
```

## Nesting tabs

You can include tabs within tabs

```js preview-story
export const nestedTabs = () => html`
  <lion-tabs>
    <button slot="tab">Movies</button>
    <button slot="tab">Work</button>
    <div slot="panel">
      <p>Find some more info about our favorite movies:</p>
      <lion-tabs>
        <button slot="tab">Info about Cars</button>
        <button slot="tab">Info about Toy Story</button>
        <p slot="panel">
          Cars is a 2006 American computer-animated comedy film produced by Pixar Animation Studios
          and released by Walt Disney Pictures.
        </p>
        <p slot="panel">
          The feature film directorial debut of John Lasseter, it was the first entirely
          computer-animated feature film, as well as the first feature film from Pixar.
        </p>
      </lion-tabs>
    </div>
    <p slot="panel">Work page that showcases our work.</p>
  </lion-tabs>
`;
```

## Distribute New Elements

Below, we demonstrate on how you could dynamically add new tab + panels.

```js preview-story
export const distributeNewElement = () => {
  const tagName = 'demo-tabs-add-dynamically';
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
            <lion-tabs id="appendTabs">
              <button slot="tab">tab 1</button>
              <p slot="panel">panel 1</p>
              <button slot="tab">tab 2</button>
              <p slot="panel">panel 2</p>
            </lion-tabs>
            <button @click="${this.__handleAppendClick}">Append</button>
            <hr />
            <h3>Push</h3>
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
            <button @click="${this.__handlePushClick}">Push</button>
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
  return html` <demo-tabs-add-dynamically></demo-tabs-add-dynamically> `;
};
```

One way is by creating the DOM elements and appending them as needed.

Inside your `lion-tabs` extension, an example for appending nodes on a certain button click:

```js
__handleAppendClick() {
  const tabsAmount = this.children.length / 2;
  const tab = document.createElement('button');
  tab.setAttribute('slot', 'tab');
  tab.innerText = `tab ${tabsAmount + 1}`;
  const panel = document.createElement('p');
  panel.setAttribute('slot', 'panel');
  panel.innerText = `panel ${tabsAmount + 1}`;
  this.append(tab);
  this.append(panel);
}
```

The other way is by adding data to a Lit property where you loop over this property in your template.
You then need to ensure this causes a re-render.

```js
__handlePushClick() {
  const tabsAmount = this.children.length;
  myCollection = [
    ...myCollection,
    {
      button: `tab ${tabsAmount + 1}`,
      panel: `panel ${tabsAmount + 1}`,
    },
  ];
  renderMyCollection();
}
```

Make sure your template re-renders when myCollection is updated.

```html
<lion-tabs id="pushTabs">
  ${myCollection.map(item => html`
  <button slot="tab">${item.button}</button>
  <p slot="panel">${item.panel}</p>
  `)}
</lion-tabs>
```
