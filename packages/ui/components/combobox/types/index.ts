import { LionCombobox } from '../src/LionCombobox.js';

declare global {
  interface HTMLElementTagNameMap {
    'lion-combobox': LionCombobox;
  }
}

export * from './SelectionDisplay.js';
export { LionCombobox };
