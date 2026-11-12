import { LionInputIban } from '../src/LionInputIban.js';

declare global {
  interface HTMLElementTagNameMap {
    'lion-input-iban': LionInputIban;
  }
}

export { LionInputIban };
export * from '../src/formatters.js';
export * from '../src/parsers.js';
export * from '../src/validators.js';
