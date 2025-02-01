// filepath: /code/github.com/zinefer/drawing-bookmarklet/rollup.config.js
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bookmarklet.js',
    format: 'iife',
    name: 'Bookmarklet',
    plugins: [terser()]
  },
  plugins: [typescript()]
};