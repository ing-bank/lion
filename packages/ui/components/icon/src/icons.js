import { singletonManager } from 'singleton-manager';
import { IconManager } from './IconManager.js';

export const icons = singletonManager.get('@lion/ui::icons::0.x') || new IconManager();
