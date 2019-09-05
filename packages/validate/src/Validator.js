
export class Validator extends EventTarget {
  constructor(param, config) {
    super();
    this.name = null;
    this.async = false;
    this.param = param;
    this.config = config;
    if (config && config.message) {
      this.message = config.message;
    }
  }

  /**
   * @desc The function that returns a Boolean
   * @param {string|Date|Number|object} modelValue
   * @param {object} param
   */
  execute(modelValue, param) { // eslint-disable-line no-unused-vars

  }

  set param(p) {
    this.__param = p;
    this.dispatchEvent(new Event('param-changed'));
  }

  get param() {
    return this.__param;
  }

  set config(c) {
    this.__config = c;
    this.dispatchEvent(new Event('config-changed'));
  }

  get config() {
    return this.__config;
  }

  /**
   * @param {Promise|string}
   */
  set message(messagePromiseOrString) {
    if (messagePromiseOrString.then) {
      messagePromiseOrString.then((m) => {
        this.__changeMessage(m);
      });
    }
    this.__changeMessage(messagePromiseOrString);
  }

  __changeMessage(m) {
    this.__message = m;
    this.dispatchEvent(new Event('message-changed'));
  }

  get message() {
    return this.__message;
  }
}
