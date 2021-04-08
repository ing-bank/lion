/**
 * @typedef {import('@lion/form').LionForm} LionForm
 * @typedef {import('@lion/form-core').LionField} LionField
 */

/**
 * @param {LionForm} formGroupEl
 */
export function getAllFormElements(formGroupEl) {
  const getElms = (/** @type {HTMLElement} */ elm) => [
    elm,
    // @ts-ignore
    ...(elm.formElements ? elm.formElements.map(getElms).flat() : []),
  ];

  // @ts-ignore
  return formGroupEl.formElements.map(elem => getElms(elem)).flat();
}

/**
 * @param {LionForm} formGroupEl
 */
export function getAllTagNames(formGroupEl) {
  const getTagNames = (/** @type {HTMLElement} */ elm, lvl = 0) => [
    `  `.repeat(lvl) + elm.tagName.toLowerCase(),
    // @ts-ignore
    ...(elm.formElements ? elm.formElements.map(elem => getTagNames(elem, lvl + 1)).flat() : []),
  ];

  // @ts-ignore
  return formGroupEl.formElements.map(elem => getTagNames(elem)).flat();
}

/**
 * @param {LionForm} formGroupEl
 */
export function getAllFieldsAndFormGroups(formGroupEl) {
  const allElements = getAllFormElements(formGroupEl);
  return allElements.filter((/** @type {LionField} */ elm) => elm.tagName !== 'LION-OPTION');
}
