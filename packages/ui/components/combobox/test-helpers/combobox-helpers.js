import { getListboxMembers } from '@lion/ui/listbox-test-helpers.js';

/**
 * @typedef {import('@lion/ui/combobox.js').LionCombobox} LionCombobox
 */

/**
 * @param { LionCombobox } el
 */
export function getComboboxMembers(el) {
  const obj = getListboxMembers(el);
  return {
    ...obj,
    ...{
      // @ts-ignore [allow-protected] in test
      _invokerNode: el._invokerNode,
      // @ts-ignore [allow-protected] in test
      _overlayCtrl: el._overlayCtrl,
      // @ts-ignore [allow-protected] in test
      _comboboxNode: el._comboboxNode,
      // @ts-ignore [allow-protected] in test
      _inputNode: el._inputNode,
      // @ts-ignore [allow-protected] in test
      _listboxNode: el._listboxNode,
      // @ts-ignore [allow-protected] in test
      _selectionDisplayNode: el._selectionDisplayNode,
      // @ts-ignore [allow-protected] in test
      _activeDescendantOwnerNode: el._activeDescendantOwnerNode,
      // @ts-ignore [allow-protected] in test
      _ariaVersion: el._ariaVersion,
    },
  };
}

/**
 * @param {LionCombobox} el
 * @param {string} value
 */
// TODO: add keys that actually make sense...
export function mimicUserTyping(el, value) {
  const { _inputNode } = getComboboxMembers(el);
  _inputNode.dispatchEvent(new Event('focusin', { bubbles: true }));
  // eslint-disable-next-line no-param-reassign
  _inputNode.value = value;
  _inputNode.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  _inputNode.dispatchEvent(new KeyboardEvent('keyup', { key: value }));
  _inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: value }));
}

/**
 * @param {HTMLElement} el
 * @param {string} key
 */
export function mimicKeyPress(el, key) {
  el.dispatchEvent(new KeyboardEvent('keydown', { key }));
  el.dispatchEvent(new KeyboardEvent('keyup', { key }));
}

/**
 * @param {LionCombobox} el
 * @param {string[]} values
 */
export async function mimicUserTypingAdvanced(el, values) {
  const { _inputNode } = getComboboxMembers(el);
  _inputNode.dispatchEvent(new Event('focusin', { bubbles: true }));

  for (const key of values) {
    // eslint-disable-next-line no-await-in-loop, no-loop-func
    await new Promise(resolve => {
      const hasSelection = _inputNode.selectionStart !== _inputNode.selectionEnd;

      if (key === 'Backspace') {
        if (hasSelection) {
          _inputNode.value =
            _inputNode.value.slice(
              0,
              _inputNode.selectionStart ? _inputNode.selectionStart : undefined,
            ) +
            _inputNode.value.slice(
              _inputNode.selectionEnd ? _inputNode.selectionEnd : undefined,
              _inputNode.value.length,
            );
        } else {
          _inputNode.value = _inputNode.value.slice(0, -1);
        }
      } else if (hasSelection) {
        _inputNode.value =
          _inputNode.value.slice(
            0,
            _inputNode.selectionStart ? _inputNode.selectionStart : undefined,
          ) +
          key +
          _inputNode.value.slice(
            _inputNode.selectionEnd ? _inputNode.selectionEnd : undefined,
            _inputNode.value.length,
          );
      } else {
        _inputNode.value += key;
      }

      mimicKeyPress(_inputNode, key);
      _inputNode.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

      el.updateComplete.then(() => {
        // @ts-ignore
        resolve();
      });
    });
  }
}

/**
 * @param {LionCombobox} el
 */
export function getFilteredOptionValues(el) {
  const options = el.formElements;
  /**
   * @param {{ style: { display: string; }; }} option
   */
  const filtered = options.filter(option => option.getAttribute('aria-hidden') !== 'true');
  /**
   * @param {{ value: any; }} option
   */
  return filtered.map(option => option.value);
}
