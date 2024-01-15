import { html } from 'lit';
import style from './style.css.js';
import { sharedGlobalStyle, visibilityStyle } from '../../../components/shared/styles.js';

export function getDesignForUIPortalFooterContent() {
  return {
    styles: () => [sharedGlobalStyle, visibilityStyle, style],
  };
}
