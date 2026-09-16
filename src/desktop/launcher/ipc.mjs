import { ipcMain as ipc } from 'electron-better-ipc';

import { selectLocalShowFileForOpening } from './dialogs.mjs';
import { setAudioBuffer, setTerrainBuffer } from './media-buffers.mjs';
import { setTitle } from './window-title.mjs';

const setupIpc = () => {
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

  ipc.answerRenderer(
    'setTerrainBuffer',
    /**
     * @param {{ index: number; options: { data: Uint8Array; mediaType: string }}} args
     */
    (args) => {
      const { index, options } = args;
      return setTerrainBuffer(index, options);
    }
  );
};

export default setupIpc;
