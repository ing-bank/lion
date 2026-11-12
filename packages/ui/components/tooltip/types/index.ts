import { LionTooltip } from '../src/LionTooltip.js';

declare global {
  interface HTMLElementTagNameMap {
    'lion-tooltip': LionTooltip;
  }
}

export { LionTooltip };
