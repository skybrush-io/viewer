import { platform } from 'node:os';
import { BrowserWindow } from 'electron';

export const getFirstMainWindow = (options = {}) => {
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

export const isRunningOnMac = platform() === 'darwin';
