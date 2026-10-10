import { LionDialog } from '../src/LionDialog.js';

declare global {
  interface HTMLElementTagNameMap {
    'lion-dialog': LionDialog;
  }
}

export { LionDialog };
