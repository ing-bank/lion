import { AsyncDirective } from 'lit/async-directive.js';
import { UIBaseElement } from './UIBaseElement.js';

export class UIPartDirective extends AsyncDirective {
  host;

  constructor() {
    super();
    this._hasFirstUpdated = false;
  }

  setup() {}

  update(...args) {
    this.host = args[0].options.host;
    if (!this._hasFirstUpdated) {
      this.setup(...args);
    }
    this._hasFirstUpdated = true;
  }
}

export const createPartDirective = (ctor, context) => {
  return (...values) => ({
    // This property needs to remain unminified.
    ['_$litDirective$']: ctor,
    values: [context, ...values],
  });
};
