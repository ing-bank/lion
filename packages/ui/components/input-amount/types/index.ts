import { LionInputAmount } from '../src/LionInputAmount.js';

declare global {
  interface HTMLElementTagNameMap {
    'lion-input-amount': LionInputAmount;
  }
}

export { LionInputAmount };
export * from '../src/formatters.js';
export * from '../src/parsers.js';
export * from '../src/preprocessors.js';
