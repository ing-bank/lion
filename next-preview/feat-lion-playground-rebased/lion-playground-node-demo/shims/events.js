/**
 * `events` — a plain EventEmitter. Many Node tools are built on one, and it needs no platform
 * feature at all, so this is a faithful implementation rather than a shim in the lossy sense.
 */

export class EventEmitter {
  /** @param {boolean} [captureRejections] */
  constructor(captureRejections = false) {
    /** @type {Map<string, Function[]>} */
    this._listeners = new Map();
    this._maxListeners = 10;
    this._captureRejections = captureRejections;
  }

  /**
   * @param {string} event
   * @param {Function} handler
   * @returns {this}
   */
  on(event, handler) {
    const handlers = this._listeners.get(event) || [];
    handlers.push(handler);
    this._listeners.set(event, handlers);
    return this;
  }

  /**
   * @param {string} event
   * @param {Function} handler
   * @returns {this}
   */
  addListener(event, handler) {
    return this.on(event, handler);
  }

  /**
   * @param {string} event
   * @param {Function} handler
   * @returns {this}
   */
  once(event, handler) {
    const wrapper = (...args) => {
      this.removeListener(event, wrapper);
      handler(...args);
    };
    wrapper.listener = handler;
    return this.on(event, wrapper);
  }

  /**
   * @param {string} event
   * @param {Function} handler
   * @returns {this}
   */
  prependListener(event, handler) {
    const handlers = this._listeners.get(event) || [];
    handlers.unshift(handler);
    this._listeners.set(event, handlers);
    return this;
  }

  /**
   * @param {string} event
   * @param {Function} handler
   * @returns {this}
   */
  removeListener(event, handler) {
    const handlers = this._listeners.get(event) || [];
    const index = handlers.findIndex(entry => entry === handler || entry.listener === handler);
    if (index !== -1) handlers.splice(index, 1);
    return this;
  }

  /**
   * @param {string} [event] omit to drop every listener
   * @returns {this}
   */
  removeAllListeners(event) {
    if (event === undefined) this._listeners.clear();
    else this._listeners.delete(event);
    return this;
  }

  /**
   * @param {string} event
   * @param {...unknown} args
   * @returns {boolean}
   */
  emit(event, ...args) {
    const handlers = this._listeners.get(event);
    const isError = event === 'error';
    if (!handlers || handlers.length === 0) {
      if (isError) throw args[0] instanceof Error ? args[0] : new Error(String(args[0]));
      return false;
    }
    for (const handler of [...handlers]) handler(...args);
    return true;
  }

  /**
   * @param {string} event
   * @param {Function} handler
   * @returns {this}
   */
  off(event, handler) {
    return this.removeListener(event, handler);
  }

  /** @returns {string[]} */
  eventNames() {
    return [...this._listeners.keys()];
  }

  /** @param {string} event @returns {Function[]} */
  listeners(event) {
    return [...(this._listeners.get(event) || [])];
  }

  /**
   * @param {string} event
   * @returns {number}
   */
  listenerCount(event) {
    return (this._listeners.get(event) || []).length;
  }

  /** @param {number} count @returns {this} */
  setMaxListeners(count) {
    this._maxListeners = count;
    return this;
  }

  /** @returns {number} */
  getMaxListeners() {
    return this._maxListeners;
  }
}

/**
 * @param {EventEmitter} emitter
 * @param {string} event
 * @returns {Promise<unknown[]>}
 */
export function once(emitter, event) {
  return new Promise(resolve => emitter.once(event, (...args) => resolve(args)));
}

export const captureRejectionSymbol = Symbol.for('nodejs.rejection');
export const defaultMaxListeners = 10;

/** @param {EventEmitter} emitter @param {number} count */
export function setMaxListeners(count, ...emitters) {
  for (const emitter of emitters) emitter.setMaxListeners(count);
}

export default { EventEmitter, once, on: once, captureRejectionSymbol, defaultMaxListeners, setMaxListeners };
