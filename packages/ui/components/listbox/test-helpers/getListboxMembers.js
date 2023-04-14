import { getFormControlMembers } from '@lion/ui/form-core-test-helpers.js';

/**
 * @typedef {import('../../listbox/src/LionOptions.js').LionOptions} LionOptions
 * @typedef {import('../../listbox/types/ListboxMixinTypes.js').ListboxHost} ListboxHost
 * @typedef {import('../../form-core/types/FormControlMixinTypes.js').FormControlHost} FormControlHost
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
