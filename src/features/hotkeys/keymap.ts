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
//
// Names are simply identifiers that point into the `hotkeys` key of the
// localization file. The comments with the t(...) stuff at the end are used
// to trigger the inclusion of these keys in the localization file.

export const keyMap: AppKeyMap = {
  CUE_FORWARD: {
    name: 'cueForward',
    sequence: 'l',
    scopes: [HotkeyScope.PLAYER],
  },
  CUE_BACKWARD: {
    name: 'cueBackward',
    sequence: 'j',
    scopes: [HotkeyScope.PLAYER],
  },

  REWIND: {
    name: 'rewind',
    sequence: 'home',
    scopes: [HotkeyScope.PLAYER],
  },

  TOGGLE_MUTED: {
    name: 'toggleMuted',
    sequence: 'm',
    scopes: [HotkeyScope.PLAYER],
  },
  TOGGLE_PLAYBACK: {
    name: 'togglePlayback',
    sequences: ['space', 'k'],
    scopes: [HotkeyScope.PLAYER],
  },

  SELECT_DEFAULT_CAMERA: {
    name: 'selectDefaultCamera',
    sequence: '0',
    scopes: [HotkeyScope.PLAYER],
  },
  SELECT_FIRST_CAMERA: {
    name: 'selectFirstCamera',
    sequence: '1',
    scopes: [HotkeyScope.PLAYER],
  },
  SELECT_SECOND_CAMERA: {
    name: 'selectSecondCamera',
    sequence: '2',
    scopes: [HotkeyScope.PLAYER],
  },
  SELECT_THIRD_CAMERA: {
    name: 'selectThirdCamera',
    sequence: '3',
    scopes: [HotkeyScope.PLAYER],
  },
  SELECT_FOURTH_CAMERA: {
    name: 'selectFourthCamera',
    sequence: '4',
    scopes: [HotkeyScope.PLAYER],
  },
  SELECT_FIFTH_CAMERA: {
    name: 'selectFifthCamera',
    sequence: '5',
    scopes: [HotkeyScope.PLAYER],
  },

  SHOW_HOTKEY_DIALOG: {
    group: HotkeyGroup.HIDDEN,
    sequence: '?',
    scopes: [HotkeyScope.PLAYER, HotkeyScope.VALIDATION],
  },
};

// t('hotkeys.cueForward')
// t('hotkeys.cueBackward')
// t('hotkeys.rewind')
// t('hotkeys.toggleMuted')
// t('hotkeys.togglePlayback')
// t('hotkeys.selectDefaultCamera')
// t('hotkeys.selectFirstCamera')
// t('hotkeys.selectSecondCamera')
// t('hotkeys.selectThirdCamera')
// t('hotkeys.selectFourthCamera')
// t('hotkeys.selectFifthCamera')

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
