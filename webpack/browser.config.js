// Webpack configuration for the output that is directly usable on
// https://share.skybrush.io

const path = require('node:path');
const process = require('node:process');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const baseConfig = require('./base.config.js');
const {
  getHtmlMetaTags,
  useAppConfiguration,
  useHotModuleReloading,
  projectRoot,
} = require('./helpers');

const optimization = {};
const plugins = [
  // process and Buffer polyfills are needed for AFrame to work nicely as of
  // 1.1.0
  new webpack.ProvidePlugin({
    Buffer: ['buffer', 'Buffer'],
    process: 'process/browser',
  }),

  // Ignore chart.js -- not needed in the browser because we do not provide
  // the validation UI there
  new webpack.IgnorePlugin({ resourceRegExp: /chart\.?js/ }),

  // Create index.html on-the-fly
  new HtmlWebpackPlugin({
    base: '/', // to make the /s/ URLs work
    meta: getHtmlMetaTags({ disableCSP: true }),
    template: path.resolve(projectRoot, 'index.html'),
    title:
      'Skybrush Viewer | The Next-generation Drone Light Show Software Suite',
  }),
];

if (useHotModuleReloading) {
  plugins.push(new ReactRefreshWebpackPlugin());

  optimization.runtimeChunk = 'single'; // hot module reloading needs this
}

module.exports = merge(baseConfig, {
  entry: {
    polyfill: ['whatwg-fetch'],
    app: './src/index',
  },

  ...useAppConfiguration(process.env.SKYBRUSH_VARIANT ?? 'webapp'),

  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },

  devServer: {
    // Fall back to serving index.html when the URL is not found
    historyApiFallback: true,
  },

  optimization,
  plugins,
});
