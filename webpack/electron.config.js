const path = require('node:path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const { productName } = require('../package.json');

const baseConfig = require('./base.config.js');
const {
  getHtmlMetaTags,
  projectRoot,
  useHotModuleReloading,
} = require('./helpers');

const htmlWebPackPluginConfiguration = {
  meta: getHtmlMetaTags(),
  template: path.resolve(projectRoot, 'index.html'),
  title: productName,
};

const optimization = {};

/** @type {Array<import("webpack").Plugin>} */
const plugins = [
  // process and Buffer polyfills are needed for AFrame to work nicely as of
  // 1.1.0
  new webpack.ProvidePlugin({
    Buffer: ['buffer', 'Buffer'],
    process: 'process/browser',
  }),

  // Create index.html on-the-fly
  new HtmlWebpackPlugin(htmlWebPackPluginConfiguration),
];

/* In dev mode, also run Electron and let it load the live bundle */
if (useHotModuleReloading) {
  plugins.push(
    new WebpackShellPluginNext({
      onBuildEnd: {
        scripts: ['electron launcher.mjs'],
        blocking: false,
        dev: true,
        parallel: true,
      },
    })
  );

  // Enable hot reload support in dev mode
  plugins.push(new ReactRefreshWebpackPlugin());

  optimization.runtimeChunk = 'single'; // hot module reloading needs this
}

module.exports = merge(baseConfig, {
  entry: {
    app: ['./src/index'],
  },
  devServer: {
    server: 'https',
  },
  plugins,
  optimization,
});
