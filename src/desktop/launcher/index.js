// See webpack/launcher.config.js and https://github.com/visionmedia/debug/issues/467
// for more information about why this is needed
// eslint-disable-next-line camelcase
global.__runtime_process_env = {
  DEBUG: false,
};

const { app, protocol } = require('electron');
const ElectronStore = require('electron-store');
const tmp = require('tmp-promise');

const { setupApp, setupCli } = require('@skybrush/electron-app-framework');

const createAppMenu = require('./app-menu');
const setupFileOpener = require('./file-opener');
const setupIpc = require('./ipc');
const registerMediaProtocol = require('./media-protocol');

const ENABLE_HTTP_SERVER = true;

/**
 * Main entry point of the application.
 *
 * @param  {string[]}  filenames the filenames passed in the command line arguments
 * @param  {Object}    options   the parsed command line arguments
 */
async function run(filenames, options) {
  // Clean up temporary files even when an uncaught exception occurs
  tmp.setGracefulCleanup();

  // Allow the Electron state store to be created in the renderer process
  ElectronStore.initRenderer();

  // Start an HTTP server in the background for processing incoming JSON show
  // data from the Blender plugin
  if (ENABLE_HTTP_SERVER) {
    const setupHttpServer = require('./http-server');
    await setupHttpServer(options);
  }

  setupApp({
    appMenu: createAppMenu,
    mainWindow: {
      backgroundColor: '#20242a', // same as the background color of the cover page
      debug: options.debug,
      rootDir: __dirname,
      showMenuBar: false,
      title: 'Skybrush Viewer',
      titleBarStyle: 'hiddenInset',
      webPreferences: {
        sandbox: false  // because we need Node.js modules from the preloader
      }
    },
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

  // Set up file opener handlers
  setupFileOpener(filenames);
}

module.exports = async () => {
  const parser = setupCli();

  parser.option('-p, --port <number>', 'Start listener on a specific port');
  parser.parse();

  await run(parser.args, parser.opts());
};
