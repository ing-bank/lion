import type { LoadHook } from 'node:module';
/**
 * When an attempt is made to import a CSS file/module, code is
 * generated to read the corresponding file, add it to a CSSStyleSheet
 * instance and return that instance as the default export.
 *
 * This expects the CSSStyleSheet class to be available in the global scope.
 * See register-css-hook.ts for how this is registered in Node.js.
 *
 * https://nodejs.org/api/module.html#loadurl-context-nextload
 */
export declare const load: LoadHook;
//# sourceMappingURL=css-hook.d.ts.map