const { ipcMain: ipc } = require('electron-better-ipc');

const dialogs = require('./dialogs');
const { getShowAsObjectFromLocalFile } = require('./show-loader');
const { setTitle } = require('./window-title');

module.exports = () => {
  ipc.answerRenderer(
    'getShowAsObjectFromLocalFile',
    getShowAsObjectFromLocalFile
  );
  ipc.answerRenderer(
    'selectLocalShowFileForOpening',
    dialogs.selectLocalShowFileForOpening
  );
  ipc.answerRenderer('setTitle', ({ appName, representedFile }, window) => {
    setTitle(window, { appName, representedFile });
  });
};
