```js
import { sharedVar } from 'some-global-lib';
// This path needs to be rewritten to that of the importing context
import '../some-local-file.js';
```

## Consuming shared var

```js
export const x = sharedVar`My Example`;
```
