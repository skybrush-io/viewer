const { ipcMain: ipc } = require('electron-better-ipc');
const fs = require('fs').promises;
const dialogs = require('./dialogs');

const { loadCompiledShow } = require('@skybrush/show-format');

const loadShowFromFile = async (filename) => {
  const contents = await fs.readFile(filename);
  return loadCompiledShow(contents);
};

module.exports = () => {
  ipc.answerRenderer('loadShowFromFile', loadShowFromFile);
  ipc.answerRenderer(
    'selectLocalShowFileForOpening',
    dialogs.selectLocalShowFileForOpening
  );
};
