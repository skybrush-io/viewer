const { program } = require('commander');
const { app, Menu, protocol, shell } = require('electron');
const unhandled = require('electron-unhandled');
const tmp = require('tmp-promise');

const createAppMenu = require('./app-menu');
const setupIpc = require('./ipc');
const { createMainWindowFactory } = require('./main-window');
const registerMediaProtocol = require('./media-protocol');
const { usingWebpackDevServer } = require('./utils');

// Clean up temporary files even when an uncaught exception occurs
tmp.setGracefulCleanup();

/**
 * Default function that decides whether a URL is trusted even in case of a
 * certificate error.
 */
function defaultUnsafeUrlHandler(url) {
  return usingWebpackDevServer && url.match(/^(https|wss):\/\/localhost:.*\//);
}

/**
 * Error handler function that logs the stack trace of an error to the console.
 */
function logErrorToConsole(error) {
  console.error(error.stack);
}

/**
 * Generic setup function for Electron applications that sets up sane defaults
 * that are suitable for most of the Skybrush suite.
 */
function setupApp({
  appMenu,
  enableNavigation = false,
  isUnsafeUrlTrusted = defaultUnsafeUrlHandler,
  lastWindowClosesApp,
  mainWindow,
  unhandledErrorLogger = logErrorToConsole,
} = {}) {
  // Register unhandled error handler
  unhandled({
    logger: unhandledErrorLogger,
  });

  // Create main window factory
  const mainWindowFactory = () => mainWindow(app);

  // Register application menu at startup
  if (appMenu) {
    app.on('ready', () => {
      if (typeof appMenu === 'function') {
        appMenu = appMenu();
      }

      Menu.setApplicationMenu(appMenu);
    });
  }

  // Handle certificate errors
  app.on(
    'certificate-error',
    // eslint-disable-next-line max-params
    (event, _webContents, url, _error, _cert, callback) => {
      if (isUnsafeUrlTrusted(url)) {
        event.preventDefault();
        callback(true);
      } else {
        console.warn(
          'Prevented connection to URL due to certificate error:',
          url
        );
        callback(false);
      }
    }
  );

  // Prevent the creation of additional windows or web views. Also prevent
  // navigation.
  app.on('web-contents-created', (_event, webContents) => {
    webContents.on(
      'will-attach-webview',
      (event, webPreferences, parameters) => {
        // Disable Node.js integration
        webPreferences.nodeIntegration = false;

        if (!enableNavigation) {
          // Prevent creating web views that point outside
          if (
            !parameters.src.startsWith('file://') &&
            !parameters.src.startsWith('http://localhost') &&
            !parameters.src.startsWith('https://localhost')
          ) {
            event.preventDefault();
          }
        }
      }
    );

    if (!enableNavigation) {
      const openWithShell = async (event, navigationUrl) => {
        event.preventDefault();
        await shell.openExternal(navigationUrl);
      };

      webContents.on('will-navigate', openWithShell);
      webContents.on('new-window', openWithShell);
    }
  });

  // Create the main window when the application is ready
  app.on('ready', () => {
    registerMediaProtocol();
    mainWindowFactory();
  });

  // Quit when all windows are closed -- unless we are on a Mac or we explicitly
  // asked the framework to close the app when the last window closes
  lastWindowClosesApp = lastWindowClosesApp || process.platform !== 'darwin';

  // Close the app when all windows are closed. Note that we need the event
  // handler to prevent the default behaviour, which would close the app even
  // on macOS, so we can't put the condition outside the event handler
  // registration.
  app.on('window-all-closed', () => {
    if (lastWindowClosesApp) {
      app.quit();
    }
  });

  if (!lastWindowClosesApp) {
    // Re-create the main window on a Mac when the user clicks on the Dock
    // icon, unless we already have a main window
    app.on('activate', mainWindowFactory);
  }
}

/**
 * Generic setup function for command line parsers of Electron applications
 * that sets up some common command line options that we use across the
 * Skybrush suite.
 */
function setupCliParser(parser = program) {
  parser
    .storeOptionsAsProperties(false)
    .name(app.getName())
    .version(app.getVersion())
    .description(`Launches ${app.getName()} in a desktop window`)
    .option('-d, --debug', 'Start in debug mode with the developer tools open');
  return parser;
}

/**
 * Main entry point of the application.
 *
 * @param  {Object}  argv  the parsed command line arguments
 */
function run(argv) {
  const windowOptions = {
    backgroundColor: '#20242a', // same as the background color of the cover page
    debug: argv.debug,
    rootDir: __dirname,
    titleBarStyle: 'hiddenInset',
  };

  setupApp({
    appMenu: createAppMenu,
    mainWindow: createMainWindowFactory(windowOptions),
  });

  // Register our soon-to-be-used media:// protocol as privileged so the
  // fetch() API can work with it
  protocol.registerSchemesAsPrivileged([
    { scheme: 'media', privileges: { bypassCSP: true } },
  ]);
  app.on('ready', () => {
    registerMediaProtocol();
  });

  // Set up IPC handlers
  setupIpc();
}

module.exports = (argv) => {
  const parser = setupCliParser();
  parser.parse(argv || process.argv);
  run(parser.opts());
};
