if (typeof window.KeyboardEvent !== 'function') {
  // e.g. is IE and needs "polyfill"
  const event = KeyboardEvent.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(event, 'key');
  if (descriptor) {
    const keys = {
      Win: 'Meta',
      Scroll: 'ScrollLock',
      Spacebar: ' ',

      Down: 'ArrowDown',
      Left: 'ArrowLeft',
      Right: 'ArrowRight',
      Up: 'ArrowUp',

      Del: 'Delete',
      Apps: 'ContextMenu',
      Esc: 'Escape',

      Multiply: '*',
      Add: '+',
      Subtract: '-',
      Decimal: '.',
      Divide: '/',
    };
    Object.defineProperty(event, 'key', {
      // eslint-disable-next-line object-shorthand, func-names
      get: function() {
        const key = descriptor.get.call(this);

        // eslint-disable-next-line no-prototype-builtins
        return keys.hasOwnProperty(key) ? keys[key] : key;
      },
    });
  }
}
