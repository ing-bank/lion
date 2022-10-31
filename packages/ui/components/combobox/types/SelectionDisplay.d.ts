import { LionCombobox } from '../src/LionCombobox.js.js';

export interface SelectionDisplay extends HTMLElement {
  comboboxElement: LionCombobox;
  onComboboxElementUpdated: Function;
}
