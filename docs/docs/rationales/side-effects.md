# Rationales >> Side Effects ||10

All our packages are side effect free due to the fact that es modules are always side effect free even when changing other es modules. Only code which accesses browser globals like `window`, `console` in the root of the module will be treated a side effect and always included.
Everything else can be tree shaken by [rollup](https://rollupjs.org).

## Example

In this example we will define a function to override an es module export.

👉 `main.js`

```js
import { somethingElse, overlays } from './overlays.js';

console.log(somethingElse);
```

👉 `overlays.js`

```js
class OverlayManager {}

export let overlays = new OverlayManager();

export function setOverlays(newOverlays) {
  overlays = newOverlays;
}

export const somethingElse = 'something else';
```

### Example Result

However having this function alone does not mean a side effect as rollup can tree shake it.

See the code in [rollup repl][1].

```js
const somethingElse = 'something else';

console.log(somethingElse);
```

## Example Override

Let's add an es module which uses that override.

👉 `main.js`

```js
import { somethingElse, overlays } from './overlays.js';
import './override.js';

console.log(somethingElse);

// this will trigger loading of full overlays.js & override.js code
// console.log(overlays.list);
```

👉 `override.js`

```js
import { setOverlays } from './overlays.js';

setOverlays(new Object());
```

## Example Override Result

It will still be fully tree shaken.

See the code in [rollup repl][2].

```js
const somethingElse = 'something else';

console.log(somethingElse);

// this will trigger loading of full overlays.js & override.js code
// console.log(overlays.list);
```

## Example Override Result Accessing

ONLY if you actually access `overlays` it will include `overlays.js` & `override.js`.

```js
class OverlayManager {}

let overlays = new OverlayManager();

function setOverlays(newOverlays) {
  overlays = newOverlays;
}

const somethingElse = 'something else';

setOverlays(new Object());

console.log(somethingElse);

// this will trigger loading of full overlays.js & override.js code
console.log(overlays.list);
```

---

## Comprehensive Example

This time we have a separate controller which also accesses the `overlays`.

👉 `main.js`

```js
import { somethingElse, setOverlays, overlays } from './overlays.js';
import { OverlayController, somethingElse2 } from './OverlayController.js';

// the following code will tree shake overlays away hence overlays is side effect free

setOverlays(new Object());
console.log(somethingElse);
console.log(somethingElse2);

//** The following will toggle importing of overlays */

// 1. import overlays directly and access it
// console.log(overlays.list);

// 2. create an OverlayController which internally accesses overlays
// const ctrl = new OverlayController();
// console.log(ctrl.manager.list);
```

👉 `overlays.js`

```js
class OverlayManager {
  constructor() {
    this.list = [];
  }
  add(a) {
    this.list.push(a);
  }
}

export let overlays = new OverlayManager();

export function setOverlays(newOverlays) {
  overlays = newOverlays;
}

export const somethingElse = 'something else';

// the following line is a side effect as it always will be included
console.log('overlays side effect');
```

👉 `OverlayController.js`

```js
import { overlays } from './overlays.js';

export class OverlayController {
  constructor(config = {}, manager = overlays) {
    this.manager = manager;
    this.manager.add(this);
  }
}

export const somethingElse2 = 'something else';
```

### Comprehensive Example Result

Even with all these intertwined code rollup can tree shake it fully away.
Again if you access the `overlays` or you start instantiating an `OverlaysController` it will include all the needed code.

Be sure to see it for yourself in the [rollup repl][3].

```js
const somethingElse = 'something else';

// the following line is a side effect as it always will be included
console.log('overlays side effect');

const somethingElse2 = 'something else';

console.log(somethingElse);
console.log(somethingElse2);

//** The following will toggle importing of overlays */

// 1. import overlays directly and access it
// console.log(overlays.list);

// 2. create an OverlayController which internally accesses overlays
// const ctrl = new OverlayController();
// console.log(ctrl.manager.list);
```

[1]: https://rollupjs.org/repl/?version=2.10.2&shareable=JTdCJTIybW9kdWxlcyUyMiUzQSU1QiU3QiUyMm5hbWUlMjIlM0ElMjJtYWluLmpzJTIyJTJDJTIyY29kZSUyMiUzQSUyMmltcG9ydCUyMCU3QiUyMHNvbWV0aGluZ0Vsc2UlMkMlMjBvdmVybGF5cyUyMCU3RCUyMGZyb20lMjAnLiUyRm92ZXJsYXlzLmpzJyUzQiU1Q24lNUNuY29uc29sZS5sb2coc29tZXRoaW5nRWxzZSklM0IlMjIlMkMlMjJpc0VudHJ5JTIyJTNBdHJ1ZSU3RCUyQyU3QiUyMm5hbWUlMjIlM0ElMjJvdmVybGF5cy5qcyUyMiUyQyUyMmNvZGUlMjIlM0ElMjJjbGFzcyUyME92ZXJsYXlNYW5hZ2VyJTIwJTdCJTdEJTVDbiU1Q25leHBvcnQlMjBsZXQlMjBvdmVybGF5cyUyMCUzRCUyMG5ldyUyME92ZXJsYXlNYW5hZ2VyKCklM0IlNUNuJTVDbmV4cG9ydCUyMGZ1bmN0aW9uJTIwc2V0T3ZlcmxheXMobmV3T3ZlcmxheXMpJTIwJTdCJTVDbiU1Q3RvdmVybGF5cyUyMCUzRCUyMG5ld092ZXJsYXlzJTNCJTVDbiU3RCU1Q24lNUNuZXhwb3J0JTIwY29uc3QlMjBzb21ldGhpbmdFbHNlJTIwJTNEJTIwJ3NvbWV0aGluZyUyMGVsc2UnJTNCJTIyJTdEJTVEJTJDJTIyb3B0aW9ucyUyMiUzQSU3QiUyMmZvcm1hdCUyMiUzQSUyMmVzJTIyJTJDJTIybmFtZSUyMiUzQSUyMm15QnVuZGxlJTIyJTJDJTIyYW1kJTIyJTNBJTdCJTIyaWQlMjIlM0ElMjIlMjIlN0QlMkMlMjJnbG9iYWxzJTIyJTNBJTdCJTdEJTdEJTJDJTIyZXhhbXBsZSUyMiUzQW51bGwlN0Q=
[2]: https://rollupjs.org/repl/?version=2.10.2&shareable=JTdCJTIybW9kdWxlcyUyMiUzQSU1QiU3QiUyMm5hbWUlMjIlM0ElMjJtYWluLmpzJTIyJTJDJTIyY29kZSUyMiUzQSUyMmltcG9ydCUyMCU3QiUyMHNvbWV0aGluZ0Vsc2UlMkMlMjBvdmVybGF5cyUyMCU3RCUyMGZyb20lMjAnLiUyRm92ZXJsYXlzLmpzJyUzQiU1Q25pbXBvcnQlMjAnLiUyRm92ZXJyaWRlLmpzJyUzQiU1Q24lNUNuY29uc29sZS5sb2coc29tZXRoaW5nRWxzZSklM0IlNUNuJTVDbiUyRiUyRiUyMHRoaXMlMjB3aWxsJTIwdHJpZ2dlciUyMGxvYWRpbmclMjBvZiUyMGZ1bGwlMjBvdmVybGF5cy5qcyUyMCUyNiUyMG92ZXJyaWRlLmpzJTIwY29kZSU1Q24lMkYlMkYlMjBjb25zb2xlLmxvZyhvdmVybGF5cy5saXN0KSUzQiUyMiUyQyUyMmlzRW50cnklMjIlM0F0cnVlJTdEJTJDJTdCJTIybmFtZSUyMiUzQSUyMm92ZXJsYXlzLmpzJTIyJTJDJTIyY29kZSUyMiUzQSUyMmNsYXNzJTIwT3ZlcmxheU1hbmFnZXIlMjAlN0IlN0QlNUNuJTVDbmV4cG9ydCUyMGxldCUyMG92ZXJsYXlzJTIwJTNEJTIwbmV3JTIwT3ZlcmxheU1hbmFnZXIoKSUzQiU1Q24lNUNuZXhwb3J0JTIwZnVuY3Rpb24lMjBzZXRPdmVybGF5cyhuZXdPdmVybGF5cyklMjAlN0IlNUNuJTVDdG92ZXJsYXlzJTIwJTNEJTIwbmV3T3ZlcmxheXMlM0IlNUNuJTdEJTVDbiU1Q25leHBvcnQlMjBjb25zdCUyMHNvbWV0aGluZ0Vsc2UlMjAlM0QlMjAnc29tZXRoaW5nJTIwZWxzZSclM0IlMjIlN0QlMkMlN0IlMjJuYW1lJTIyJTNBJTIyb3ZlcnJpZGUuanMlMjIlMkMlMjJjb2RlJTIyJTNBJTIyaW1wb3J0JTIwJTdCJTIwc2V0T3ZlcmxheXMlMjAlN0QlMjBmcm9tJTIwJy4lMkZvdmVybGF5cy5qcyclM0IlNUNuJTVDbnNldE92ZXJsYXlzKG5ldyUyME9iamVjdCgpKSUzQiUyMiU3RCU1RCUyQyUyMm9wdGlvbnMlMjIlM0ElN0IlMjJmb3JtYXQlMjIlM0ElMjJlcyUyMiUyQyUyMm5hbWUlMjIlM0ElMjJteUJ1bmRsZSUyMiUyQyUyMmFtZCUyMiUzQSU3QiUyMmlkJTIyJTNBJTIyJTIyJTdEJTJDJTIyZ2xvYmFscyUyMiUzQSU3QiU3RCU3RCUyQyUyMmV4YW1wbGUlMjIlM0FudWxsJTdE
[3]: https://rollupjs.org/repl/?version=2.10.2&shareable=JTdCJTIybW9kdWxlcyUyMiUzQSU1QiU3QiUyMm5hbWUlMjIlM0ElMjJtYWluLmpzJTIyJTJDJTIyY29kZSUyMiUzQSUyMmltcG9ydCUyMCU3QiUyMHNvbWV0aGluZ0Vsc2UlMkMlMjBzZXRPdmVybGF5cyUyQyUyMG92ZXJsYXlzJTIwJTdEJTIwZnJvbSUyMCcuJTJGb3ZlcmxheXMuanMnJTNCJTVDbmltcG9ydCUyMCU3QiUyME92ZXJsYXlDb250cm9sbGVyJTJDJTIwc29tZXRoaW5nRWxzZTIlMjAlN0QlMjBmcm9tJTIwJy4lMkZPdmVybGF5Q29udHJvbGxlci5qcyclM0IlNUNuJTVDbiUyRiUyRiUyMHRoZSUyMGZvbGxvd2luZyUyMGNvZGUlMjB3aWxsJTIwdHJlZSUyMHNoYWtlJTIwb3ZlcmxheXMlMjBhd2F5JTIwaGVuY2UlMjBvdmVybGF5cyUyMGlzJTIwc2lkZSUyMGVmZmVjdCUyMGZyZWUlMjAlNUNuJTVDbnNldE92ZXJsYXlzKG5ldyUyME9iamVjdCgpKSUzQiU1Q25jb25zb2xlLmxvZyhzb21ldGhpbmdFbHNlKSUzQiU1Q25jb25zb2xlLmxvZyhzb21ldGhpbmdFbHNlMiklM0IlNUNuJTVDbiUyRiUyRioqJTIwVGhlJTIwZm9sbG93aW5nJTIwd2lsbCUyMHRvZ2dsZSUyMGltcG9ydGluZyUyMG9mJTIwb3ZlcmxheXMlMjAqJTJGJTVDbiU1Q24lMkYlMkYlMjAxLiUyMGltcG9ydCUyMG92ZXJsYXlzJTIwZGlyZWN0bHklMjBhbmQlMjBhY2Nlc3MlMjBpdCU1Q24lMkYlMkYlMjBjb25zb2xlLmxvZyhvdmVybGF5cy5saXN0KSUzQiUyMCU1Q24lNUNuJTJGJTJGJTIwMi4lMjBjcmVhdGUlMjBhbiUyME92ZXJsYXlDb250cm9sbGVyJTIwd2hpY2glMjBpbnRlcm5hbGx5JTIwYWNjZXNzZXMlMjBvdmVybGF5cyU1Q24lMkYlMkYlMjBjb25zdCUyMGN0cmwlMjAlM0QlMjBuZXclMjBPdmVybGF5Q29udHJvbGxlcigpJTNCJTVDbiUyRiUyRiUyMGNvbnNvbGUubG9nKGN0cmwubWFuYWdlci5saXN0KSUzQiU1Q24lNUNuJTIyJTJDJTIyaXNFbnRyeSUyMiUzQXRydWUlN0QlMkMlN0IlMjJuYW1lJTIyJTNBJTIyb3ZlcmxheXMuanMlMjIlMkMlMjJjb2RlJTIyJTNBJTIyY2xhc3MlMjBPdmVybGF5TWFuYWdlciUyMCU3QiU1Q24lNUN0Y29uc3RydWN0b3IoKSUyMCU3QiU1Q24lNUN0JTVDdHRoaXMubGlzdCUyMCUzRCUyMCU1QiU1RCUzQiU1Q24lNUN0JTdEJTVDbiUyMCUyMGFkZChhKSUyMCU3QiU1Q24lMjAlMjAlMjAlMjB0aGlzLmxpc3QucHVzaChhKSUzQiU1Q24lNUN0JTdEJTVDbiU3RCU1Q24lNUNuZXhwb3J0JTIwbGV0JTIwb3ZlcmxheXMlMjAlM0QlMjBuZXclMjBPdmVybGF5TWFuYWdlcigpJTNCJTVDbiU1Q25leHBvcnQlMjBmdW5jdGlvbiUyMHNldE92ZXJsYXlzKG5ld092ZXJsYXlzKSUyMCU3QiU1Q24lNUN0b3ZlcmxheXMlMjAlM0QlMjBuZXdPdmVybGF5cyUzQiU1Q24lN0QlNUNuJTVDbmV4cG9ydCUyMGNvbnN0JTIwc29tZXRoaW5nRWxzZSUyMCUzRCUyMCdzb21ldGhpbmclMjBlbHNlJyUzQiU1Q24lNUNuJTJGJTJGJTIwdGhlJTIwZm9sbG93aW5nJTIwbGluZSUyMGlzJTIwYSUyMHNpZGUlMjBlZmZlY3QlMjBhcyUyMGl0JTIwYWx3YXlzJTIwd2lsbCUyMGJlJTIwaW5jbHVkZWQlNUNuY29uc29sZS5sb2coJ292ZXJsYXlzJTIwc2lkZSUyMGVmZmVjdCcpJTNCJTIyJTJDJTIyaXNFbnRyeSUyMiUzQWZhbHNlJTdEJTJDJTdCJTIybmFtZSUyMiUzQSUyMk92ZXJsYXlDb250cm9sbGVyLmpzJTIyJTJDJTIyY29kZSUyMiUzQSUyMmltcG9ydCUyMCU3QiUyMG92ZXJsYXlzJTIwJTdEJTIwZnJvbSUyMCcuJTJGb3ZlcmxheXMuanMnJTNCJTVDbiU1Q25leHBvcnQlMjBjbGFzcyUyME92ZXJsYXlDb250cm9sbGVyJTIwJTdCJTVDbiUyMCUyMCUyMGNvbnN0cnVjdG9yKGNvbmZpZyUyMCUzRCUyMCU3QiU3RCUyQyUyMG1hbmFnZXIlMjAlM0QlMjBvdmVybGF5cyklMjAlN0IlNUNuJTIwJTIwJTIwJTIwJTIwdGhpcy5tYW5hZ2VyJTIwJTNEJTIwbWFuYWdlciUzQiU1Q24lNUN0JTVDdCUyMHRoaXMubWFuYWdlci5hZGQodGhpcyklM0IlNUNuJTVDdCUyMCU3RCU1Q24lN0QlNUNuJTVDbmV4cG9ydCUyMGNvbnN0JTIwc29tZXRoaW5nRWxzZTIlMjAlM0QlMjAnc29tZXRoaW5nJTIwZWxzZSclM0IlMjIlN0QlNUQlMkMlMjJvcHRpb25zJTIyJTNBJTdCJTIyZm9ybWF0JTIyJTNBJTIyZXMlMjIlMkMlMjJuYW1lJTIyJTNBJTIybXlCdW5kbGUlMjIlMkMlMjJhbWQlMjIlM0ElN0IlMjJpZCUyMiUzQSUyMiUyMiU3RCUyQyUyMmdsb2JhbHMlMjIlM0ElN0IlN0QlN0QlMkMlMjJleGFtcGxlJTIyJTNBbnVsbCU3RA==
