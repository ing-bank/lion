import { sortEachDepth } from '../packages/helpers/index.js';

export const parameters = {
  layout: 'centered',
  docs: {
    iframeHeight: '200px',
  },
  // TODO: a11y addon is not included atm in @web/storybook-prebuilt because it only
  // has @storybook/addon-essential atm. Could add this later, but keep in mind axe is huge, and not lazy loaded..
  // a11y: {
  //   config: {},
  //   options: {
  //     checks: { 'color-contrast': { options: { noScroll: true } } },
  //     restoreScroll: true,
  //   },
  // },
  actions: { disabled: true },
  controls: { disabled: true },
  options: {
    showPanel: false, // we have no addons enabled atm
    showRoots: true,
    storySort: sortEachDepth([
      ['Intro', 'Forms', 'Buttons', 'Overlays', 'Navigation', 'Localize', 'Icons', 'Others', '...'],
      ['Intro', 'Features Overview', '...', 'Validation', 'System'],
      ['Overview', '...', '_internals'],
    ]),
  },
};
