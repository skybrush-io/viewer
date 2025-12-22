import { contextBridge } from 'electron';
import { ipcRenderer as ipc } from 'electron-better-ipc';
import createStorageEngine from 'redux-persist-electron-storage';

import { receiveActionsFromRenderer, setupIpc } from './ipc';

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

// Inject the bridge functions between the main and the renderer processes.
// These are the only functions that the renderer processes may call to access
// any functionality that requires Node.js -- they are not allowed to use
// Node.js modules themselves
contextBridge.exposeInMainWorld('bridge', {
  createStateStore,
  isElectron: true,
  getShowAsObjectFromLocalFile: (filename) =>
    ipc.callMain('getShowAsObjectFromLocalFile', filename),
  provideActions(...args) {
    receiveActionsFromRenderer(...args);

    // Let the main process know that we are now ready to open show files
    ipc.callMain('readyForFileOpening');
  },
  selectLocalShowFileForOpening: () =>
    ipc.callMain('selectLocalShowFileForOpening'),
  setTitle({ appName, representedFile }) {
    ipc.callMain('setTitle', { appName, representedFile });
  },
});

// Set up IPC channels that we are going to listen to
setupIpc();
