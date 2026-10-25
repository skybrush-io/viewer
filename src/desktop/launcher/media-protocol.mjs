import { URL } from 'node:url';
import { protocol } from 'electron';

import { getAudioBuffer } from './media-buffers.mjs';

/**
 * Registers an Electron protocol handler for the media:// URI scheme that is
 * used to transfer audio data between the main and the renderer process.
 */
const registerMediaProtocol = () => {
  protocol.registerFileProtocol('media', (request, callback) => {
    try {
      const parsedUrl = new URL(request.url);
      const index =
        parsedUrl.host === 'audio'
          ? Number.parseInt(parsedUrl.pathname.slice(1), 10)
          : -1;

      const audioBuffer = index >= 0 ? getAudioBuffer(index) : null;

      /* Error -6 = file not found in net_error_list.h in Chromium */
      callback(
        audioBuffer && audioBuffer.path
          ? { path: audioBuffer.path }
          : { error: -6 }
      );
    } catch (error) {
      console.error('Unexpected error in media:// protocol handler');
      console.error(error);
      callback({ error: -6 });
    }
  });
};

export default registerMediaProtocol;
