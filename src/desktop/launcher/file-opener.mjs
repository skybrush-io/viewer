import { app } from 'electron';
import { ipcMain as ipc } from 'electron-better-ipc';

import { getFirstMainWindow } from './utils.mjs';

const handleFileOpeningRequestsWith = (function_, options = {}) => {
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
        await function_(filename);
      } else {
        function_(filename);
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

const setupFileOpener = (filenames) => {
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

export default setupFileOpener;
