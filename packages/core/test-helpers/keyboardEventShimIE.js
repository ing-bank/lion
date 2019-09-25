if (typeof window.KeyboardEvent !== 'function') {
  // e.g. is IE and needs "polyfill"
  const KeyboardEvent = (event, _params) => {
    // current spec for it https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent
    const params = {
      bubbles: false,
      cancelable: false,
      view: document.defaultView,
      key: false,
      location: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
      repeat: false,
      ..._params,
    };
    const modifiersListArray = [];
    if (params.ctrlKey) {
      modifiersListArray.push('Control');
    }
    if (params.shiftKey) {
      modifiersListArray.push('Shift');
    }
    if (params.altKey) {
      modifiersListArray.push('Alt');
    }
    if (params.metaKey) {
      modifiersListArray.push('Meta');
    }

    const ev = document.createEvent('KeyboardEvent');
    // IE Spec for it https://technet.microsoft.com/en-us/windows/ff975297(v=vs.60)
    ev.initKeyboardEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.view,
      params.key,
      params.location,
      modifiersListArray.join(' '),
      params.repeat ? 1 : 0,
      params.locale,
    );
    return ev;
  };
  KeyboardEvent.prototype = window.Event.prototype;
  window.KeyboardEvent = KeyboardEvent;
}
