const { dialog } = require('electron');

const selectLocalShowFileForOpening = async () => {
  const { filePaths } = await dialog.showOpenDialog({
    title: 'Open show file',
    properties: ['openFile'],
    filters: [
      { name: 'Skybrush shows', extensions: ['skyc'] },
      { name: 'All files', extensions: ['*'] },
    ],
  });

  if (filePaths && filePaths.length > 0) {
    return filePaths[0];
  }

  return undefined;
};

module.exports = {
  selectLocalShowFileForOpening,
};
