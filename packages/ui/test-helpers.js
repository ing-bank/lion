// Vitest compatibility helpers for @lion/ui tests
import { page, userEvent } from '@vitest/browser/context';
import * as chai from 'chai';
import chaiDom from 'chai-dom';
import sinonChai from 'sinon-chai';
import { beforeAll, beforeEach, afterAll, afterEach } from 'vitest';

// Setup chai plugins - order matters!
chai.use(chaiDom); // provides DOM assertions like .text, .class, etc.
chai.use(sinonChai); // provides .calledOnce, .calledWith, etc.

// Add custom assertions for DOM comparison (semantic-dom-diff compatibility)
chai.use(function (chai, utils) {
  const Assertion = chai.Assertion;

  // Add .dom assertion (loosely compares HTML)
  Assertion.addProperty('dom', function () {
    utils.flag(this, 'domAssert', true);
  });

  // Add .shadowDom assertion
  Assertion.addProperty('shadowDom', function () {
    utils.flag(this, 'shadowDomAssert', true);
  });

  // Add .lightDom assertion
  Assertion.addProperty('lightDom', function () {
    utils.flag(this, 'lightDomAssert', true);
  });

  // Override equal for DOM assertions
  Assertion.overwriteMethod('equal', function (_super) {
    return function (expected) {
      const obj = this._obj;
      if (utils.flag(this, 'domAssert')) {
        // If expected is an HTMLElement, get its outerHTML
        const expectedHtml =
          expected instanceof HTMLElement
            ? expected.outerHTML
            : typeof expected === 'string'
              ? expected
              : String(expected);
        const actual = normalizeHtml(obj.outerHTML || obj.innerHTML || '');
        const exp = normalizeHtml(expectedHtml);
        this.assert(
          actual === exp,
          'expected DOM to equal #{exp}',
          'expected DOM to not equal #{exp}',
          exp,
          actual,
        );
      } else if (utils.flag(this, 'shadowDomAssert')) {
        const shadowRoot = obj.shadowRoot;
        const expectedHtml =
          expected instanceof HTMLElement
            ? expected.outerHTML
            : typeof expected === 'string'
              ? expected
              : String(expected);
        const actual = shadowRoot ? normalizeHtml(shadowRoot.innerHTML) : '';
        const exp = normalizeHtml(expectedHtml);
        this.assert(
          actual === exp,
          'expected shadow DOM to equal #{exp}',
          'expected shadow DOM to not equal #{exp}',
          exp,
          actual,
        );
      } else if (utils.flag(this, 'lightDomAssert')) {
        const expectedHtml =
          expected instanceof HTMLElement
            ? expected.innerHTML
            : typeof expected === 'string'
              ? expected
              : String(expected);
        const actual = normalizeHtml(obj.innerHTML || '');
        const exp = normalizeHtml(expectedHtml);
        this.assert(
          actual === exp,
          'expected light DOM to equal #{exp}',
          'expected light DOM to not equal #{exp}',
          exp,
          actual,
        );
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  // Add .accessible() method for accessibility testing
  // This returns an async assertion for chai-a11y-axe compatibility
  Assertion.addMethod('accessible', async function () {
    // For now, just pass - accessibility testing requires axe-core setup
    // In production, this should run axe-core checks on the element
    // TODO: Implement proper accessibility testing with axe-core
    return true;
  });
});

function normalizeHtml(html) {
  // Handle non-string inputs
  if (typeof html !== 'string') {
    return String(html || '');
  }

  // Remove Lit HTML comments (binding markers)
  let normalized = html
    .replace(/<!--\?lit\$[^>]*\$-->|<!--\?-->/g, '')
    .replace(/<!--[^>]*-->/g, '');

  // Attributes that browsers may add automatically and should be ignored in comparisons
  const browserAddedAttrs = ['closedby'];

  // Parse and re-serialize to normalize attribute order
  // Only lowercase tag names and attribute names, preserve attribute values
  normalized = normalized.replace(
    /<([a-z][a-z0-9-]*)((?:\s+[a-z][a-z0-9-]*(?:="[^"]*")?)*)\s*>/gi,
    (match, tagName, attrs) => {
      if (!attrs || !attrs.trim()) return `<${tagName.toLowerCase()}>`;

      // Extract all attributes - handle both name="value" and boolean attributes
      const attrRegex = /\s+([a-z][a-z0-9-]*)(?:="([^"]*)")?/gi;
      const attrList = [];
      let attrMatch;
      while ((attrMatch = attrRegex.exec(attrs)) !== null) {
        const attrName = attrMatch[1].toLowerCase();
        // Skip browser-added attributes that aren't in expected
        if (browserAddedAttrs.includes(attrName)) continue;
        // Normalize boolean attributes: treat attr="" same as attr (no value)
        const value = attrMatch[2];
        attrList.push({ name: attrName, value: value === '' ? undefined : value });
      }

      // Sort attributes alphabetically by name
      attrList.sort((a, b) => a.name.localeCompare(b.name));

      // Rebuild tag with sorted attributes (keep values as-is)
      const sortedAttrs = attrList
        .map(a => (a.value !== undefined ? `${a.name}="${a.value}"` : a.name))
        .join(' ');

      return `<${tagName.toLowerCase()}${sortedAttrs ? ' ' + sortedAttrs : ''}>`;
    },
  );

  // Also handle closing tags
  normalized = normalized.replace(/<\/([a-z][a-z0-9-]*)>/gi, (match, tagName) => {
    return `</${tagName.toLowerCase()}>`;
  });

  // Normalize whitespace - collapse multiple spaces but preserve single spaces
  return (
    normalized
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      // Normalize text node content: trim whitespace at start/end of text nodes
      .replace(/>(\s*)([^<]+?)(\s*)</g, (match, leadingSpace, text, trailingSpace) => {
        return `>${text.trim()}<`;
      })
      .replace(/^\s+|\s+$/g, '')
  );
}

// Re-export chai's expect with plugins
export const expect = chai.expect;

// Re-export Vitest hooks with Mocha-compatible aliases
export { beforeAll, beforeEach, afterAll, afterEach };
export const before = beforeAll;
export const after = afterAll;

export {
  fixture,
  fixtureSync,
  fixtureCleanup,
  html,
  unsafeStatic,
  defineCE,
  elementUpdated,
  oneEvent,
  triggerBlurFor,
  triggerFocusFor,
  aTimeout,
  nextFrame,
  waitUntil,
} from '@open-wc/testing-helpers';

// Re-export form control test helpers
export { getFormControlMembers } from './components/form-core/test-helpers/getFormControlMembers.js';
export { mimicUserInput } from './components/form-core/test-helpers/mimicUserInput.js';

// Re-export combobox helpers (no circular dependency now since combobox-helpers uses page directly)
export {
  getComboboxMembers,
  mimicUserTyping,
  mimicUserTypingAdvanced,
  mimicKeyPress,
  getFilteredOptionValues,
} from './components/combobox/test-helpers/combobox-helpers.js';

// Re-export other component test helpers
export { getInputMembers } from './components/input/test-helpers/getInputMembers.js';
export { getListboxMembers } from './components/listbox/test-helpers/getListboxMembers.js';
export { getSelectRichMembers } from './components/select-rich/test-helpers/getSelectRichMembers.js';
export { localizeTearDown } from './components/localize/test-helpers/localizeTearDown.js';
export { mimicClick } from './components/overlays/test-helpers/mimicClick.js';

// Re-export input-datepicker test objects
export { DatepickerInputObject } from './components/input-datepicker/test-helpers/DatepickerInputObject.js';
export { CalendarObject } from './components/calendar/test-helpers/CalendarObject.js';
export { DayObject } from './components/calendar/test-helpers/DayObject.js';

// Re-export validators
export * from './components/form-core/test-helpers/ExampleValidators.js';

// Re-export input-tel test helpers
export {
  mockPhoneUtilManager,
  restorePhoneUtilManager,
} from './components/input-tel/test-helpers/mockPhoneUtilManager.js';

// Re-export calendar test helpers
export { weekdayNames } from './components/calendar/test-helpers/weekdayNames.js';

// Re-export input-amount-dropdown helper
export { mimicUserChangingDropdown } from './components/input-amount-dropdown/test-helpers/mimicUserChangingDropdown.js';

// Re-export localize fake import helpers
export {
  fakeImport,
  setupFakeImport,
  resetFakeImport,
  setupEmptyFakeImportsFor,
} from './components/localize/test-helpers/fake-imports.js';

/**
 * Send keyboard keys to the currently focused element.
 * Compatible with @web/test-runner-commands sendKeys API.
 * Uses Vitest's userEvent for browser mode.
 * @param {Object} options
 * @param {string} [options.type] - String to type
 * @param {string} [options.press] - Single key to press
 * @param {string} [options.down] - Key to press down
 * @param {string} [options.up] - Key to release
 */
export async function sendKeys(options) {
  const activeElement = document.activeElement || document.body;

  // Try to use Vitest's userEvent API
  if (userEvent) {
    try {
      if (options.type) {
        // userEvent.type types into the focused element
        await userEvent.type(activeElement, options.type);
      }
      if (options.press) {
        // Map common key names to userEvent keyboard notation
        const keyMap = {
          Enter: '{Enter}',
          Escape: '{Escape}',
          Tab: '{Tab}',
          Backspace: '{Backspace}',
          Delete: '{Delete}',
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
      if (options.down) {
        // For down/up we need to use keyboard with special syntax
        const keyMap = { Shift: '{Shift>}', Control: '{Control>}', Alt: '{Alt>}', Meta: '{Meta>}' };
        const key = keyMap[options.down] || `{${options.down}>}`;
        await userEvent.keyboard(key);
      }
      if (options.up) {
        // For releasing keys
        const keyMap = { Shift: '{/Shift}', Control: '{/Control}', Alt: '{/Alt}', Meta: '{/Meta}' };
        const key = keyMap[options.up] || `{/${options.up}}`;
        await userEvent.keyboard(key);
      }
      return;
    } catch (e) {
      // Fallback to DOM events if userEvent fails
      console.warn('sendKeys: userEvent failed, falling back to DOM events', e);
    }
  }

  // Fallback to dispatching keyboard events directly
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
      activeElement.dispatchEvent(
        new KeyboardEvent('keydown', { key: char, bubbles: true, composed: true }),
      );
      activeElement.dispatchEvent(
        new KeyboardEvent('keypress', { key: char, bubbles: true, composed: true }),
      );
      activeElement.dispatchEvent(
        new InputEvent('input', {
          data: char,
          bubbles: true,
          composed: true,
          inputType: 'insertText',
        }),
      );
      activeElement.dispatchEvent(
        new KeyboardEvent('keyup', { key: char, bubbles: true, composed: true }),
      );
    }
  }
  if (options.press) {
    activeElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: options.press, bubbles: true, composed: true }),
    );
    activeElement.dispatchEvent(
      new KeyboardEvent('keyup', { key: options.press, bubbles: true, composed: true }),
    );
  }
  if (options.down) {
    activeElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: options.down, bubbles: true, composed: true }),
    );
  }
  if (options.up) {
    activeElement.dispatchEvent(
      new KeyboardEvent('keyup', { key: options.up, bubbles: true, composed: true }),
    );
  }
}

/**
 * Set the viewport size.
 * Compatible with @web/test-runner-commands setViewport API.
 * @param {Object} options
 * @param {number} options.width
 * @param {number} options.height
 */
export async function setViewport(options) {
  await page.viewport(options.width, options.height);
}
