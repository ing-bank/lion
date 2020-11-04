import { createBasicConfig } from '@open-wc/building-rollup';

export default ['core', 'all'].map(name => {
  const config = createBasicConfig();

  return {
    ...config,
    input: `bundlesize/${name}.js`,
    treeshake: false,
    output: {
      ...config.output,
      dir: `bundlesize/dist/${name}`,
      sourcemap: false,
    },
  }
});
