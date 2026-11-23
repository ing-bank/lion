import { LionDrawer } from '../src/LionDrawer.js';

declare global {
  interface HTMLElementTagNameMap {
    'lion-drawer': LionDrawer;
  }
}

export { LionDrawer };
