const { app, Menu, protocol, shell } = require('electron');
const unhandled = require('electron-unhandled');
const tmp = require('tmp-promise');
const yargs = require('yargs/yargs');

const createAppMenu = require('./app-menu');
const setupIpc = require('./ipc');
const { createMainWindow } = require('./main-window');
const registerMediaProtocol = require('./media-protocol');
const { willUseWebpackDevServer } = require('./utils');

// Clean up temporary files even when an uncaught exception occurs
tmp.setGracefulCleanup();

/**
 * Main entry point of the application.
 *
 * @param  {Object}  argv  the parsed command line arguments
 */
function run(argv) {
  const windowOptions = {
    debug: argv.debug,
  };

  // Register unhandled error handler
  unhandled({ logger: (error) => console.error(error.stack) });

  // Register our soon-to-be-used media:// protocol as privileged so the
  // fetch() API can work with it
  protocol.registerSchemesAsPrivileged([
    { scheme: 'media', privileges: { bypassCSP: true } },
  ]);

  // Create the main window when the application is ready
  app.on('ready', () => {
    registerMediaProtocol();

    Menu.setApplicationMenu(createAppMenu(app));
    createMainWindow(app, windowOptions);
  });

  // Quit when all windows are closed -- unless we are on a Mac
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // Re-create the main window on a Mac when the user clicks on the Dock
  // icon, unless we already have a main window
  app.on('activate', () => {
    createMainWindow(app, windowOptions);
  });

  // Handle certificate errors
  app.on(
    'certificate-error',
    (event, _webContents, url, _error, _cert, allowCallback) => {
      if (
        willUseWebpackDevServer &&
        url.match(/^(https|wss):\/\/localhost:.*\//)
      ) {
        event.preventDefault();
        allowCallback(true);
      } else {
        console.warn(
          'Prevented connection to URL due to certificate error:',
          url
        );
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

        // Prevent creating web views that point outside
        if (
          !parameters.src.startsWith('file://') &&
          !parameters.src.startsWith('http://localhost') &&
          !parameters.src.startsWith('https://localhost')
        ) {
          event.preventDefault();
        }
      }
    );

    /*
    webContents.on('will-navigate', (event) => {
      event.preventDefault();
    });
    */

    webContents.on('new-window', async (event, navigationUrl) => {
      event.preventDefault();
      await shell.openExternal(navigationUrl);
    });
  });

  // Set up IPC handlers
  setupIpc();
}

module.exports = (argv) => {
  // Don't use require('yargs') below because Webpack; see:
  // https://github.com/yargs/yargs/issues/781
  const parser = yargs()
    .usage('$0 [options]', 'Launches Skybrush Viewer in a desktop window')

    .boolean('d')
    .alias('d', 'debug')
    .describe('d', 'Start in debug mode with the developer tools open')

    .help();

  run(parser.parse(argv || process.argv));
};
