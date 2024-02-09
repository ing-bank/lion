---
'@lion/ui': patch
---

feat: split validate-messages-no-side-effects methods, so they can be bundled along with entrypoints.

For optimized bundling, it's reccommended to load feedback messages per entrypoint. For instance, when you only use form-core in your app:

```js
import { LionInputTel } from '@lion/ui/input-tel.js';
import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';
import { loadInputTelMessagesNoSideEffects } from '@lion/ui/validate-messages-no-side-effects.js';

export class MyInputTel extends LionInputTel {
  constructor() {
    super();
    loadInputTelMessagesNoSideEffects({ localize: getLocalizeManager() });
  }
}
```

This prevents you from loading unused entrypoints like input-tel (which loads a full phone validation library) etc.
