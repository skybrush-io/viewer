const path = require('node:path');
const process = require('node:process');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const { outputDir, projectRoot } = require('./helpers');

const enableSourceMap = process.env.NODE_ENV !== 'production';

const gitRevisionPlugin = new GitRevisionPlugin();

module.exports = {
  mode: 'development',

  output: {
    path: outputDir,
    filename: '[name].bundle.js',
  },

  devtool: enableSourceMap ? 'eval-cheap-module-source-map' : undefined,

  devServer: {
    hot: true,
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),

    // The next module is needed for golden-layout to work nicely
    new webpack.ProvidePlugin({
      ReactDOM: 'react-dom',
      React: 'react',
    }),

    // Resolve process.env in the code; the object below provides the
    // default values
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEPLOYMENT: '0',
      SKYBRUSH_VARIANT: 'default',
    }),

    // Resolve the git version number and commit hash in the code
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(gitRevisionPlugin.version()),
      COMMIT_HASH: JSON.stringify(gitRevisionPlugin.commithash()),
    }),

    // Add environment variables from .env
    new Dotenv({
      ignoreStub: true, // needed because electron-is-dev uses "ELECTRON_IS_DEV in process.env", which is broken if process.env is stubbed
      silent: true, // suppress warnings if there is no .env file
    }),

    // Add VERSION and COMMITHASH file to output
    gitRevisionPlugin,
  ],
  resolve: {
    alias: {
      '~': path.resolve(projectRoot, 'src'),
      config: path.resolve(projectRoot, 'config', 'default'),
      'layout-bmfont-text': '@skybrush/layout-bmfont-text',
    },
    extensions: [
      '.webpack.js',
      '.web.js',
      '.ts',
      '.tsx',
      '.mjs',
      '.js',
      '.jsx',
      '.json',
    ],
    fallback: {
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      'process/browser': require.resolve('process/browser'),
      util: require.resolve('util'),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.(t|j)sx?$/,
        use: [{ loader: 'ts-loader' }],
        include: [
          path.join(projectRoot, 'config'),
          path.join(projectRoot, 'src'),
        ],
      },
      {
        enforce: 'pre',
        test: /\.js/,
        include: [
          path.join(projectRoot, 'config'),
          path.join(projectRoot, 'src'),
        ],
        loader: 'source-map-loader',
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'less-loader' },
        ],
        include: path.join(projectRoot, 'assets', 'css'),
      },
      {
        test: /\.(png|json)$/,
        type: 'asset/resource',
        include: path.join(projectRoot, 'assets', 'fonts'),
        generator: {
          // Do not mangle filenames for fonts because the JSON refers to the
          // PNG directly
          filename: 'fonts/[name][ext]',
        },
      },
      {
        test: /\.(png|jpg|skyc)$/,
        type: 'asset/resource',
        include: path.join(projectRoot, 'assets'),
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg|mp3|wav|ogg|gltf|obj)$/,
        type: 'asset/resource',
      },
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
      },
    ],
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        /* Extract license comments to a separate file */
        extractComments: /^@preserve|license|cc-/i,

        /* Drop console.log() calls in production */
        terserOptions: {
          compress: {
            // eslint-disable-next-line camelcase
            drop_console: true,
          },
          output: {
            // This is needed because otherwise Terser will happily replace
            // escape sequences in string literals with their Unicode
            // equivalents, which makes Electron blow up when starting the app,
            // at least on macOS. Electron will start reading the file as ASCII,
            // not UTF-8, and it will ultimately crash because lodash/deburr
            // contains fancy accented characters as keys in an object, and
            // the UTF-8 representations of these accented characters get parsed
            // as ASCII, leading to invalid JS code.
            //
            // eslint-disable-next-line camelcase
            ascii_only: true,
          },
        },
      }),
    ],
  },

  /* No need for bundle size warnings */
  performance: { hints: false },
};
