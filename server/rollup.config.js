import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/server.js',
  output: {
    file: 'dist/server.js',
    format: 'esm',  // Output as ES module
    sourcemap: true,
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env'],
    }),
  ],
  external: [
    'cors',
    'express',
    'multer',
    'node-fetch',
    'sharp',
  ],
};
