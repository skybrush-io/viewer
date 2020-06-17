const { get } = require('lodash');
const { ipcMain: ipc } = require('electron-better-ipc');
const fs = require('fs').promises;

const dialogs = require('./dialogs');
const { getUrlToAudioBuffer, setAudioBuffer } = require('./media-buffers');

const { loadCompiledShow } = require('@skybrush/show-format');

const loadShowFromFile = async (filename, window) => {
  const contents = await fs.readFile(filename);
  const showSpec = await loadCompiledShow(contents, { assets: true });

  if (showSpec) {
    const audioSpec = get(showSpec, 'media.audio');
    const { data: audioData, mediaType } = audioSpec;

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

    // Set the filename on the window
    window.setRepresentedFilename(filename);
  }

  return showSpec;
};

module.exports = () => {
  ipc.answerRenderer('loadShowFromFile', loadShowFromFile);
  ipc.answerRenderer(
    'selectLocalShowFileForOpening',
    dialogs.selectLocalShowFileForOpening
  );
};
