import { getFormControlMembers } from '@lion/components/form-core-test-helpers.js';

/**
 * @typedef {import('@lion/listbox/src/LionOptions').LionOptions} LionOptions
 * @typedef {import('@lion/listbox/types/ListboxMixinTypes').ListboxHost} ListboxHost
 * @typedef {import('@lion/form-core/types/FormControlMixinTypes').FormControlHost} FormControlHost
 */

/**
 * @param { ListboxHost } el
 */
export function getListboxMembers(el) {
  const obj = getFormControlMembers(/** @type { * & FormControlHost } */ (el));
  // eslint-disable-next-line no-return-assign
  return {
    ...obj,
    _inputNode: /** @type {* & LionOptions} */ (obj._inputNode),
    // @ts-ignore [allow-protected] in test
    ...{ _listboxNode: el._listboxNode, _activeDescendantOwnerNode: el._activeDescendantOwnerNode },
  };
}
