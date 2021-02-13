import { LionInput } from '@lion/input';
import { MdFieldMixin } from './MdFieldMixin.js';

export class MdInput extends MdFieldMixin(LionInput) {}
customElements.define('md-input', MdInput);
