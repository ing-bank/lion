import { LionSelectRich } from '../src/LionSelectRich.js';
import { LionSelectInvoker } from '../src/LionSelectInvoker.js';

declare global {
  interface HTMLElementTagNameMap {
    'lion-select-rich': LionSelectRich;
    'lion-select-invoker': LionSelectInvoker;
  }
}

export { LionSelectRich, LionSelectInvoker };
