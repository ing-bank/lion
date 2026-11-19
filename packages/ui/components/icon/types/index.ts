import { LionIcon, TemplateResult, TagFunction } from '../src/LionIcon.js';
import { IconManager } from '../src/IconManager.js';
import { icons } from '../src/icons.js';

declare global {
  interface HTMLElementTagNameMap {
    'lion-icon': LionIcon;
  }
}

export { LionIcon, TemplateResult, TagFunction, IconManager, icons };
