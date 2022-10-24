import { LionInput } from '@lion/components/input.js';
import { MdFieldMixin } from './MdFieldMixin.js';

export class MdInput extends MdFieldMixin(LionInput) {}
customElements.define('md-input', MdInput);
