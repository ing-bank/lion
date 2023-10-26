## @mdjs/core@0.20.0

### mdjsStoryParse.js

The original file URL is here: [URL](https://github.com/modernweb-dev/rocket/blob/%40mdjs/core%400.20.0/packages/mdjs-core/src/mdjsStoryParse.js)

#### Why

Astro does not call [mdjsStoryParse](https://github.com/modernweb-dev/rocket/blob/%40mdjs/core%400.20.0/packages/mdjs-core/src/mdjsStoryParse.js#L53) every time an md file is changed while `watching`. The function is called only once. However some [shared variables](https://github.com/modernweb-dev/rocket/blob/%40mdjs/core%400.20.0/packages/mdjs-core/src/mdjsStoryParse.js#L58-L59) are set on the level of the `mdjsStoryParse`. That leads to the situation that those variable are shared among all md files which is not according to the design. The orignal idea is to share those per an md file. As a result when generating `__mdjs-stories.js` files, they get polluted with the data from other files.

#### About the fix

- [nodeCodeVisitor](https://github.com/modernweb-dev/rocket/blob/%40mdjs/core%400.20.0/packages/mdjs-core/src/mdjsStoryParse.js#L68) function was moved under the [transformer](https://github.com/modernweb-dev/rocket/blob/%40mdjs/core%400.20.0/packages/mdjs-core/src/mdjsStoryParse.js#L182C18-L182C29) function
- [Shared variables](https://github.com/modernweb-dev/rocket/blob/%40mdjs/core%400.20.0/packages/mdjs-core/src/mdjsStoryParse.js#L58-L59) were moved under the `transformer` function

This way the shared variables instantiated on every `transformer` function call.

### mdjsParse.js

#### Why patching

Astro does not call [mdjsParse](https://github.com/modernweb-dev/rocket/blob/%40mdjs/core%400.20.0/packages/mdjs-core/src/mdjsParse.js#L7) every time an md file is changed while `watching`. The function is called only once. However some [shared variables](https://github.com/modernweb-dev/rocket/blob/%40mdjs/core%400.20.0/packages/mdjs-core/src/mdjsParse.js#L8) are set on the level of the `mdjsParse`. That leads to the situation that those variable are shared among all md files which is not according to the design. The orignal idea is to share those per an md file. As a result when generating `__mdjs-stories.js` files, they get polluted with the data from other files.

#### About the patch

- [Shared variables](https://github.com/modernweb-dev/rocket/blob/%40mdjs/core%400.20.0/packages/mdjs-core/src/mdjsParse.js#L8) were moved under the `transformer` function

This way the shared variables instantiated on every `transformer` function call.
