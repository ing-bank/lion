---
'@lion/ui': patch
---

BREAKING: remove setIcons, setOverlays, setLocalize.

Recommended approach is to do below at the top of your app (before lion code runs):

```js
import { singletonManager } from 'singleton-manager';
import { LocalizeManager } from '@lion/ui/localize-no-side-effects.js';

class MyLocalizeManager extends LocalizeManager {}

singletonManager.set('@lion/ui::localize::0.x', new MyLocalizeManager());
```
