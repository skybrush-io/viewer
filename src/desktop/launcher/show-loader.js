const fs = require('fs').promises;

const { get } = require('lodash');

const { loadCompiledShow } = require('@skybrush/show-format');

const { getUrlToAudioBuffer, setAudioBuffer } = require('./media-buffers');
const { setTitle } = require('./window-title');

const getShowAsObjectFromLocalFile = async (filename, window) => {
  const contents = await fs.readFile(filename);

  // don't pass 'window' to getShowAsObjectFromBuffer(), we don't want it to modify the
  // file path represented by the window
  const showSpec = await getShowAsObjectFromBuffer(contents);

  if (showSpec && window) {
    // Set the filename and title on the window
    setTitle(window, { representedFile: filename });
  }

  return showSpec;
};

const getShowAsObjectFromBuffer = async (buffer, window) => {
  const showSpec = await loadCompiledShow(buffer, { assets: true });

  if (showSpec) {
    const audioSpec = get(showSpec, 'media.audio');
    const { data: audioData, mediaType } = audioSpec || {};

    // We don't send the audio to the renderer; we save it to a file and then
    // send the path of the file to the renderer instead
    if (audioData) {
      await setAudioBuffer(0, {
        data: audioData,
        mimeType: mediaType || 'audio/mpeg',
      });

      delete audioSpec.data;

      // Attach the timestamp to the end of the URL to ensure that the
      // AudioController in the app gets a new URL even if it refers to the
      // same audio buffer (because the audio content is different)
      audioSpec.url = getUrlToAudioBuffer(0) + '?ts=' + Date.now();
    }
  }

  if (showSpec && window) {
    setTitle(window, { representedFile: null });
  }

  return showSpec;
};

module.exports = {
  getShowAsObjectFromBuffer,
  getShowAsObjectFromLocalFile,
};
