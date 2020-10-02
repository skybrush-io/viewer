const { app, protocol } = require('electron');
const tmp = require('tmp-promise');

const { setupApp, setupCli } = require('@skybrush/electron-app-framework');

const createAppMenu = require('./app-menu');
const setupIpc = require('./ipc');
const registerMediaProtocol = require('./media-protocol');

/**
 * Main entry point of the application.
 *
 * @param  {Object}  argv  the parsed command line arguments
 */
function run(argv) {
  // Clean up temporary files even when an uncaught exception occurs
  tmp.setGracefulCleanup();

  setupApp({
    appMenu: createAppMenu,
    mainWindow: {
      backgroundColor: '#20242a', // same as the background color of the cover page
      debug: argv.debug,
      rootDir: __dirname,
      titleBarStyle: 'hiddenInset',
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
}

module.exports = (argv) => {
  const parser = setupCli();
  parser.parse(argv || process.argv);
  run(parser.opts());
};
