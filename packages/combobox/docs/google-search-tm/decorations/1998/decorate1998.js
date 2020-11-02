// https://web.archive.org/web/19981202230410/http://www.google.com/

import { html } from '@lion/core';
import { renderLitAsNode } from '@lion/helpers';
import styles1998 from './1998.css.js';

const googleSearchLogoUrl = new URL('../../assets/google_logo_1998.jpg', import.meta.url).href;

export const googleSearch1998 = {
  staticMembers: {
    styles: ({ superMember: superStyles }) => [superStyles, styles1998],
  },
  members: {
    _groupTwoTemplate: ({ superMember }) => (...args) =>
      html`<div class="google-search__above">Search the web using Google!</div>
        ${superMember(...args)}`,
    slots: ({ superMember: superSlots }) => ({
      ...superSlots,
      label: () => renderLitAsNode(html` <img alt="Google Search" src="${googleSearchLogoUrl}" />`),
    }),
  },
};
