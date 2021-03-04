import { storybookPlugin } from '@web/dev-server-storybook';

export default {
  open: true,
  watch: true,
  nodeResolve: true,
  logStartMessage: false,
  plugins: [storybookPlugin({ type: 'web-components' })],
};
