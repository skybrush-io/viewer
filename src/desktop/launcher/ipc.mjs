import { ipcMain as ipc } from 'electron-better-ipc';

import { selectLocalShowFileForOpening } from './dialogs.mjs';
import { getShowAsObjectFromLocalFile } from './show-loader.mjs';
import { setTitle } from './window-title.mjs';

const setupIpc = () => {
  ipc.answerRenderer(
    'getShowAsObjectFromLocalFile',
    getShowAsObjectFromLocalFile
  );
  ipc.answerRenderer(
    'selectLocalShowFileForOpening',
    selectLocalShowFileForOpening
  );
  ipc.answerRenderer('setTitle', ({ appName, representedFile }, window) => {
    setTitle(window, { appName, representedFile });
  });
};

export default setupIpc;
