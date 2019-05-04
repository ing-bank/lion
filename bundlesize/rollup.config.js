import createDefaultConfig from '@open-wc/building-rollup/modern-config';

export default ['core', 'all'].map(name => {
  const config = createDefaultConfig({
    input: `bundlesize/${name}.js`,
  });

  return {
    ...config,
    treeshake: false,
    output: {
      ...config.output,
      dir: `bundlesize/dist/${name}`,
      sourcemap: false,
    },
  }
});
