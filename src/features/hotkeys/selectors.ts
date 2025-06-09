import { createSelector } from '@reduxjs/toolkit';

import { UIMode } from '~/features/ui/modes';
import { getCurrentMode } from '~/features/ui/selectors';

import { HotkeyScope } from './keymap';
import type { RootState } from '~/store';

export const getActiveHotkeyScope = createSelector(getCurrentMode, (mode) => {
  switch (mode) {
    case UIMode.PLAYER:
      return HotkeyScope.PLAYER;
    case UIMode.VALIDATION:
      return HotkeyScope.VALIDATION;
    default:
      return HotkeyScope.GLOBAL;
  }
});

export const isHotkeyDialogVisible = (state: RootState) =>
  state.hotkeys.dialogVisible;
