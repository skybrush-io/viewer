import { dialog } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Returns the directory containing the given file if the directory still
 * exists, or undefined otherwise.
 *
 * @param {string | undefined} filename
 * @returns {Promise<string | undefined>}
 */
const getExistingParentDirectory = async (filename) => {
  if (typeof filename !== 'string' || !path.isAbsolute(filename)) {
    return undefined;
  }

  const directory = path.dirname(filename);
  try {
    const stats = await fs.stat(directory);
    return stats.isDirectory() ? directory : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Shows a file chooser for opening a show file.
 *
 * @param {string | undefined} lastFile  the most recently opened file; the
 *        dialog starts in its directory if that directory still exists
 * @returns {Promise<string | undefined>}
 */
export const selectLocalShowFileForOpening = async (lastFile) => {
  const defaultPath = await getExistingParentDirectory(lastFile);

  const { filePaths } = await dialog.showOpenDialog({
    title: 'Open show file',
    properties: ['openFile'],
    filters: [
      { name: 'Skybrush shows', extensions: ['skyc'] },
      { name: 'All files', extensions: ['*'] },
    ],
    ...(defaultPath ? { defaultPath } : {}),
  });

  if (filePaths && filePaths.length > 0) {
    return filePaths[0];
  }

  return undefined;
};
