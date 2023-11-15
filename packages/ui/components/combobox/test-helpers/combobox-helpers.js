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
  let cursorPosition = _inputNode.selectionStart || 0;

  for (const key of values) {
    // eslint-disable-next-line no-await-in-loop, no-loop-func
    await new Promise(resolve => {
      const selectionStart = _inputNode.selectionStart || 0;
      const selectionEnd = _inputNode.selectionEnd || 0;
      const hasSelection = selectionStart !== selectionEnd;

      if (key === 'Backspace' || key === 'Delete') {
        if (hasSelection) {
          _inputNode.value =
            _inputNode.value.slice(0, selectionStart) + _inputNode.value.slice(selectionEnd);
          cursorPosition = selectionStart;
        } else if (cursorPosition > 0 && key === 'Backspace') {
          _inputNode.value =
            _inputNode.value.slice(0, cursorPosition - 1) + _inputNode.value.slice(cursorPosition);
          cursorPosition -= 1;
        } else if (cursorPosition < _inputNode.value.length && key === 'Delete') {
          _inputNode.value =
            _inputNode.value.slice(0, cursorPosition) + _inputNode.value.slice(cursorPosition + 1);
        }
      } else if (hasSelection) {
        _inputNode.value =
          _inputNode.value.slice(0, selectionStart) + key + _inputNode.value.slice(selectionEnd);
        cursorPosition = selectionStart + key.length;
      } else {
        _inputNode.value =
          _inputNode.value.slice(0, cursorPosition) + key + _inputNode.value.slice(cursorPosition);
        cursorPosition += 1;
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
