/**
 * Set of universal interactive list item state methods that are both compatible with
 * 'smart' (LionOption) and 'regular' items
 */

/**
<<<<<<< HEAD
 * @typedef {import('@lion/ui/checkbox-group.js').LionCheckboxIndeterminate} LionCheckboxIndeterminate
 */

/**
=======
>>>>>>> 292a1c22b (wip)
 * @param {HTMLElement} item
 */
export function isDisabled(item) {
  return item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true';
}

/**
 * @param {HTMLElement} item
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
 * @param {HTMLElement} item
 */
export function toggleDisabled(item) {
  setDisabled(item, isDisabled(item));
}

/**
 * @param {HTMLElement} item
 */
export function isChecked(item) {
<<<<<<< HEAD
  return item.hasAttribute('checked');
=======
  return item.hasAttribute('checked') || item.getAttribute('aria-selected') === 'true';
>>>>>>> 292a1c22b (wip)
}

/**
 * @param {HTMLElement} item
<<<<<<< HEAD
 * @param {Object} [options]
 * @param {boolean} [options.unset=false]
 * @param {'page'|'mixed'} [options.text] - optional text to set for aria-checked/aria-selected/aria-current (e.g. "mixed")
 */
export function setChecked(item, unset = false) {
  const role = item.getAttribute('role');
  let ariaAttr = 'current';
  if (role?.endsWith('checkbox') || role?.endsWith('radio')) {
    ariaAttr = 'checked';
  } else if (role === 'option' || role === 'treeitem') {
    ariaAttr = 'selected';
  }
  let text;
  if (/** @type {HTMLAnchorElement} */ (item).href) {
    text = 'page';
  }
  if (/** @type {LionCheckboxIndeterminate} */ (item).mixedState) {
    text = 'mixed';
  }
  if (!unset) {
    item.setAttribute('checked', '');
    item.setAttribute(`aria-${ariaAttr}`, text || 'true');
=======
 * @param {boolean} [shouldSet=false]
 */
export function setChecked(item, shouldSet = true) {
  const ariaAttr = item.getAttribute('role') === 'option' ? 'selected' : 'checked';
  if (shouldSet) {
    item.setAttribute('checked', '');
    item.setAttribute(`aria-${ariaAttr}`, 'true');
>>>>>>> 292a1c22b (wip)
  } else {
    item.removeAttribute('checked');
    item.setAttribute(`aria-${ariaAttr}`, 'false');
  }
}

/**
 * @param {HTMLElement} item
 */
export function toggleChecked(item) {
<<<<<<< HEAD
  const shouldUnset = isChecked(item);
  setChecked(item, shouldUnset);
=======
  setChecked(item, !isChecked(item));
>>>>>>> 292a1c22b (wip)
}

/**
 * @param {HTMLElement} item
 */
export function isActive(item) {
  return item.hasAttribute('active');
}

/**
 * @param {HTMLElement} item
 */
export function setActive(item, unset = false) {
  if (unset) {
    item.removeAttribute('active');
  } else {
    item.setAttribute('active', '');
  }
}

/**
 * @param {HTMLElement} item
 */
function getDirectTextContent(item) {
  return Array.from(item.childNodes)
    .filter(n => n.nodeName === '#text')
    .map(n => n.textContent)
    .join('')
    .trim();
}

/**
 * @param {HTMLElement} item
 */
export function getValue(item) {
  return (
    // @ts-ignore - choiceValue is a custom property
    item.choiceValue ||
    // @ts-ignore - value might not exist on all HTMLElements
    item.value ||
    item.getAttribute('value') ||
    item.getAttribute('data-value') ||
    getDirectTextContent(item)
  );
}
