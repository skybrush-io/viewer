const { ipcMain: ipc } = require('electron-better-ipc');

const dialogs = require('./dialogs');
const { getShowAsObjectFromLocalFile } = require('./show-loader');

module.exports = () => {
  ipc.answerRenderer(
    'getShowAsObjectFromLocalFile',
    getShowAsObjectFromLocalFile
  );
  ipc.answerRenderer(
    'selectLocalShowFileForOpening',
    dialogs.selectLocalShowFileForOpening
  );
};
