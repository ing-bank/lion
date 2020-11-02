// https://web.archive.org/web/20000229040250/http://www.google.com/

import { html } from '@lion/core';
import { renderLitAsNode } from '@lion/helpers';
import styles2000 from './2000.css.js';

const googleSearchLogoUrl = new URL('../../assets/google_logo_2000.gif', import.meta.url).href;

export const googleSearch2000 = {
  staticMembers: {
    styles: ({ superMember: superStyles }) => [superStyles, styles2000],
  },
  members: {
    _groupTwoTemplate: ({ superMember }) => (...args) =>
      html`<div class="google-search__above">Search the web using Google</div>
        ${superMember(...args)}`,
    slots: ({ superMember: superSlots }) => ({
      ...superSlots,
      label: () => renderLitAsNode(html` <img alt="Google Search" src="${googleSearchLogoUrl}" />`),
    }),
  },
};
