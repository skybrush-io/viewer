const path = require('path');

const { isNil } = require('lodash');

const { isRunningOnMac } = require('./utils');

const appNames = new WeakMap();
const representedFiles = new WeakMap();

const setTitle = (window, { appName, representedFile }) => {
  if (appName !== undefined) {
    appNames.set(window, isNil(appName) ? '' : String(appName));
  }

  if (representedFile !== undefined) {
    representedFiles.set(
      window,
      isNil(representedFile) ? '' : String(representedFile)
    );
  }

  appName = appNames.get(window);
  representedFile = representedFiles.get(window);
  const filename = representedFile ? path.basename(representedFile) : '';

  if (isRunningOnMac) {
    if (filename) {
      window.setTitle(filename);
      window.setRepresentedFilename(representedFile);
    } else {
      window.setTitle(appName);
      window.setRepresentedFilename('');
    }
  } else {
    window.setTitle(filename ? `${filename} - ${appName}` : appName);
  }
};

module.exports = {
  setTitle,
};
