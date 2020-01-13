import {
  addDecorator,
  addParameters,
  setCustomElements,
  withA11y,
} from '@open-wc/demoing-storybook';
import { sortEachDepth } from '../packages/helpers/index.js';

async function run() {
  // const customElements = await (
  //   await fetch(new URL('../custom-elements.json', import.meta.url))
  // ).json();
  setCustomElements({});

  addDecorator(withA11y);

  addParameters({
    a11y: {
      config: {},
      options: {
        checks: { 'color-contrast': { options: { noScroll: true } } },
        restoreScroll: true,
      },
    },
    docs: {
      iframeHeight: '200px',
    },
    options: {
      showRoots: true,
      storySort: sortEachDepth([
        ['Intro', 'Forms', 'Buttons', 'Overlays', 'Navigation', 'Localize', 'Icons', '...'],
        ['Intro', 'Features Overview', '...', 'System'],
        ['Overview', '...', '_internals'],
      ]),
    },
  });
}

run();
