const { app } = require('electron');
const { ipcMain: ipc } = require('electron-better-ipc');

const { getFirstMainWindow } = require('./utils');

const handleFileOpeningRequestsWith = (func, options = {}) => {
  const { async = false, filenames = [], maxCount = 1 } = options;
  const pendingFilesToOpen = [];
  const rendererIsReady = { value: false };

  const flushPendingFiles = async () => {
    if (!app.isReady() || !rendererIsReady.value) {
      return;
    }

    const filesToProcess = pendingFilesToOpen.concat();
    pendingFilesToOpen.length = 0;

    /* eslint-disable no-await-in-loop */
    for (const filename of filesToProcess) {
      if (async) {
        await func(filename);
      } else {
        func(filename);
      }
    }
    /* eslint-enable no-await-in-loop */
  };

  const processFile = async (filename) => {
    pendingFilesToOpen.push(filename);
    if (pendingFilesToOpen.length > maxCount) {
      pendingFilesToOpen.splice(0, pendingFilesToOpen.length - maxCount);
    }

    await flushPendingFiles();
  };

  app.on('will-finish-launching', () => {
    app.on('open-file', (event, file) => {
      processFile(file);
      event.preventDefault();
    });
  });

  app.on('ready', () => {
    flushPendingFiles();
  });

  if (Array.isArray(filenames)) {
    for (const filename of filenames) {
      if (typeof filename === 'string') {
        processFile(filename);
      }
    }
  }

  ipc.answerRenderer('readyForFileOpening', () => {
    rendererIsReady.value = true;
    flushPendingFiles();
  });
};

module.exports = (filenames) => {
  handleFileOpeningRequestsWith(
    async (filename) => {
      const mainWindow = getFirstMainWindow();
      if (mainWindow) {
        await ipc.callRenderer(
          mainWindow,
          'notifyFileOpeningRequest',
          filename
        );
      }
    },
    {
      async: true,
      filenames,
      maxCount: 1,
    }
  );
};
