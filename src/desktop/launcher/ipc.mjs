import { ipcMain as ipc } from 'electron-better-ipc';

import { selectLocalShowFileForOpening } from './dialogs.mjs';
import { setAudioBuffer } from './media-buffers.mjs';
import { setTitle } from './window-title.mjs';

const setupIpc = async () => {
  // auto-update.mjs needs to be imported lazily to ensure that we have time to
  // populate global.__runtime_process_env. Otherwise the app would not work when
  // packaged because auto-update.mjs would be imported before we have a chance to
  // patch global.__runtime_process_env
  const { checkForUpdates, quitAndInstallUpdate } =
    await import('./auto-update.mjs');

  ipc.answerRenderer('checkForUpdates', checkForUpdates);
  ipc.answerRenderer('quitAndInstallUpdate', quitAndInstallUpdate);

  ipc.answerRenderer(
    'selectLocalShowFileForOpening',
    selectLocalShowFileForOpening
  );

  ipc.answerRenderer(
    'setAudioBuffer',
    /**
     * @param {{ index: number; options: import('@skybrush/show-format').AudioData}} args
     */
    (args) => {
      const { index, options } = args;
      return setAudioBuffer(index, options);
    }
  );

  ipc.answerRenderer(
    'setTitle',
    /**
     * @param {{ appName?: string; representedFile?: string;}} args
     */
    (args, window) => {
      const { appName, representedFile } = args;
      setTitle(window, { appName, representedFile });
    }
  );
};

export default setupIpc;
