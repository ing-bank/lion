import { AsyncDirective } from 'lit/async-directive.js';

export class UIPartDirective extends AsyncDirective {
  host;

  constructor() {
    super();
    this._hasAlreadySetup = false;
  }

  setup() {}

  update(...args) {
    this.host = args[0].options.host;
    if (!this._hasAlreadySetup) {
      this.setup(...args);
    }
    this._hasAlreadySetup = true;
  }
}

export const createPartDirective = (ctor, context) => {
  return (...values) => ({
    // This property needs to remain unminified.
    ['_$litDirective$']: ctor,
    values: [context, ...values],
  });
};
