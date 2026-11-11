import { getListboxMembers } from '@lion/ui/listbox-test-helpers.js';

/**
 * @typedef {import('../src/LionSelectRich.js').LionSelectRich} LionSelectRich
 */

/**
 * @param { LionSelectRich } el
 */
export function getSelectRichMembers(el) {
  const obj = getListboxMembers(el);
  // eslint-disable-next-line no-return-assign
  return {
    ...obj,
    // @ts-ignore [allow-protected] in test
    ...{ _invokerNode: el._invokerNode, _overlayCtrl: el._overlayCtrl },
  };
}
