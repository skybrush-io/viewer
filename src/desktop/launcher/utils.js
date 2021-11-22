const { BrowserWindow } = require('electron');
const { platform } = require('os');

const getFirstMainWindow = (options = {}) => {
  const { required = false } = options;

  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length === 0) {
    if (required) {
      throw new Error('All windows are closed');
    } else {
      return undefined;
    }
  }

  return allWindows[0];
};

const isRunningOnMac = platform() === 'darwin';

module.exports = {
  getFirstMainWindow,
  isRunningOnMac,
};
