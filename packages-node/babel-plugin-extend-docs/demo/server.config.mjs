import path from 'path';
import { fromRollup } from '@web/dev-server-rollup';
import rollupBabel from '@rollup/plugin-babel';

const extendDocsConfig = {
  changes: [
    {
      name: 'SourceCounter',
      variable: {
        from: 'SourceCounter',
        to: 'ExtensionCounter',
        paths: [
          { from: '#source/counter', to: '#extension/counter' },
        ],
      },
      tag: {
        from: 'source-counter',
        to: 'extension-counter',
        paths: [{ from: '#source/counter/define', to: '#extension/counter/define' }],
      },
    },
  ],
};

// note that you need to use `.default` for babel
const babel = fromRollup(rollupBabel.default);

export default {
  nodeResolve: true,
  watch: true,
  open: 'demo/',
  plugins: [
    babel({
      include: ['./demo/**/*.demo.js'],
      plugins: [[path.resolve('./'), extendDocsConfig]],
    }),
  ],
};
