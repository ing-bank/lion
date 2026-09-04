import { LionInputTelDropdown } from '@lion/ui/input-tel-dropdown.js';

export type TelDropdownConfig = {
  getTelDropdownInvokerEl: (el: LionInputTelDropdown) => HTMLElement | null;
  selectNlOption: (el: LionInputTelDropdown) => Promise<void>;
};
