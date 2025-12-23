import { getListboxMembers } from '@lion/ui/listbox-test-helpers.js';
import { userEvent } from '@vitest/browser/context';

/**
 * Send keyboard keys using Vitest userEvent or fallback to DOM events
 * @param {Object} options
 * @param {string} [options.type] - String to type
 * @param {string} [options.press] - Single key to press
 */
async function sendKeys(options) {
  const activeElement = document.activeElement || document.body;

  // Try to use Vitest's userEvent API
  if (userEvent) {
    try {
      if (options.type) {
        await userEvent.type(activeElement, options.type);
      }
      if (options.press) {
        const keyMap = {
          Enter: '{Enter}',
          Escape: '{Escape}',
          Tab: '{Tab}',
          Backspace: '{Backspace}',
          ArrowUp: '{ArrowUp}',
          ArrowDown: '{ArrowDown}',
          ArrowLeft: '{ArrowLeft}',
          ArrowRight: '{ArrowRight}',
          Home: '{Home}',
          End: '{End}',
          Space: ' ',
          ' ': ' ',
        };
        const key = keyMap[options.press] || options.press;
        await userEvent.keyboard(key);
      }
      return;
    } catch (e) {
      // Fallback to DOM events if userEvent fails
    }
  }

  // Fallback to DOM events
  if (options.type) {
    for (const char of options.type) {
      // For input elements, we need to actually update the value
      if (
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement
      ) {
        const start = activeElement.selectionStart || activeElement.value.length;
        const end = activeElement.selectionEnd || activeElement.value.length;
        activeElement.value =
          activeElement.value.slice(0, start) + char + activeElement.value.slice(end);
        activeElement.selectionStart = activeElement.selectionEnd = start + 1;
      }
      activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
      activeElement.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));
      activeElement.dispatchEvent(
        new InputEvent('input', { data: char, bubbles: true, inputType: 'insertText' }),
      );
      activeElement.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
    }
  }
  if (options.press) {
    activeElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: options.press, bubbles: true }),
    );
    activeElement.dispatchEvent(new KeyboardEvent('keyup', { key: options.press, bubbles: true }));
  }
}

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
 * @param {string} keys
 */
export async function mimicUserTyping(el, keys) {
  const { _inputNode } = getComboboxMembers(el);
  _inputNode.value = '';
  _inputNode.focus();
  await sendKeys({ type: keys });
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
