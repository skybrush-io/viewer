const fs = require('fs').promises;
const tmp = require('tmp-promise');

/**
 * Variable that holds the currently loaded audio data.
 *
 * Each audio buffer slot is backed by a temporary file on the disk that holds
 * the actual buffer contents. This is because the HTML5 <audio> tag cannot
 * work with in-memory buffers directly.
 *
 * Right now the viewer can show only a single file so we have a single slot.
 * variable. Later on this can be extended to multiple slots.
 */
const loadedAudioBuffers = [];

/**
 * Returns the contents of the audio buffer with the given index.
 */
const getAudioBuffer = (index) => loadedAudioBuffers[index] || null;

/**
 * Returns the media:// URL to the audio buffer with the given index.
 */
const getUrlToAudioBuffer = (index) =>
  index >= 0 ? `media://audio/${index}` : null;

/**
 * Sets the contents of the audio buffer with the given index.
 */
const setAudioBuffer = async (index, { data, mimeType }) => {
  clearAudioBuffer(index);

  const { path, cleanup } = await tmp.file();
  await fs.writeFile(path, data);

  loadedAudioBuffers[index] = { path, cleanup, mimeType };
};

/**
 * Clears the contents of the audio buffer with the given index.
 */
const clearAudioBuffer = (index) => {
  const existingBuffer = getAudioBuffer(index);

  if (existingBuffer && existingBuffer.cleanup) {
    existingBuffer.cleanup();
  }

  loadedAudioBuffers[index] = null;
};

module.exports = {
  clearAudioBuffer,
  getAudioBuffer,
  getUrlToAudioBuffer,
  setAudioBuffer,
};
