/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as vm from 'vm';
/**
 * Creates a new object that provides a basic set of globals suitable for use as
 * the default context object for a VM module.
 *
 * Note this does not return all default Node globals, rather it returns the
 * subset of Node globals which are also defined in browsers.
 */
export declare function makeDefaultContextObject(): Partial<typeof globalThis>;
/**
 * A subset of the Node vm.Module API.
 * @deprecated Use vm.Module instead.
 */
export interface VmModule {
    /**
     * The namespace object of the module that provides access to its exports.
     * See https://nodejs.org/api/vm.html#modulenamespace
     */
    namespace: {
        [name: string]: unknown;
    };
}
export interface ModuleRecord {
    path: string;
    module?: vm.Module;
    imports: Array<string>;
    evaluated: Promise<vm.Module>;
}
interface ImportResult {
    path: string;
    module: vm.Module;
}
export interface Options {
    global?: object;
    filesystem?: FileSystem;
}
/**
 * A JavaScript module loader that utilizes the Node `vm` module
 * (https://nodejs.org/api/vm.html).
 *
 * Most of the hooks implement fairly standard web-compatible module loading:
 *  - An import specifier resolver that uses Node module resolution
 *  - A linker that loads dependencies from the local filesystem
 *  - A module cache keyed by resolved URL
 *  - import.meta.url support
 *  - Dynamic import() that functions the same as static imports
 *
 * There are some behaviors specific to lit-html. Mainly that imports of certain
 * directives are redirected to Node/SSR compatible implementations.
 */
export declare class ModuleLoader {
    private static _nextVmContextId;
    private readonly _vmContextId;
    private readonly _context;
    /**
     * TODO (justinfagnani): This is a temporary stand-in for a real graph API.
     * We want to be able to invalidate a module and the transitive closure
     * of its importers so that we can update the graph.
     *
     * The keys of the map are useful for enumerating static imported modules
     * after an entrypoint is loaded.
     */
    readonly cache: Map<string, ModuleRecord>;
    constructor(options?: Options);
    /**
     * Imports a module given by `path` into a new VM context with `contextGlobal` as the
     * global object.
     */
    importModule(specifier: string, referrerPathOrFileUrl: string): Promise<ImportResult>;
    /**
     * Performs the actual loading of module source from disk, creates the Module
     * instance, and maintains the module cache. Also loads all dependencies of
     * the module.
     *
     * Used directly by `importModule` and by the linker and dynamic import()
     * support function.
     */
    private _loadModule;
    private _loadBuiltInModule;
    private _importModuleDynamically;
    private _linker;
    private _getIdentifier;
    private _getBuiltInIdentifier;
    /**
     * `getModulePath` returns the file path for a provided module.
     */
    private getModulePath;
}
/**
 * Resolves specifiers using web-ish Node module resolution. Web-compatible full
 * URLs are passed through unmodified. Relative and absolute URLs (starting in
 * `/`, `./`, `../`) are resolved relative to `referrerPath`. "Bare" module
 * specifiers are resolved with the 'resolve' package.
 *
 * This replaces some Lit modules with SSR compatible equivalents. This is
 * currently hard-coded, but should instead be done with a configuration object.
 */
export declare const resolveSpecifier: (specifier: string, referrerPath: string) => Promise<URL>;
export {};
//# sourceMappingURL=module-loader.d.ts.map