import { app } from 'electron';
import { ipcMain as ipc } from 'electron-better-ipc';

import { getFirstMainWindow } from './utils.mjs';

/**
 * @param {(filename: string) => void | Promise<void>} function_
 * @param {{ async: boolean; filenames: string[]; maxCount: number}} options
 */
const handleFileOpeningRequestsWith = (function_, options = {}) => {
  const { async = false, filenames = [], maxCount = 1 } = options;
  const rendererIsReady = { value: false };

  /** @type {string[]} */
  const pendingFilesToOpen = [];

  const flushPendingFiles = async () => {
    if (!app.isReady() || !rendererIsReady.value) {
      return;
    }

    const filesToProcess = pendingFilesToOpen.concat();
    pendingFilesToOpen.length = 0;

    for (const filename of filesToProcess) {
      if (async) {
        await function_(filename);
      } else {
        void function_(filename);
      }
    }
  };

  /**
   * @param {string} filename
   */
  const processFile = async (filename) => {
    pendingFilesToOpen.push(filename);
    if (pendingFilesToOpen.length > maxCount) {
      pendingFilesToOpen.splice(0, pendingFilesToOpen.length - maxCount);
    }

    await flushPendingFiles();
  };

  app.on('will-finish-launching', () => {
    app.on('open-file', (event, file) => {
      event.preventDefault();
      void processFile(file);
    });
  });

  app.on('ready', () => {
    void flushPendingFiles();
  });

  if (Array.isArray(filenames)) {
    for (const filename of filenames) {
      if (typeof filename === 'string') {
        void processFile(filename);
      }
    }
  }

  ipc.answerRenderer('readyForFileOpening', () => {
    rendererIsReady.value = true;
    void flushPendingFiles();
  });
};

/**
 * @param {string[]} filenames
 */
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
