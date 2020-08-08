import { directive } from '@lion/core';

const cache = new WeakMap();

/**
 * @desc 2way binding
 *
 * @example
 * ```js
 * const myModel = {
 *  myAmount: 1234.56,
 *  fields: {
 *   emailAddress: 'a@b.c',
 *  },
 * };
 * ```
 * ```html
 * <lion-input-amount name="myAmount" :=${model(myModel)}></lion-input-amount>
 * <lion-fieldset name="fields">
 *   <lion-input-email name="myEmail" :=${model(myModel.fields, 'emailAddress')}></lion-input-email>
 * </lion-fieldset>
 *```
 * ```html
 * <lion-form :=${model(myModel)}>
 *   <lion-input-amount name="myAmount"></lion-input-amount>
 *   <lion-fieldset name="fields">
 *     <lion-input-email name="emailAddress"></lion-input-email>
 *   </lion-fieldset>
 * </lion-form>
 *```
 * @param {object} modelObj will be used to store reference to attribute names like #myElement
 */
export const model = directive((modelObj, objKey) => part => {
  // Enforce consistency throughout code base
  if (part.committer.name !== ':') {
    // eslint-disable-next-line no-template-curly-in-string
    throw new Error('Please use the model directive like <my-input :=${model(myModel)}>');
  }

  const { element } = part.committer;
  const key = objKey || element.name;
  let isForm;

  if (!cache.has(element)) {
    // TODO: make this contract less fuzzy, but without requiring LionForm as a dependency
    isForm = !element.name || !element.role;
    cache.set(element, isForm);

    // [1] Upwards sync: form to model
    element.addEventListener('model-value-changed', ev => {
      const { formPath } = ev.detail;
      // [1a] ModelValue of currentTarget changed
      if (formPath[0] === element) {
        if (!isForm) {
          // eslint-disable-next-line no-param-reassign
          modelObj[key] = element.modelValue;
        }
      }
      // [1b] ModelValue of a child changed
      else {
        let objLvl = modelObj;
        const path = formPath.slice(0, -1).reverse();
        path.forEach((el, i) => {
          if (i !== path.length - 1) {
            objLvl = objLvl[el.name];
            return;
          }
          objLvl[el.name] = el.modelValue;
        });
      }
      // TODO: alternatively (other directive?) connect to Redux store
    });
  }
  isForm = cache.get(element);

  // [2] Downwards sync: model to form
  if (isForm) {
    element.modelValue = modelObj;
  } else {
    element.modelValue = modelObj[key];
  }
});
