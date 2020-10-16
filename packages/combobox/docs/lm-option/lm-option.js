import { LionOption } from '@lion/listbox';
import { LinkMixin } from '../LinkMixin.js';

export class LmOption extends LinkMixin(LionOption) {}

customElements.define('lm-option', LmOption);
