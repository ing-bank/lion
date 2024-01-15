import { html, nothing } from 'lit';
import style from './style.css.js';
import { sharedGlobalStyle, visibilityStyle } from '../../../components/shared/styles.js';

export function getDesignForUIPortalCard() {
  return {
    styles: () => [sharedGlobalStyle, visibilityStyle, style],
  };
}
