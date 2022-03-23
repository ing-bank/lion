```js
import { sharedVar } from 'some-other-global-lib';
```

The var below conflicts when someone imports blocks from both js-advanced-1.md and js-advanced-2.md in
the same file.

## Consuming conflicting shared var

```js
export const y = sharedVar`My Example`;
```
