const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./base.config.js');

const plugins = [
  new webpack.DefinePlugin({
    // work around a misbehaving debug() module that tries to assign to
    // process.env.DEBUG. Also needs a global variable named
    // __runtime_process_env
    'process.env.DEBUG': '__runtime_process_env.DEBUG',
  }),
];

module.exports = merge(baseConfig, {
  entry: './launcher.mjs',
  output: {
    filename: 'launcher.bundle.js',
  },

  /* prevent evaluation of import.meta.url at build time in launcher and
   * preloader */
  module: {
    parser: {
      javascript: {
        importMeta: false
      }
    }
  },

  plugins,
  target: 'electron-main',
});
