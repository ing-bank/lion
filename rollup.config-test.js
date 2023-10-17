import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  plugins: [
    commonjs(), // <-- this handles some parsing of js syntax or something (necessary for `export { init } from "mathjax";`)
    nodeResolve(), // <-- this allows npm modules to be added to bundle
  ],
};
