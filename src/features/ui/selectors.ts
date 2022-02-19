import type { RootState } from '~/store';

import type { UIMode } from './modes';

/**
 * Selector that returns the current UI mode.
 */
export const getCurrentMode = (state: RootState): UIMode => state.ui.mode;
