import { html } from '@open-wc/demoing-storybook';
import '../lion-icon.js';

export default {
  title: 'Icon System/Extras',
};

export const dynamicIcon = () => html`
  <lion-icon
    .svg=${import('./icons/bugs/bug05.svg.js')}
    aria-label="Skinny dung beatle"
  ></lion-icon>
`;
