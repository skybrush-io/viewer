const path = require('path');

const { isNil } = require('lodash');

const { isRunningOnMac } = require('./utils');

const appNames = new WeakMap();
const representedFiles = new WeakMap();

const setTitle = (window, { appName, representedFile, alternateFile }) => {
  if (appName !== undefined) {
    appNames.set(window, isNil(appName) ? '' : String(appName));
  }

  if (representedFile !== undefined) {
    representedFiles.set(
      window,
      isNil(representedFile)
        ? isNil(alternateFile)
          ? ''
          : '@' + String(alternateFile)
        : String(representedFile)
    );
  }

  appName = appNames.get(window);
  representedFile = representedFiles.get(window);
  const filename = representedFile ? path.basename(representedFile) : '';

  if (isRunningOnMac) {
    if (filename) {
      window.setTitle(filename);
      if (representedFile.charAt(0) !== '@') {
        window.setRepresentedFilename(representedFile);
      } else {
        window.setRepresentedFilename('');
      }
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
