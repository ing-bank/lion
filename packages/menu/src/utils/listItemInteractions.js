/**
 * Set of universal interactive list item state methods that are both compatible with
 * 'smart' (LionOption) and 'regular' items
 */

/**
 * @param {HTMLElement|LionOption} item
 */
export function isDisabled(item) {
  return item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true';
}

/**
 * @param {HTMLElement|LionOption} item
 */
export function setDisabled(item, unset = false) {
  if (unset) {
    item.removeAttribute('disabled');
    item.setAttribute('aria-disabled', 'false');
  } else {
    item.setAttribute('disabled', '');
    item.setAttribute('aria-disabled', 'true');
  }
}

/**
 * @param {HTMLElement|LionOption} item
 */
export function toggleDisabled(item) {
  setDisabled(item, isDisabled(item));
}

/**
 * @param {HTMLElement|LionOption} item
 */
export function isChecked(item) {
  return item.hasAttribute('checked') || item.getAttribute('aria-selected') === 'true';
}

/**
 * @param {HTMLElement|LionOption} item
 */
export function setChecked(item, unset = false) {
  const ariaAttr = item.getAttribute('role') === 'option' ? 'selected' : 'checked';
  if (unset) {
    item.removeAttribute('checked');
    item.setAttribute(`aria-${ariaAttr}`, 'false');
  } else {
    item.setAttribute('checked', '');
    item.setAttribute(`aria-${ariaAttr}`, 'true');
  }
}

/**
 * @param {HTMLElement|LionOption} item
 */
export function toggleChecked(item) {
  setChecked(item, isChecked(item));
}

/**
 * @param {HTMLElement|LionOption} item
 */
export function isActive(item) {
  return item.hasAttribute('active');
}

/**
 * @param {HTMLElement|LionOption} item
 */
export function setActive(item, unset = false) {
  if (unset) {
    item.removeAttribute('active');
  } else {
    item.setAttribute('active', '');
  }
}

/**
 * @param {HTMLElement|LionOption} item
 */
export function getValue(item) {
  return (
    item.choiceValue ||
    item.value ||
    item.getAttribute('value') ||
    item.getAttribute('data-value') ||
    getDirectTextContent(item)
  );
}

function getDirectTextContent(item) {
  return Array.from(item.childNodes)
    .filter(n => n.nodeName === '#text')
    .map(n => n.textContent)
    .join('')
    .trim();
}
