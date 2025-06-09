import type { KeyMap } from './types';
import { fixModifiersInKeyMap } from './utils';

export enum HotkeyGroup {
  /** Special group for hotkeys that are supposed to be hidden from the list */
  HIDDEN = 'hidden',
}

export enum HotkeyScope {
  GLOBAL = 'global',
  PLAYER = 'player',
  VALIDATION = 'validation',
}

export type AppKeyMap = KeyMap<HotkeyGroup, HotkeyScope>;

// Create the default keymap mapping keys to actions
export const keyMap: AppKeyMap = {
  CUE_FORWARD: {
    sequences: ['l', 'shift+l', 'alt+l', 'shift+alt+l'],
    scopes: [HotkeyScope.PLAYER],
  },
  CUE_BACKWARD: {
    sequences: ['j', 'shift+j', 'alt+j', 'shift+alt+j'],
    scopes: [HotkeyScope.PLAYER],
  },

  REWIND: {
    sequence: 'home',
    scopes: [HotkeyScope.PLAYER],
  },

  TOGGLE_MUTED: {
    sequence: 'p',
    scopes: [HotkeyScope.PLAYER],
  },
  TOGGLE_PLAYBACK: {
    sequences: ['space', 'k'],
    scopes: [HotkeyScope.PLAYER],
  },

  SELECT_DEFAULT_CAMERA: {
    sequence: '0',
    scopes: [HotkeyScope.PLAYER],
  },
  SELECT_FIRST_CAMERA: {
    sequence: '1',
    scopes: [HotkeyScope.PLAYER],
  },
  SELECT_SECOND_CAMERA: {
    sequence: '2',
    scopes: [HotkeyScope.PLAYER],
  },
  SELECT_THIRD_CAMERA: {
    sequence: '3',
    scopes: [HotkeyScope.PLAYER],
  },
  SELECT_FOURTH_CAMERA: {
    sequence: '4',
    scopes: [HotkeyScope.PLAYER],
  },
  SELECT_FIFTH_CAMERA: {
    sequence: '5',
    scopes: [HotkeyScope.PLAYER],
  },
};

export const cameraTriggerActions: string[] = [
  'SELECT_DEFAULT_CAMERA',
  'SELECT_FIRST_CAMERA',
  'SELECT_SECOND_CAMERA',
  'SELECT_THIRD_CAMERA',
  'SELECT_FOURTH_CAMERA',
  'SELECT_FIFTH_CAMERA',
];

fixModifiersInKeyMap(keyMap);

export default keyMap;
