import { LionListbox } from '../src/LionListbox.js';
import { LionOption } from '../src/LionOption.js';
import { LionOptions } from '../src/LionOptions.js';

declare global {
  interface HTMLElementTagNameMap {
    'lion-listbox': LionListbox;
    'lion-option': LionOption;
    'lion-options': LionOptions;
  }
}

export * from './LionOption.js';
export * from './ListboxMixinTypes.js';
export { LionListbox, LionOption, LionOptions };
