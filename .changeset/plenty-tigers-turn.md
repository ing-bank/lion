---
'rocket-preset-extend-lion-docs': minor
---

BREAKING CHANGE: lion is moving to a single pkg with multiple entrypoints
Packages are now differently imported and therefore are also differently extended.

```js
import { LionButton } from '@lion/button';
// became
import { LionButton } from '@lion/ui/button.js';

// extending now convert it to something like this
import { IngButton } from 'ing-web/button.js';
```
