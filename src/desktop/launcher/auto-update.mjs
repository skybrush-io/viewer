import log from 'electron-log';
import electronUpdater from 'electron-updater';

/** @type {import('electron-updater').autoUpdater} */
let _autoUpdater = null;

/**
 * @typedef {Object} UpdateInfo
 *
 * @member {boolean} available  Whether an update is available.
 * @member {boolean} downloaded  Whether the update has been downloaded.
 * @member {string|null} version  The version of the available update, or null if no update is available.
 */

/** @type {UpdateInfo} */
const NO_UPDATES = Object.freeze({
  available: false,
  downloaded: false,
  version: null,
});

function configureAutoUpdater() {
  // Using destructuring to access autoUpdater due to the CommonJS module of 'electron-updater'.
  // It is a workaround for ESM compatibility issues, see https://github.com/electron-userland/electron-builder/issues/7976.
  const { autoUpdater } = electronUpdater;

  log.transports.file.level = 'debug';
  autoUpdater.logger = log;

  // Do not install updates on app quit because that could potentially leave the app
  // in a broken state if the app quits due to the system shutting down.
  //
  // When migrating to electron-updater v7 or later, this will have to be replaced with
  // autoUpdater.autoInstallEvent = 'onNextLaunch'.
  autoUpdater.autoInstallOnAppQuit = false;

  // Uncomment the following line to test the auto-updater in dev mode.
  // In this case you will also need to provide a file named dev-app-update.yml
  // in the root of your project
  // autoUpdater.forceDevUpdateConfig = true;

  return autoUpdater;
}

export function getAutoUpdater() {
  if (!_autoUpdater) {
    _autoUpdater = configureAutoUpdater();
  }

  return _autoUpdater;
}

/**
 * @typedef {Object} CheckForUpdateOptions
 *
 * @member {boolean} [silent=false]  If true, errors will be ignored silently. Assumes
 *         that the auto-updater has already logged any errors to the console.
 */

/**
 * Checks for updates and logs any errors silently in the console.
 *
 * @param {CheckForUpdateOptions} [options={}]  Options for checking for updates
 * @returns {Promise<UpdateInfo>}  A promise that resolves when the update check is complete
 */
export async function checkForUpdates(options = {}) {
  const { silent } = options;

  try {
    const result = await getAutoUpdater().checkForUpdates();
    return result.isUpdateAvailable
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
}

/**
 * Quits the application and installs the update.
 *
 * @param {CheckForUpdateOptions} [options={}]  Options for installing the update
 */
export function quitAndInstallUpdate(options = {}) {
  const { silent } = options;

  try {
    getAutoUpdater().quitAndInstall();
  } catch (err) {
    log.error('Failed to quit and install update:', err);
    if (!silent) {
      throw err;
    }
  }
}
