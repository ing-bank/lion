import { createBasicConfig } from '@open-wc/building-rollup';
import { readdirSync } from 'fs';
import path from 'path';

const entrypoints = readdirSync(new URL('../packages/ui/exports', import.meta.url), {
  withFileTypes: true,
});
const entrypointNames = [];
for (const entry of entrypoints) {
  const { name } = entry;
  if (entry.isFile() && name.endsWith('.js') && !name.endsWith('-test-suites.js')) {
    entrypointNames.push(name);
  }
}

export default entrypointNames.map(name => {
  const config = createBasicConfig();

  return {
    ...config,
    input: path.resolve(`./packages/ui/exports/${name}`),
    treeshake: false,
    output: {
      ...config.output,
      dir: `bundlesize/dist/${name}`,
      sourcemap: false,
    },
  }
});
