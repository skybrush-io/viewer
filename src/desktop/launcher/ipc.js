const { ipcMain: ipc } = require('electron-better-ipc');
const fs = require('fs').promises;
const dialogs = require('./dialogs');

const loadShowFromFile = async (filename) => {
  const contents = await fs.readFile(filename);
  return JSON.parse(contents);
};

module.exports = () => {
  ipc.answerRenderer('loadShowFromFile', loadShowFromFile);
  ipc.answerRenderer(
    'selectLocalShowFileForOpening',
    dialogs.selectLocalShowFileForOpening
  );
};
