// Webpack configuration for the output that is directly usable on
// https://share.skybrush.io

const path = require('node:path');
const process = require('node:process');

const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const baseConfig = require('./base.config.js');
const { getHtmlMetaTags, projectRoot } = require('./helpers');

module.exports = merge(baseConfig, {
  // Make sure to use a _single_ entry point here; we want a single bundle.js
  // in the browser-based deployment for sake of simplicity
  entry: ['whatwg-fetch', './src/index'],
  output: {
    filename: 'bundle.js',
    publicPath: '/build/',
  },

  resolve: {
    alias: {
      config: path.resolve(
        projectRoot,
        'config',
        process.env.SKYBRUSH_VARIANT ?? 'webapp'
      ),
    },
  },

  plugins: [
    // process and Buffer polyfills are needed for AFrame to work nicely as of
    // 1.1.0
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),

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
