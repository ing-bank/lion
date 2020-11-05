/* eslint-disable no-param-reassign */

/**
 * Implementation based on: https://github.com/PolymerElements/iron-overlay-behavior/blob/master/iron-focusables-helper.html
 * The original implementation does not work for non-Polymer web components,
 * and contains several bugs on IE11.
 */

import { getDeepActiveElement } from './get-deep-active-element.js';
import { getFocusableElements } from './get-focusable-elements.js';
import { deepContains } from './deep-contains.js';
import { keyCodes } from './key-codes.js';

/**
 * Rotates focus within a list of elements. If shift key was not pressed and focus
 * is on last item, puts focus on the first item. Reversed if shift key.
 *
 * @param {HTMLElement} rootElement The root element
 * @param {KeyboardEvent} e The keyboard event
 */
export function rotateFocus(rootElement, e) {
  // Find focusable elements
  const els = getFocusableElements(rootElement);
  // Determine the focus rotation boundaries.
  let boundaryEls;

  // If more than two elements, take the first and last
  if (els.length >= 2) {
    boundaryEls = [els[0], els[els.length - 1]];

    // If 1 element, it is the boundary
  } else if (els.length === 1) {
    boundaryEls = [els[0], els[0]];

    // If no focusable elements, root becomes the boundary
  } else {
    boundaryEls = [rootElement, rootElement];
  }

  // Reverse direction of boundaries if shift key was pressed
  if (e.shiftKey) {
    boundaryEls.reverse();
  }

  // Take first and last elements within boundary
  const [first, last] = boundaryEls;

  // Get the currently focused element
  const activeElement = /** @type {HTMLElement} */ (getDeepActiveElement());

  /**
   * If currently focused on the root element or an element contained within the root element:
   * allow native browser behavior (tab to the next node in DOM order).
   *
   * If currently focused on the last focusable element within the root element, or on an element
   * outside of the root element: redirect focus to the first focusable element.
   */
  if (activeElement === rootElement || (els.includes(activeElement) && last !== activeElement)) {
    return;
  }

  e.preventDefault();
  first.focus();
}

/**
 * Contains focus within given root element. When focus is on the last focusable
 * element inside the root element, the next focus will be redirected to the first
 * focusable element.
 *
 * @param {HTMLElement} rootElement The element to contain focus within
 * @returns {{ disconnect: () => void }} handler with a disconnect callback
 */
export function containFocus(rootElement) {
  const focusableElements = getFocusableElements(rootElement);
  // Initial focus goes to first element with autofocus, or the root element
  const initialFocus = focusableElements.find(e => e.hasAttribute('autofocus')) || rootElement;
  /** @type {HTMLElement} */
  let tabDetectionElement;

  // If root element will receive focus, it should have a tabindex of -1.
  // This makes it focusable through js, but it won't appear in the tab order
  if (initialFocus === rootElement) {
    rootElement.tabIndex = -1;
    rootElement.style.setProperty('outline', 'none');
  }

  // Focus first focusable element
  initialFocus.focus();

  /**
   * Ensures focus stays inside root element on tab
   * @param {KeyboardEvent} e
   */
  function handleKeydown(e) {
    if (e.keyCode === keyCodes.tab) {
      rotateFocus(rootElement, e);
    }
  }

  function createHelpersDetectingTabDirection() {
    tabDetectionElement = document.createElement('div');
    tabDetectionElement.style.display = 'none';
    rootElement.insertBefore(tabDetectionElement, rootElement.children[0]);
  }

  function isForwardTabInWindow() {
    const compareMask = tabDetectionElement.compareDocumentPosition(
      /** @type {Element} */ (document.activeElement),
    );
    return compareMask === Node.DOCUMENT_POSITION_PRECEDING;
  }

  /**
   * @param {Object} [opts]
   * @param {boolean} [opts.resetToRoot]
   * @desc When we simulate a modal dialog, we need to restore the focus to the first or last
   * element of the rootElement
   */
  function setFocusInRootElement({ resetToRoot = false } = {}) {
    if (deepContains(rootElement, /** @type {HTMLElement} */ (getDeepActiveElement()))) {
      return;
    }

    let nextActive;
    if (resetToRoot) {
      nextActive = rootElement;
    } else {
      nextActive = focusableElements[isForwardTabInWindow() ? 0 : focusableElements.length - 1];
    }

    if (nextActive) {
      nextActive.focus();
    }
  }

  function handleFocusin() {
    window.removeEventListener('focusin', handleFocusin);
    setFocusInRootElement();
  }

  function handleFocusout() {
    /**
     * There is a moment in time between focusout and focusin (when focus shifts)
     * where the activeElement is reset to body first. So we use an async task to check
     * a little bit later for activeElement, so we don't get a false positive.
     *
     * We used to check for focusin event for this, however,
     * it can happen that focusout happens, but focusin never does, e.g. click outside but no focusable
     * element is found to focus. If this happens, we should take the focus back to the rootElement.
     */
    setTimeout(() => {
      if (!deepContains(rootElement, /** @type {HTMLElement} */ (getDeepActiveElement()))) {
        setFocusInRootElement({ resetToRoot: true });
      }
    });

    window.addEventListener('focusin', handleFocusin);
  }

  function disconnect() {
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('focusin', handleFocusin);
    window.removeEventListener('focusout', handleFocusout);
    rootElement.removeChild(tabDetectionElement);
    rootElement.style.removeProperty('outline');
  }

  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('focusout', handleFocusout);
  createHelpersDetectingTabDirection();

  return { disconnect };
}
