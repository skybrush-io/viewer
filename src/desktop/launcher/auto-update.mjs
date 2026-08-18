import { app } from 'electron';
import { ipcMain as ipc } from 'electron-better-ipc';
import electronUpdater from 'electron-updater';

import { getFirstMainWindow } from '@skybrush/electron-app-framework';

/** @type {import('electron-updater').autoUpdater | null} */
let _autoUpdater = null;

/**
 * @typedef {Object} UpdaterConfiguration
 *
 * @property {import('electron-updater').Logger} [log]  The logger to use for the auto-updater
 */

/**
 * @typedef {Object} UpdateInfo
 *
 * @property {boolean} available  Whether an update is available.
 * @property {boolean} downloaded  Whether the update has been downloaded.
 * @property {number|null} downloadProgress  The progress of the download, or null if no download is in progress.
 * @property {string|null} version  The version of the available update, or null if no update is available.
 */

/** @type {UpdateInfo} */
const NO_UPDATES = Object.freeze({
  available: false,
  downloaded: false,
  downloadProgress: null,
  version: null,
});

/**
 * Initializes the auto-updater integration with the Electron application. This function
 * should be called once during the app's startup.
 *
 * @param {UpdaterConfiguration} [options]  Options for configuring the auto-updater
 * @param {import('electron-updater').Logger} [options.log]  The logger to use for the auto-updater
 */
export function initialize(options = {}) {
  if (_autoUpdater) {
    throw new Error('Auto-updater is already configured');
  }

  // Using destructuring to access autoUpdater due to the CommonJS module of 'electron-updater'.
  // It is a workaround for ESM compatibility issues, see https://github.com/electron-userland/electron-builder/issues/7976.
  const { autoUpdater } = electronUpdater;
  const { log } = options;

  // Integrate with logger
  if (log) {
    autoUpdater.logger = log;
  }

  // Do not install updates on app quit because that could potentially leave the app
  // in a broken state if the app quits due to the system shutting down.
  //
  // When migrating to electron-updater v7 or later, this will have to be replaced with
  // autoUpdater.autoInstallEvent = 'onNextLaunch'.
  autoUpdater.autoInstallOnAppQuit = false;

  // Uncomment the following line to test the auto-updater in dev mode.
  // In this case you will also need to provide a file named dev-app-update.yml
  // in the root of your project
  if (!app.isPackaged) {
    autoUpdater.forceDevUpdateConfig = true;
  }

  // Set up IPC handlers for requests coming from the renderer process
  ipc.answerRenderer('__autoUpdater_checkForUpdates', checkForUpdates);
  ipc.answerRenderer(
    '__autoUpdater_quitAndInstallUpdate',
    quitAndInstallUpdate
  );

  // Register a function to be called every time the status of the auto-updater changes.
  registerUpdateListener(autoUpdater, (info) => {
    const mainWindow = getFirstMainWindow();
    if (mainWindow) {
      ipc.callRenderer(mainWindow, 'setUpdateInfo', info).catch((err) => {
        _autoUpdater.logger?.error(
          'Failed to notify renderer about update status:',
          err
        );
      });
    }
  });

  _autoUpdater = autoUpdater;
}

export function getAutoUpdater() {
  if (!_autoUpdater) {
    throw new Error(
      'Auto-updater is not initialized. Call initialize() first.'
    );
  }

  return _autoUpdater;
}

/**
 * @typedef {Object} CheckForUpdateOptions
 *
 * @property {boolean} [silent=false]  If true, errors will be ignored silently. Assumes
 *         that the auto-updater has already logged any errors to the console.
 */

/**
 * Checks for updates and logs any errors silently in the console.
 *
 * @param {CheckForUpdateOptions} [options={}]  Options for checking for updates
 * @returns {Promise<UpdateInfo>}  A promise that resolves when the update check is complete
 */
async function checkForUpdates(options = {}) {
  const { silent } = options;

  try {
    const result = await getAutoUpdater().checkForUpdates();
    return result?.isUpdateAvailable
      ? Object.freeze({
          available: true,
          downloaded: result?.updateInfo?.version ? true : false,
          version: result?.updateInfo?.version ?? null,
        })
      : NO_UPDATES;
  } catch (err) {
    if (!silent) {
      throw err;
    }
  }

  return NO_UPDATES;
}

/**
 * Quits the application and installs the update.
 *
 * @param {CheckForUpdateOptions} [options={}]  Options for installing the update
 */
function quitAndInstallUpdate(options = {}) {
  const { silent } = options;
  const autoUpdater = getAutoUpdater();

  try {
    autoUpdater.quitAndInstall();
  } catch (err) {
    autoUpdater.logger?.error('Failed to quit and install update:', err);
    if (!silent) {
      throw err;
    }
  }
}

/**
 * Registers a function to be called when the status of the auto-update service changes.
 *
 * @param {import('electron-updater').autoUpdater} autoUpdater  The auto-updater instance to listen to
 * @param {function(UpdateInfo): void} callback  The function to call when the status changes
 * @returns {function(): void}  A function that can be called to unregister the callback
 */
function registerUpdateListener(autoUpdater, callback) {
  /** @type {import('electron-updater').UpdateInfo | null} */
  let lastUpdateInfo = null;

  /** @param {import('electron-updater').UpdateInfo} info */
  const handleUpdateAvailable = (info) => {
    lastUpdateInfo = info;
    callback({
      available: true,
      downloaded: false,
      downloadProgress: autoUpdater.autoDownload ? 0 : null,
      version: info?.version ?? null,
    });
  };

  /** @param {import('electron-updater').UpdateInfo} info */
  const handleUpdateDownloaded = (info) => {
    lastUpdateInfo = info;
    callback({
      available: true,
      downloaded: true,
      downloadProgress: null,
      version: info?.version ?? null,
    });
  };

  const handleUpdateNotAvailable = () => {
    lastUpdateInfo = null;
    callback(NO_UPDATES);
  };

  /** @param {import('electron-updater').ProgressInfo} info */
  const handleDownloadProgress = (info) => {
    if (lastUpdateInfo) {
      callback({
        available: true,
        downloaded: false,
        downloadProgress: Math.round(info.percent * 100) / 100,
        version: lastUpdateInfo?.version ?? null,
      });
    }
  };

  autoUpdater.on('update-available', handleUpdateAvailable);
  autoUpdater.on('update-downloaded', handleUpdateDownloaded);
  autoUpdater.on('update-not-available', handleUpdateNotAvailable);
  autoUpdater.on('download-progress', handleDownloadProgress);

  return () => {
    autoUpdater.off('update-available', handleUpdateAvailable);
    autoUpdater.off('update-downloaded', handleUpdateDownloaded);
    autoUpdater.off('update-not-available', handleUpdateNotAvailable);
    autoUpdater.off('download-progress', handleDownloadProgress);
  };
}
