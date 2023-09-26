# Dev notes

* It is not possible to use `rocket-preset-extend-lion-docs` out of the box. The reason is that it relies on the `plugins` global object,
which is specific to Rocket (see more details in node_modules/plugins-manager/src/addPlugin.js). Also it specifies the order among existing plugins to inject the its internal plugins (see more for details https://github.com/ing-bank/lion/blob/master/packages-node/rocket-preset-extend-lion-docs/preset/extendLionDocs.js#L66). To work around it I followed these steps
    * Expose `rocket-preset-extend-lion-docs`'s  internal file structure via its `index.js` in `node_modules` locally replacing in `node_modules/rocket-preset-extend-lion-docs/index.js` this
        ```
        export { extendLionDocs } from './preset/extendLionDocs.js';
        ```
        with this:
        ```
        export { extendLionDocs } from './preset/extendLionDocs.js';
        export { remarkExtendLionDocsTransformJs } from './src/remarkExtendLionDocsTransformJs.js';
        export { remarkUrlToLocal } from './src/remarkUrlToLocal.js';
        export { generateExtendDocsConfig } from './src/generateExtendDocsConfig.js';
        ```
    * Create `src/utils/remark-plugings/wrapper-for-rocket-preset-extend-lion-docs/extendLionDocsInhanced.js` as a copy of `node_modules/rocket-preset-extend-lion-docs/preset/extendLionDocs.js`
    * Replace this:
        ```
        import { remarkExtendLionDocsTransformJs } from '../src/remarkExtendLionDocsTransformJs.js';
        import { remarkUrlToLocal } from '../src/remarkUrlToLocal.js';
        import { generateExtendDocsConfig } from '../src/generateExtendDocsConfig.js';
        ``` 
        with this:
        ```
        import { remarkExtendLionDocsTransformJs, remarkUrlToLocal, generateExtendDocsConfig } from 'rocket-preset-extend-lion-docs';
        ``` 
    * Update the `return` statements with the array of plugins as Astro requires
    * Remove `remarkExtend` from `astro.config.mjs` since `extendLionDocsInhanced.js` returning it as well
* In node_modules/rocket-preset-extend-lion-docs/src/remarkUrlToLocal.js 
    * Replace 
        ```
        const inputPath = toPosixPath(page.inputPath);
        ```
        with 
        ```
        const inputPath = toPosixPath(fileCwd);
        ```
    * Define on the top level of the file:
        ```
        let fileCwd = undefined;
        ```
    * Replace
        ```
        function transformer(tree, file) {
        ```
        with 
        ```
        function transformer(tree, file) {
        fileCwd = file.cwd
        ```

