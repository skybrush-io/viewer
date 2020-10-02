const fs = require('fs');
const url = require('url');
const path = require('path');

const { usingWebpackDevServer } = require('./utils');

function getDefaultMainWindowUrlFromRootDir(rootDir, indexPage = 'index.html') {
  if (usingWebpackDevServer) {
    /* Load from webpack-dev-server */
    return `https://localhost:8080/${indexPage}`;
  }

  if (!rootDir) {
    throw new Error('rootDir must be set to the folder containing index.html');
  }

  let index = path.join(rootDir, indexPage);
  if (!fs.existsSync(index)) {
    index = path.join(rootDir, '..', indexPage);
  }

  return url.format({
    pathname: index,
    protocol: 'file:',
    slashes: true,
  });
}

function getDefaultPreloadUrlFromRootDir(rootDir) {
  return path.join(
    rootDir,
    usingWebpackDevServer ? '../preload/index.js' : 'preload.bundle.js'
  );
}

function getUrlsFromRootDir(rootDir) {
  return {
    url: getDefaultMainWindowUrlFromRootDir(rootDir),
    preload: getDefaultPreloadUrlFromRootDir(rootDir),
  };
}

module.exports = {
  getDefaultMainWindowUrlFromRootDir,
  getDefaultPreloadUrlFromRootDir,
  getUrlsFromRootDir,
};
