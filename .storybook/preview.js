import {
  addDecorator,
  addParameters,
  setCustomElements,
  withA11y,
} from '@open-wc/demoing-storybook';

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
      storySort: (options => (a, b) => {
        if (a[1].kind.includes('Intro|')) {
          return -1;
        } else if (a[1].kind.includes('|System')) {
          return -1;
        }
        return 1;
      })(),
    },
  });
}

run();
