// Webpack configuration for the output that is directly usable on
// https://share.skybrush.io

const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { merge } = require('webpack-merge');

const baseConfig = require('./base.config.js');
const { getHtmlMetaTags, projectRoot } = require('./helpers');

module.exports = merge(baseConfig, {
  // Make sure to use a _single_ entry point here; we want a single bundle.js
  // in the browser-based deployment for sake of simplicity
  entry: ['@babel/polyfill', 'whatwg-fetch', './src/index'],
  output: {
    filename: 'bundle.js',
    publicPath: '/build/',
  },

  resolve: {
    alias: {
      config: path.resolve(projectRoot, 'config', 'webapp'),
    },
  },

  plugins: [
    // Create index.html on-the-fly
    new HtmlWebpackPlugin({
      meta: getHtmlMetaTags(),
      template: path.resolve(projectRoot, 'index.html'),
      title:
        'Skybrush Viewer | The Next-generation Drone Light Show Software Suite',
    }),

    // Compress assets so we can serve them faster from Nginx
    new CompressionPlugin(),
  ],
});
