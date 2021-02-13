# Content >> Accordion >> Features ||20

```js script
import { LitElement, html } from '@lion/core';

import '@lion/accordion/lion-accordion.js';
```

## Expanded

You can set `expanded` to pre-expand a certain invoker.

```js preview-story
export const expanded = () => html`
  <lion-accordion .expanded=${[1]}>
    <h3 slot="invoker">
      <button>Lorem</button>
    </h3>
    <p slot="content">Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
    <h3 slot="invoker">
      <button>Laboriosam</button>
    </h3>
    <p slot="content">
      Laboriosam sequi odit cumque, enim aut assumenda itaque quis voluptas est quos fugiat unde
      labore reiciendis saepe, iure, optio officiis obcaecati quibusdam.
    </p>
  </lion-accordion>
`;
```

## Slots Order

The invoker and content slots are ordered by DOM order.

This means you must locate your content before it's invoker.

```js preview-story
export const slotsOrder = () => html`
  <lion-accordion>
    <h3 slot="invoker">
      <button>Lorem</button>
    </h3>
    <p slot="content">Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
    <h3 slot="invoker">
      <button>Laboriosam</button>
    </h3>
    <p slot="content">
      Laboriosam sequi odit cumque, enim aut assumenda itaque quis voluptas est quos fugiat unde
      labore reiciendis saepe, iure, optio officiis obcaecati quibusdam.
    </p>
  </lion-accordion>
`;
```

## Distribute New Elements

Below, we demonstrate on how you could dynamically add new invoker + content.

```js preview-story
export const distributeNewElement = () => {
  const tagName = 'demo-accordion-add-dynamically';
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
            <lion-accordion id="appendAccordion">
              <h4 slot="invoker">
                <button>header 1</button>
              </h4>
              <p slot="content">content 1</p>
              <h4 slot="invoker">
                <button>header 2</button>
              </h4>
              <p slot="content">content 2</p>
            </lion-accordion>
            <button @click="${this.__handleAppendClick}">Append</button>
            <hr />
            <h3>Push</h3>
            <lion-accordion id="pushTabs">
              <h4 slot="invoker">
                <button>header 1</button>
              </h4>
              <p slot="content">content 1</p>
              <h4 slot="invoker">
                <button>header 2</button>
              </h4>
              <p slot="content">content 2</p>
              ${this.__collection.map(
                item => html`
                  <h4 slot="invoker"><button>${item.invoker}</button></h4>
                  <p slot="content">${item.content}</p>
                `,
              )}
            </lion-accordion>
            <button @click="${this.__handlePushClick}">Push</button>
          `;
        }
        constructor() {
          super();
          this.__collection = [];
        }
        __handleAppendClick() {
          const accordionElement = this.shadowRoot.querySelector('#appendAccordion');
          const c = 2;
          const n = Math.floor(accordionElement.children.length / 2);
          for (let i = n + 1; i < n + c; i += 1) {
            const invoker = document.createElement('h4');
            const button = document.createElement('button');
            button.innerText = `header ${i}`;
            invoker.setAttribute('slot', 'invoker');
            invoker.appendChild(button);
            const content = document.createElement('p');
            content.setAttribute('slot', 'content');
            content.innerText = `content ${i}`;
            accordionElement.append(invoker);
            accordionElement.append(content);
          }
        }
        __handlePushClick() {
          const accordionElement = this.shadowRoot.querySelector('#pushTabs');
          const i = Math.floor(accordionElement.children.length / 2) + 1;
          this.__collection = [
            ...this.__collection,
            {
              invoker: `header ${i}`,
              content: `content ${i}`,
            },
          ];
        }
      },
    );
  }
  return html` <demo-accordion-add-dynamically></demo-accordion-add-dynamically> `;
};
```

One way is by creating the DOM elements and appending them as needed.

Inside your `lion-accordion` extension, an example for appending nodes on a certain button click:

```js
__handleAppendClick() {
  const accordionAmount = this.children.length / 2;
  const invoker = document.createElement('h4');
  const button = document.createElement('button');
  button.innerText = `header ${accordionAmount + 1}`;
  invoker.setAttribute('slot', 'invoker');
  invoker.appendChild(button);
  const content = document.createElement('p');
  content.setAttribute('slot', 'content');
  content.innerText = `content ${accordionAmount + 1}`;
  this.append(invoker);
  this.append(content);
}
```

The other way is by adding data to a Lit property where you loop over this property in your template.
You then need to ensure this causes a re-render.

```js
__handlePushClick() {
  const accordionAmount = this.children.length;
  myCollection = [
    ...myCollection,
    {
      invoker: `header ${accordionAmount + 1}`,
      content: `content ${accordionAmount + 1}`,
    },
  ];
  renderMyCollection();
}
```

Make sure your template re-renders when myCollection is updated.

```html
<lion-accordion id="pushAccordion">
  ${myCollection.map(item => html`
  <h4 slot="invoker">
    <button>${item.invoker}</button>
  </h4>
  <p slot="content">${item.content}</p>
  `)}
</lion-accordion>
```
