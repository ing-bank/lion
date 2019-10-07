/* eslint-disable */
import { LionOptions } from '@lion/select-rich/src/LionOptions.js';
import { FormRegistrarPortalMixin } from '../field/src/FormRegistrarPortalMixin.js';

export class LionAccountOptions extends FormRegistrarPortalMixin(LionOptions) {}

customElements.define('lion-account-options', LionAccountOptions);
