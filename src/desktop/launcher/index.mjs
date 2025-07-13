import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { app, protocol } from 'electron';
import ElectronStore from 'electron-store';
import tmp from 'tmp-promise';

import { setupApp, setupCli } from '@skybrush/electron-app-framework';

import createAppMenu from './app-menu.mjs';
import setupFileOpener from './file-opener.mjs';
import setupIpc from './ipc.mjs';
import registerMediaProtocol from './media-protocol.mjs';

const rootDir =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// See webpack/launcher.config.js and https://github.com/visionmedia/debug/issues/467
// for more information about why this is needed
// eslint-disable-next-line camelcase
global.__runtime_process_env = {
  DEBUG: false,
};

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
    const { setupHttpServer } = await import('./http-server.mjs');
    await setupHttpServer(options);
  }

  setupApp({
    appMenu: createAppMenu,
    mainWindow: {
      backgroundColor: '#20242a', // same as the background color of the cover page
      debug: options.debug,
      rootDir,
      showMenuBar: false,
      title: 'Skybrush Viewer',
      titleBarStyle: 'default', // 'hiddenInset' if we return to not showing the title bar on macOS
      webPreferences: {
        sandbox: false, // because we need Node.js modules from the preloader
      },
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

const main = async () => {
  const parser = setupCli();

  parser.option('-p, --port <number>', 'Start listener on a specific port');
  parser.parse();

  await run(parser.args, parser.opts());
};

export default main;
