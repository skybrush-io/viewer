import fs from 'node:fs/promises';
import tmp from 'tmp-promise';

/**
 * @typedef {Object} AudioBuffer
 * @property {string} path - Path to the temporary file holding the audio data
 * @property {() => Promise<void>} cleanup - Function to call to delete the temporary file
 * @property {string} mediaType - MIME type of the audio data
 */

/**
 * @typedef {Object} TerrainBuffer
 * @property {string} path - Path to the temporary file holding the terrain model
 * @property {() => Promise<void>} cleanup - Function to call to delete the temporary file
 * @property {string} mediaType - MIME type of the terrain model
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
 * Variable that holds the currently loaded terrain model data.
 *
 * Each terrain buffer slot is backed by a temporary file on the disk that holds
 * the actual buffer contents. This is because the A-Frame gltf-model component
 * loads models via URL, and we serve them through the media:// protocol from
 * these temporary files.
 *
 * @type {TerrainBuffer[]}
 */
const loadedTerrainBuffers = [];

/**
 * Returns the contents of the audio buffer with the given index.
 *
 * @param {number} index - index of the buffer
 */
export const getAudioBuffer = (index) => loadedAudioBuffers[index] ?? null;


/**
 * Returns the contents of the terrain buffer with the given index.
 * 
 * @param {number} index - index of the buffer
 */
export const getTerrainBuffer = (index) => loadedTerrainBuffers[index] ?? null;

/**
 * Returns the media:// URL to the audio buffer with the given index.
 *
 * @param {number} index - index of the buffer
 */
const getUrlToAudioBuffer = (index) =>
  index >= 0 ? `media://audio/${index}` : null;

/**
 * Returns the media:// URL to the terrain buffer with given index.
 * @param {number} index - of the buffer
 */
const getUrlToTerrainBuffer = (index) =>
  index >= 0 ? `media://terrain/${index}/model.glb` : null;

/**
 * Sets the contents of the audio buffer with the given index.
 *
 * @param {number} index - index of the buffer
 * @param {import('@skybrush/show-format').AudioData} options
 */
export const setAudioBuffer = async (index, options) => {
  const { data, mediaType, startTime } = options;

  if (index < 0) {
    return null;
  }

  await clearAudioBuffer(index);

  const { path, cleanup } = await tmp.file();
  await fs.writeFile(path, data);

  loadedAudioBuffers[index] = { path, cleanup, mediaType, startTime };

  return getUrlToAudioBuffer(index);
};

/**
 * Sets the contents of the terrain buffer with the give index.
 * 
 * @param {number} index - index of the buffer
 * @param {{ data: Uint8Array; mediaType: string }} options
 */
export const setTerrainBuffer = async (index, options) => {
  const { data, mediaType } = options;

  if (index < 0) {
    return null;
  }

  await clearTerrainBuffer(index);

  const { path, cleanup } = await tmp.file();
  await fs.writeFile(path, data);

  loadedTerrainBuffers[index] = { path, cleanup, mediaType };

  return getUrlToTerrainBuffer(index);
};

/**
 * Clears the contents of the audio buffer with the given index.
 *
 * @param {number} index - index of the buffer
 */
export const clearAudioBuffer = async (index) => {
  const existingBuffer = getAudioBuffer(index);

  if (existingBuffer && existingBuffer.cleanup) {
    try {
      await existingBuffer.cleanup();
    } catch {
      // Ignore cleanup errors (file may be locked by audio element)
    }
  }

  loadedAudioBuffers[index] = null;
};

/**
 * Clears the contents of the terrain buffer with the given index.
 * 
 * @param {number} index - index of the buffer
 */
export const clearTerrainBuffer = async (index) => {
  const existingBuffer = getTerrainBuffer(index);

  if (existingBuffer && existingBuffer.cleanup) {
    try {
      await existingBuffer.cleanup();
    } catch {
      // Ignore cleanup errors
    }
  }

  loadedTerrainBuffers[index] = null;
};