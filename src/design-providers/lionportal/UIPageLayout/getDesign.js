import { html, nothing } from 'lit';
import style from './style.css.js';

export function getDesignForUIPageLayout() {
  return {
    styles: () => [style],
  };
}
