/**
 * @param {CSSStyleDeclaration} styles
 */
const hasStyleVisibility = ({ visibility, display }) =>
  visibility !== 'hidden' && display !== 'none';

/**
 * @param {CSSStyleDeclaration} styles
 */
const isDisplayContents = ({ display }) => display === 'contents';

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

  const computedStyle = window.getComputedStyle(element);

  // Check computed styles
  // matches display: none, visibility: hidden on element and visibility: hidden from parent
  if (!hasStyleVisibility(computedStyle)) {
    return false;
  }

  // Allow element that delegates layout (i.e. display: contents)
  // matches display: contents
  if (isDisplayContents(computedStyle)) {
    return true;
  }

  // display: none is not inherited, so finally check if element has calculated width or height
  // matches display: none from parent
  return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}
