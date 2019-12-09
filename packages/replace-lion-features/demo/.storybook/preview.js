import {
  addParameters,
  addDecorator,
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
    docs: {
      iframeHeight: '200px',
    },
  });
}

run();
