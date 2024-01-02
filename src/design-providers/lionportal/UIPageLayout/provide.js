import { html, nothing } from 'lit';
import { designManager } from '../../../components/shared/designManager.js';
import { LionIcon } from '@lion/ui/icon.js';
import styles from './styles.css.js';
import { UIPageLayout } from '../../../components/UIPageLayout/UIPageLayout.js';

export function provideDesignForUIPageLayout() {
  // designManager.registerDesignFor('UIPageLayout', {
  UIPageLayout.provideDesign({
    styles: () => styles,
  });
}
