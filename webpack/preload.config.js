const { merge } = require('webpack-merge');
const baseConfig = require('./base.config.js');

const plugins = [];

module.exports = merge(baseConfig, {
  entry: './src/desktop/preload/index.js',
  output: {
    filename: 'preload.bundle.js',
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

  target: 'electron-renderer',
});
