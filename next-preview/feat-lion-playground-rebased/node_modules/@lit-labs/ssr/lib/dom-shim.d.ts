/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * Constructs a fresh instance of the "window" vm context to use for evaluating
 * user SSR code. Includes a minimal shim of DOM APIs.
 *
 * @param includeJSBuiltIns Whether certain standard JS context globals like
 *  `console` and `setTimeout` should also be added to the global. Should
 *  generally only be true when adding window to a fresh VM context that
 *  starts with nothing.
 * @param props Additional properties to add to the window global
 */
export declare const getWindow: ({ includeJSBuiltIns, props, }: {
    includeJSBuiltIns?: boolean | undefined;
    props?: {} | undefined;
}) => {
    [key: string]: unknown;
};
export declare const installWindowOnGlobal: (props?: {
    [key: string]: unknown;
}) => void;
//# sourceMappingURL=dom-shim.d.ts.map