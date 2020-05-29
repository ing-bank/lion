// TODO: this method has to be removed when EventTarget polyfill is available on IE11
// TODO: move to core and apply everywhere?
// TODO: pascalCase this filename?
export function fakeExtendsEventTarget(instance) {
  const delegate = document.createDocumentFragment();
  ['addEventListener', 'dispatchEvent', 'removeEventListener'].forEach(funcName => {
    // eslint-disable-next-line no-param-reassign
    instance[funcName] = (...args) => delegate[funcName](...args);
  });
}
