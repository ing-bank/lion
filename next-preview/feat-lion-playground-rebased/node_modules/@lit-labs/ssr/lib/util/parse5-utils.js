/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { traverse, replaceWith, isElementNode, } from '@parse5/tools';
export function removeFakeRootElements(node) {
    const fakeRootElements = [];
    traverse(node, {
        'pre:node': (node) => {
            if (isElementNode(node) &&
                node.nodeName &&
                node.nodeName.match(/^(html|head|body)$/i) &&
                !node.sourceCodeLocation) {
                fakeRootElements.unshift(node);
            }
        },
    });
    for (const el of fakeRootElements) {
        replaceWith(el, ...el.childNodes);
    }
}
//# sourceMappingURL=parse5-utils.js.map