# Navigation >> Breadcrumb >> Examples ||30

```js script
import { css, html } from '@mdjs/mdjs-preview';
import { LionBreadcrumb } from '@lion/breadcrumb';
```

```js preview-story
export const customBreadcrumbSeparator = () => {
  if (!customElements.get('custom-breadcrumb')) {
    customElements.define(
      'custom-breadcrumb',
      class extends LionBreadcrumb {
        static get styles() {
          return [
            ...super.styles,
            css`
              :host {
                --lion-breadcrumb-separator: '→';
              }
              nav.breadcrumb {
                padding: 0.8em 1em;
                border: 1px solid hsl(0deg 0% 90%);
                border-radius: 4px;
                background: hsl(300deg 14% 97%);
              }
              nav.breadcrumb [aria-current='page'] {
                color: #000;
                font-weight: 700;
                text-decoration: none;
              }
            `,
          ];
        }
      },
    );
  }
  return html`
    <custom-breadcrumb>
      <a href="../../../">Home</a>
      <a href="../../">Category</a>
      <a href="../">Sub Category</a>
      <a href="./">Product</a>
    </custom-breadcrumb>
  `;
};
```
