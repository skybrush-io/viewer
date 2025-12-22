import fs from 'node:fs/promises';
import tmp from 'tmp-promise';

/**
 * @typedef {Object} AudioBuffer
 * @property {string} path - Path to the temporary file holding the audio data
 * @property {() => Promise<void>} cleanup - Function to call to delete the temporary file
 * @property {string} mimeType - MIME type of the audio data
 */

/**
 * Variable that holds the currently loaded audio data.
 *
 * Each audio buffer slot is backed by a temporary file on the disk that holds
 * the actual buffer contents. This is because the HTML5 <audio> tag cannot
 * work with in-memory buffers directly.
 *
 * Right now the viewer can show only a single file so we have a single slot.
 * variable. Later on this can be extended to multiple slots.
 *
 * @type {AudioBuffer[]}
 */
const loadedAudioBuffers = [];

/**
 * Returns the contents of the audio buffer with the given index.
 *
 * @param {number} index - index of the buffer
 */
export const getAudioBuffer = (index) => loadedAudioBuffers[index] ?? null;

/**
 * Returns the media:// URL to the audio buffer with the given index.
 *
 * @param {number} index - index of the buffer
 */
export const getUrlToAudioBuffer = (index) =>
  index >= 0 ? `media://audio/${index}` : null;

/**
 * Sets the contents of the audio buffer with the given index.
 *
 * @param {number} index - index of the buffer
 * @param {{ data: string | NodeJS.ArrayBufferView; mimeType: string}} options
 */
export const setAudioBuffer = async (index, options) => {
  const { data, mimeType } = options;

  clearAudioBuffer(index);

  const { path, cleanup } = await tmp.file();
  await fs.writeFile(path, data);

  loadedAudioBuffers[index] = { path, cleanup, mimeType };
};

/**
 * Clears the contents of the audio buffer with the given index.
 *
 * @param {number} index - index of the buffer
 */
export const clearAudioBuffer = (index) => {
  const existingBuffer = getAudioBuffer(index);

  if (existingBuffer && existingBuffer.cleanup) {
    void existingBuffer.cleanup();
  }

  loadedAudioBuffers[index] = null;
};
