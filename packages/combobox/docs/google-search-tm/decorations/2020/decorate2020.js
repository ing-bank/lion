import { html } from '@lion/core';
import { renderLitAsNode } from '@lion/helpers';
import googleVoiceSearchIcon from '../../assets/google-voice-search-icon.js';
import googleSearchIcon from '../../assets/google-search-icon.js';
import googleClearIcon from '../../assets/google-clear-icon.js';
import styles2020 from './2020.css.js';

const googleSearchLogoUrl = new URL('../../assets/googlelogo_color_272x92dp.png', import.meta.url)
  .href;

export const googleSearch2020 = {
  staticMembers: {
    styles: ({ superMember: superStyles }) => [superStyles, styles2020],
  },
  members: {
    slots: ({ superMember: superSlots, self }) => ({
      ...superSlots,
      label: () => renderLitAsNode(html` <img alt="Google Search" src="${googleSearchLogoUrl}" />`),
      prefix: () => renderLitAsNode(html` <span>${googleSearchIcon}</span> `),
      suffix: () =>
        renderLitAsNode(
          html` <button aria-label="Search by voice">${googleVoiceSearchIcon}</button> `,
        ),
      'clear-btn': () =>
        renderLitAsNode(
          html`
            <button @click="${self.__clearText}" aria-label="Clear text">${googleClearIcon}</button>
          `,
        ),
    }),
  },
};
