import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    strictDeprecations: true,
    input: './index.js',
    output: {
      file: './build/index-esm.js',
      format: 'es',
      interop: 'auto',
      exports: 'named',
      esModule: true,
    },
    plugins: [commonjs()],
  },
];
