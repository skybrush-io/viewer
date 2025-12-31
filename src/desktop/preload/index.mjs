import { contextBridge } from 'electron';
import { ipcRenderer as ipc } from 'electron-better-ipc';
import fs from 'node:fs/promises';
import createStorageEngine from 'redux-persist-electron-storage';

import { receiveActionsFromRenderer, setupIpc } from './ipc.mjs';

/**
 * Creates a Redux state store object that stores the Redux state in an
 * Electron store.
 *
 * @return  a Redux storage engine that can be used by redux-storage
 */
function createStateStore() {
  return createStorageEngine({
    store: {
      name: 'state',
    },
  });
}

/**
 * The bridge functions between the main and the renderer processes.
 *
 * These are the only functions that the renderer processes may call to access
 * any functionality that requires Node.js -- they are not allowed to use
 * Node.js modules themselves.
 *
 * @type {import('../../window.ts').ElectronBridge}
 */
const bridge = {
  createStateStore,
  isElectron: true,

  provideActions: (actions) => {
    receiveActionsFromRenderer(actions);

    // Let the main process know that we are now ready to open show files
    void ipc.callMain('readyForFileOpening');
  },

  readFile: (filename) => fs.readFile(filename),

  selectLocalShowFileForOpening: () =>
    ipc.callMain('selectLocalShowFileForOpening'),

  setAudioBuffer: (index, options) =>
    ipc.callMain('setAudioBuffer', { index, options }),

  setTitle: async ({ appName, representedFile }) => {
    await ipc.callMain('setTitle', { appName, representedFile });
  },
};

// Inject the bridge functions to the context of the renderer process.
contextBridge.exposeInMainWorld('bridge', bridge);

// Set up IPC channels that we are going to listen to
setupIpc();
