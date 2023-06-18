// Webpack configuration for the output that is directly usable on
// https://share.skybrush.io

const path = require('node:path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const baseConfig = require('./base.config.js');
const { getHtmlMetaTags, projectRoot } = require('./helpers');

module.exports = merge(baseConfig, {
  entry: {
    polyfill: ['whatwg-fetch'],
    app: './src/index',
  },

  resolve: {
    alias: {
      config: path.resolve(projectRoot, 'config', 'webapp'),
    },
  },

  devServer: {
    // Fall back to serving index.html when the URL is not found
    historyApiFallback: true,
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
      base: '/', // to make the /s/ URLs work
      meta: getHtmlMetaTags({ disableCSP: true }),
      template: path.resolve(projectRoot, 'index.html'),
      title:
        'Skybrush Viewer | The Next-generation Drone Light Show Software Suite',
    }),
  ],
});
