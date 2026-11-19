import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [
  {
    input: './node_modules/message-format/index.js',
    output: {
      file: './MessageFormat.js',
      format: 'es',
    },
    plugins: [
      nodeResolve(),
      commonjs(),
    ],
  },
];
