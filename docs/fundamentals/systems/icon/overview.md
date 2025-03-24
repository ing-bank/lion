# Systems >> Icon >> Overview ||10

The icon system provides a way of defining icon sets which are lazily loaded on demand when
icons are rendered on the page. This way icon imports do not block the initial render of your
application, and you don't need to worry about carefully coordinating the dynamic imports of your icons.

## Icon format

For security reasons, icons are defined using lit-html templates to guarantee XSS safety:

```js
import { html } from 'lit';

export default html` <svg focusable="false" ...>...</svg> `;
```

The icon can also be a function. In this case, it's possible to reuse the icons if a
rendering mechanism different from lit-html is used to process a string.

```js
export default tag => tag`
  <svg focusable="false" ...>...</svg>
`;
```

This ensures the same version of lit-html and the icon system used. This is the recommended approach.

### Icon accessibility

On IE11 and some versions of Edge, SVG elements are focusable by default.
Setting `focusable="false"` on the SVG prevents this.

## Iconsets

Requesting many individual icons can be bad for performance. We should, therefore, group related icons
together in icon sets.

Iconsets are managed by the `IconManager`, where you can register icon resolvers to resolve an icon id
to the correct icon.

### Creating an icon resolver

An icon resolver is a function that receives the icon set and the icon name and subsequently
returns the icon to be rendered.

The most common use case is for this function to be async, and import the icon set on demand:

```js
function resolveLionIcon(iconset, name) {
  switch (iconset) {
    case 'bugs':
      return import('./icons/iconset-bugs.js').then(module => module[name]);
    case 'space':
      return import('./icons/iconset-space.js').then(module => module[name]);
    case 'misc':
      return import('./icons/iconset-misc.js').then(module => module[name]);
    default:
      throw new Error(`Unknown iconset ${iconset}`);
  }
}
```

An icon resolver can also be synchronous, returning the icon directly:

```js
const icons = {
  coolIcons: {
    'my-icon': html` <svg>... icon code ...</svg> `,
  },
};

function resolveLionIcon(iconset, name) {
  return coolIcons[iconSets][name];
}
```

### Registering an icon resolver

Icon resolvers are registered in the `IconManager` on a namespace. There can be only one resolver per namespace, so
make sure they are unique. A good idea is to use your package name as the namespace.

```js
import { icons } from '@lion/ui/icon.js';

function resolveLionIcon(iconset, name) {
  switch (iconset) {
    case 'bugs':
      return import('./icons/iconset-bugs.js').then(module => module[name]);
    case 'space':
      return import('./icons/iconset-space.js').then(module => module[name]);
    case 'misc':
      return import('./icons/iconset-misc.js').then(module => module[name]);
    default:
      throw new Error(`Unknown iconset ${iconset}`);
  }
}

icons.addIconResolver('lion', resolveLionIcon);
```

### Using icon resolvers

After register an icon resolver, icons can be resolved from the manager:

```js
import { icons } from '@lion/ui/icon.js';

const spaceshipIcon = await icons.resolveIcon('lion', 'space', 'alienSpaceship');
```

Icons can also be resolved from a single string, using the pattern: `namespace:iconset:name`:

```js
import { icons } from '@lion/ui/icon.js';

const spaceshipIcon = await icons.resolveIconForId('lion:space:alienSpaceship');
```

This syntax is used by the `lion-icon` component, where the id can be set on an attribute:

```html
<lion-icon icon-id="lion:space:alienSpaceship"></lion-icon>
<lion-icon icon-id="lion:misc:arrowLeft"></lion-icon>
```
