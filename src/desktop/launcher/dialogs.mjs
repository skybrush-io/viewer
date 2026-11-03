import { dialog } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Maximum time to wait for resolving the default path of the file chooser,
 * in milliseconds. Prevents stalling on unavailable network shares.
 */
const DEFAULT_PATH_RESOLUTION_TIMEOUT_MS = 2000;

/**
 * Returns the given file if it still exists, or its closest ancestor
 * directory that still exists, or undefined if neither can be found.
 *
 * @param {string | undefined} filename
 * @returns {Promise<string | undefined>}
 */
const getClosestExistingPath = async (filename) => {
  if (typeof filename !== 'string' || !path.isAbsolute(filename)) {
    return undefined;
  }

  try {
    const stats = await fs.stat(filename);
    if (stats.isFile()) {
      return filename;
    }
  } catch {
    // File does not exist, continue with its ancestors
  }

  let directory = path.dirname(filename);
  while (true) {
    try {
      const stats = await fs.stat(directory);
      if (stats.isDirectory()) {
        return directory;
      }
    } catch {
      // Directory does not exist, continue with its parent
    }

    const parent = path.dirname(directory);
    if (parent === directory) {
      return undefined;
    }

    directory = parent;
  }
};

/**
 * Resolves the given promise, or undefined if it does not settle within the
 * given timeout.
 *
 * @template T
 * @param {Promise<T>} promise
 * @param {number} ms
 * @returns {Promise<T | undefined>}
 */
const withTimeout = async (promise, ms) => {
  /** @type {NodeJS.Timeout | undefined} */
  let timer;
  /** @type {Promise<undefined>} */
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve(undefined), ms);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
};

/**
 * Shows a file chooser for opening a show file.
 *
 * @param {string | undefined} lastFile  the most recently opened file; the
 *        dialog preselects it if it still exists, or starts in its closest
 *        existing ancestor directory otherwise
 * @returns {Promise<string | undefined>}
 */
export const selectLocalShowFileForOpening = async (lastFile) => {
  const defaultPath = await withTimeout(
    getClosestExistingPath(lastFile),
    DEFAULT_PATH_RESOLUTION_TIMEOUT_MS
  );

  const { filePaths } = await dialog.showOpenDialog({
    title: 'Open show file',
    properties: ['openFile'],
    filters: [
      { name: 'Skybrush shows', extensions: ['skyc'] },
      { name: 'All files', extensions: ['*'] },
    ],
    defaultPath,
  });

  if (filePaths && filePaths.length > 0) {
    return filePaths[0];
  }

  return undefined;
};
