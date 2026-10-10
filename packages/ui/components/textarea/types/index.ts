import { LionTextarea } from '../src/LionTextarea.js';

declare global {
  interface HTMLElementTagNameMap {
    'lion-textarea': LionTextarea;
  }
}

export { LionTextarea };
