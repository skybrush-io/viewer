const { contextBridge } = require('electron');
const { ipcRenderer: ipc } = require('electron-better-ipc');
const createStorageEngine = require('redux-persist-electron-storage');

const { receiveActionsFromRenderer, setupIpc } = require('./ipc');

/**
 * Creates a Redux state store object that stores the Redux state in an
 * Electron store.
 *
 * @return {Object}  a Redux storage engine that can be used by redux-storage
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
  provideActions: (...args) => {
    receiveActionsFromRenderer(...args);

    // Let the main process know that we are now ready to open show files
    ipc.callMain('readyForFileOpening');
  },
  selectLocalShowFileForOpening: () =>
    ipc.callMain('selectLocalShowFileForOpening'),
});

// Set up IPC channels that we are going to listen to
setupIpc();
