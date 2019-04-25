/**
 * @param {CSSStyleDeclaration} styles
 */
const hasStyleVisibility = ({ visibility, display }) =>
  visibility !== 'hidden' && display !== 'none';

/**
 * @param {HTMLElement} element
 * @returns {boolean} Whether the element is visible
 */
export function isVisible(element) {
  if (!element) {
    return false;
  }

  // Check if element is connected to the DOM
  if (!element.isConnected) {
    return false;
  }

  // Check inline styles to avoid a reflow
  // matches display: none, visibility: hidden on element
  if (!hasStyleVisibility(element.style)) {
    return false;
  }

  // Check computed styles
  // matches display: none, visbility: hidden on element and visibility: hidden from parent
  if (!hasStyleVisibility(window.getComputedStyle(element))) {
    return false;
  }

  // display: none is not inherited, so finally check if element has calculated width or height
  // matches display: none from parent
  return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}
