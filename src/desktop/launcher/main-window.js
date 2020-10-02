const { BrowserWindow } = require('electron');
const windowStateKeeper = require('electron-window-state');

const { getUrlsFromRootDir } = require('./urls');

/**
 * Creates a factory function that creates the main window of the application
 * when invoked with the Electron app as its only argument.
 *
 * Prevents the creation of multiple main windows; if a main window exists
 * already, it will return the existing main window instance.
 *
 * Any options argument not explicitly mentioned here are forwarded to the
 * BrowserWindow constructor.
 *
 * @param  {Object}   app  the main Electron application object
 * @param  {string}   backgroundColor  background color of the main window.
 *         This needs to be set for nicer font antialiasing; the default is white.
 * @param  {boolean}  debug          whether to start with the developer tools open
 * @param  {boolean}  showMenuBar    whether the application will have a menu bar
 * @param  {string|function}  rootDir  the directory containing index.html
 *         and preload.bundle.js (typically derived from __dirname), or a
 *         function that can be called with no arguments and that returns the
 *         full path to index.html and to the preloader, as an object with two
 *         keys: 'url' and 'preload'
 * @param  {[number, number]}  size  default size of the main window
 * @return {Object} the main window of the application that was created
 */
const createMainWindowFactory = ({
  backgroundColor = '#ffffff',
  debug,
  rootDir,
  showMenuBar = true,
  size = [1024, 768],
  webPreferences,
  ...rest
} = {}) => {
  let instance;
  let windowState;

  if (typeof rootDir === 'undefined') {
    throw new TypeError('rootDir must be specified');
  }

  const { url, preload } =
    typeof rootDir === 'string' ? getUrlsFromRootDir(rootDir) : rootDir();

  if (preload) {
    webPreferences = {
      ...webPreferences,
      preload,
    };
  }

  return (app) => {
    if (instance !== undefined) {
      return instance;
    }

    if (!windowState) {
      windowState = windowStateKeeper({
        defaultWidth: size[0],
        defaultHeight: size[1],
        fullScreen: false,
      });
    }

    const { x, y, width, height } = windowState;
    instance = new BrowserWindow({
      title: app.name,
      show: false,
      backgroundColor,
      x,
      y,
      width,
      height,
      ...rest,
      webPreferences: {
        // It would be nice to have contextIsolation: true, but I don't see
        // how we could inject window.bridge into the main window if the
        // two contexts are isolated
        contextIsolation: false,
        // Lots of electron-* modules that we use still depend on 'electron.remote'
        // so we need this
        enableRemoteModule: true,
        worldSafeExecuteJavaScript: true,

        ...webPreferences,
      },
    });

    // We need to hide the menu bar. Apparently, both are needed below; the
    // first line alone is not enough because the mrnu bar comes back after
    // putting the app full screen and then coming back
    if (!showMenuBar) {
      instance.setMenuBarVisibility(false);
      instance.setMenu(null);
    }

    windowState.manage(instance);

    instance.on('closed', () => {
      windowState.unmanage(instance);
      instance = undefined;
    });

    instance.on('ready-to-show', () => {
      instance.show();
      instance.focus();

      if (debug) {
        instance.webContents.openDevTools({
          mode: 'undocked',
        });
      }
    });

    if (url) {
      instance.loadURL(url);
    }

    return instance;
  };
};

module.exports = {
  createMainWindowFactory,
};
