export function fakeExtendsEventTarget(instance) {
  const delegate = document.createDocumentFragment();
  ['addEventListener', 'dispatchEvent', 'removeEventListener'].forEach(funcName => {
    instance[funcName] = (...args) => delegate[funcName](...args); // eslint-disable-line
  });
}
