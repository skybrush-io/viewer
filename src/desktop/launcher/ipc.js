const { ipcMain: ipc } = require('electron-better-ipc');

const dialogs = require('./dialogs');
const { loadShowFromFile } = require('./show-loader');

module.exports = () => {
  ipc.answerRenderer('loadShowFromFile', loadShowFromFile);
  ipc.answerRenderer(
    'selectLocalShowFileForOpening',
    dialogs.selectLocalShowFileForOpening
  );
};
