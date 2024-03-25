const path = require('node:path');
const process = require('node:process');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const { productName } = require('../package.json');

const baseConfig = require('./base.config.js');
const { getHtmlMetaTags, projectRoot } = require('./helpers');

const htmlWebPackPluginConfiguration = {
  meta: getHtmlMetaTags(),
  template: path.resolve(projectRoot, 'index.html'),
  title: productName,
};

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
if (process.env.NODE_ENV !== 'production' && process.env.DEPLOYMENT !== '1') {
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
}

module.exports = merge(baseConfig, {
  entry: {
    app: ['./src/index'],
  },
  devServer: {
    server: 'https',
  },
  plugins,
});
