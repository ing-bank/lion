import { polyfill } from '@web/dev-server-polyfill';

export default {
  port: 8005,
  nodeResolve: true,
  appIndex: 'tests/index.html',
  open: true,
  plugins: [
    polyfill({
      scopedCustomElementRegistry: true,
    })
  ],
};
