import type { RootState } from '~/store';

import type { UIMode } from './modes';

/**
 * Selector that returns the current UI mode.
 */
export const getCurrentMode = (state: RootState): UIMode => state.ui.mode;

/**
 * Selector that returns the list of recently opened files.
 */
export const getRecentFiles = (state: RootState): string[] =>
  state.ui.recentFiles;
