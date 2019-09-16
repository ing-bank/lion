function isIE() {
  return navigator.userAgent.indexOf("MSIE ") > -1 || navigator.userAgent.indexOf("Trident/") > -1;
}
function isEdge() {
  return /Edge/.test(navigator.userAgent);
}

if(isIE() || isEdge()) {
  const delegate = document.createDocumentFragment();

  // Patch the prototype of EventTarget...

  EventTarget.prototype.addEventListener = function addEventListener(...args) {
    delegate.addEventListener(...args);
  }

  EventTarget.prototype.removeEventListener = function removeEventListener(...args) {
    delegate.removeEventListener(...args);
  }

  EventTarget.prototype.dispatchEvent = function dispatchEvent(...args) {
    delegate.dispatchEvent(...args);
  }
}
