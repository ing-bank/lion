import { LionCombobox } from '../src/LionCombobox.js';

export interface SelectionDisplay extends HTMLElement {
  comboboxElement: LionCombobox;
  onComboboxElementUpdated: Function;
}
