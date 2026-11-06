import { LionForm } from '../src/LionForm.js';

declare global {
  interface HTMLElementTagNameMap {
    'lion-form': LionForm;
  }
}

export { LionForm };
