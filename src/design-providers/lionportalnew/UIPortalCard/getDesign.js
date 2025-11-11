import { html } from 'lit';
import style from './style.css.js';
import { sharedGlobalStyle, visibilityStyle } from '../../../components/shared/styles.js';

export function getDesignForUIPortalCard() {
  return {
    styles: () => [sharedGlobalStyle, visibilityStyle, style],
    templateContextProcessor: templateContext => {
      return {
        ...templateContext,
        data: {
          ...templateContext.data,
          // trigger image rendering for placeholder
          imageUrl: '#',
        },
      };
    },
  };
}
