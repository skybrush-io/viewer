const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./base.config.js');

const plugins = [
    new webpack.DefinePlugin({
        // work around a misbehaving debug() module that tries to assign to
        // process.env.DEBUG. Also needs a global variable named
        // __runtime_process_env
        'process.env.DEBUG': '__runtime_process_env.DEBUG'
    })
];

module.exports = merge(baseConfig, {
  entry: ['@babel/polyfill', './launcher.js'],
  output: {
    filename: 'launcher.bundle.js',
  },

  node: {
    __dirname: false,
    __filename: false,
  },

  plugins,
  target: 'electron-main',
});
