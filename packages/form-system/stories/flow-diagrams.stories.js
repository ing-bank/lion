import { html } from '@open-wc/demoing-storybook';

export default {
  title: 'Forms/System/_internals',
};

export const standardFlow = () => html`
  <img src=${new URL('../dev-assets/FormatMixinDiagram-1.svg', import.meta.url)} />
`;

export const unparseableFlow = () => html`
  <img src=${new URL('../dev-assets/FormatMixinDiagram-2.svg', import.meta.url)} />
`;

export const imperativeFlow = () => html`
  <img src=${new URL('../dev-assets/FormatMixinDiagram-3.svg', import.meta.url)} />
`;
