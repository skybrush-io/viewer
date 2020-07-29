// Webpack configuration for the output that is directly usable on
// https://share.skybrush.io

const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { merge } = require('webpack-merge');

const baseConfig = require('./base.config.js');
const { getHtmlMetaTags, projectRoot } = require('./helpers');

module.exports = merge(baseConfig, {
  entry: {
    polyfill: ['@babel/polyfill', 'whatwg-fetch'],
    app: './src/index',
  },

  resolve: {
    alias: {
      config: path.resolve(projectRoot, 'config', 'webapp'),
    },
  },

  devServer: {
    // Fall back to serving index.html when the URL is not found
    historyApiFallback: true
  },

  plugins: [
    // Create index.html on-the-fly
    new HtmlWebpackPlugin({
      base: '/',    // to make the /s/ URLs work
      meta: getHtmlMetaTags({ disableCSP: true }),
      template: path.resolve(projectRoot, 'index.html'),
      title:
        'Skybrush Viewer | The Next-generation Drone Light Show Software Suite',
    }),
  ],
});
