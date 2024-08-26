const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.resolve(projectRoot, 'build');

const getHtmlMetaTags = ({ disableCSP = false } = {}) => {
  const result = {
    // eslint-disable-next-line unicorn/text-encoding-identifier-case
    charset: 'utf-8',
    description:
      'Skybrush Viewer: The Next-generation Drone Light Show Software Suite',
    viewport:
      'initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no',
    'X-UA-Compatible': 'IE=edge',
  };

  if (!disableCSP) {
    result['Content-Security-Policy'] =
      "script-src 'self'; connect-src * ws: wss:;";
  }

  return result;
};

const useAppConfiguration = (name = 'default') => ({
  resolve: {
    alias: {
      'config-overrides': path.resolve(projectRoot, 'config', name),
    },
  },
});

module.exports = {
  getHtmlMetaTags,
  projectRoot,
  outputDir,
  useAppConfiguration,
};
