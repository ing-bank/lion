/* eslint-disable no-param-reassign, func-names */
/**
 * @typedef {import('./ModifierInterface.js').ModifierInterface} ModifierInterface
 * @typedef {import('./ModifierInterface.js').Constructor<HTMLElement> & {getModifierInterface?: () => ModifierInterface; __modifierInterface?: ModifierInterface}} Constructor
 */

/**
 * @param {string[]} arr
 */
function dedupeStringArr(arr) {
  return Array.from(new Set(arr));
}

/**
 * @typedef {<T>(arr:T[]) => T[]} DedupeObjArrByKey
 *
 * @type {DedupeObjArrByKey}
 */
function dedupeObjArrByKey(arr, key = 'name') {
  // @ts-ignore
  const dedupedArr = [];
  for (const obj of arr.reverse()) {
    // @ts-ignore
    if (!dedupedArr.find(dedupedObj => dedupedObj[key] === obj[key])) {
      dedupedArr.push(obj);
    }
  }
  return dedupedArr.reverse();
}

/**
 * @param {ModifierInterface} modifierInterface
 * @param {Constructor} ctor
 */
export function defineModifierInterfaceOnConstructor(modifierInterface, ctor) {
  // ctor.__modifierInterface = modifierInterface;

  ctor.getModifierInterface = function () {
    const superCtor = Object.getPrototypeOf(this);
    const superModifierInterface = superCtor.getModifierInterface?.() || {};

    return {
      designDefinitions: {
        variants: dedupeObjArrByKey([
          ...(superModifierInterface.designDefinitions?.variants || []),
          ...(modifierInterface?.designDefinitions?.variants || []),
        ]),
        states: dedupeStringArr([
          ...(superModifierInterface.designDefinitions?.states || []),
          ...(modifierInterface?.designDefinitions?.states || []),
        ]),
      },
      mapToCode: dedupeObjArrByKey([
        ...(superModifierInterface.mapToCode || []),
        ...(modifierInterface?.mapToCode || []),
      ]),
    };
  };
}
