import nodeResolve from '@rollup/plugin-node-resolve';
import commonJS from '@rollup/plugin-commonjs';

export default {
  input: 'dist/esm/index.js',
  output: {
    file: 'dist/umd/index.js',
    format: 'umd',
    name: 'HyperlinkMiddleware',
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    commonJS({
      include: 'node_modules/**',
    }),
  ],
};
