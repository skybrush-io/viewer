import React from 'react';
import { connect } from 'react-redux';
import {
  configure as configureHotkeys,
  GlobalHotKeys,
  KeyMap,
} from 'react-hotkeys';

import { toggleMuted } from '~/features/audio/slice';
import {
  adjustPlaybackPositionBy,
  rewind,
  togglePlayback,
} from '~/features/playback/actions';
import { switchToCameraByIndex } from '~/features/three-d/actions';
import { Action } from 'redux';
import { AppThunk } from './store';

configureHotkeys({
  // Uncomment the next line for debugging problems with hotkeys
  // logLevel: 'debug',
});

// Create the default keymap mapping keys to actions
export const keyMap: KeyMap = {
  CUE_FORWARD: 'l',
  CUE_BACKWARD: 'j',
  REWIND: 'home',
  TOGGLE_MUTED: 'p',
  TOGGLE_PLAYBACK: ['space', 'k'],

  SELECT_DEFAULT_CAMERA: '0',
  SELECT_FIRST_CAMERA: '1',
  SELECT_SECOND_CAMERA: '2',
  SELECT_THIRD_CAMERA: '3',
  SELECT_FOURTH_CAMERA: '4',
  SELECT_FIFTH_CAMERA: '5',
};

export const cameraTriggerActions = [
  'SELECT_DEFAULT_CAMERA',
  'SELECT_FIRST_CAMERA',
  'SELECT_SECOND_CAMERA',
  'SELECT_THIRD_CAMERA',
  'SELECT_FOURTH_CAMERA',
  'SELECT_FIFTH_CAMERA',
];

function onlyWhenNoButtonIsFocused<T extends any[], A>(
  actionFactory: (...args: T) => Action<A> | AppThunk
) {
  return (...args: T) => {
    return !document.activeElement ||
      document.activeElement.tagName !== 'BUTTON'
      ? actionFactory(...args)
      : null;
  };
}

interface AppHotkeysProps {
  cueForward: () => void;
  cueBackward: () => void;
  rewind: () => void;
  switchToCameraByIndex: (index: number) => void;
  toggleMuted: () => void;
  togglePlayback: () => void;
  children: React.ReactNode;
}

const AppHotkeys = ({
  cueForward,
  cueBackward,
  rewind,
  switchToCameraByIndex,
  toggleMuted,
  togglePlayback,
  children,
}: AppHotkeysProps) => {
  const handlers = {
    CUE_FORWARD: cueForward,
    CUE_BACKWARD: cueBackward,
    REWIND: rewind,
    // Full-screen does not work yet; the OverlayVisibilityHandler stops working
    // and I don't have time to debug it.
    // TOGGLE_FULLSCREEN: toggleFullScreen,
    SELECT_DEFAULT_CAMERA: () => {
      switchToCameraByIndex(0);
    },
    SELECT_FIRST_CAMERA: () => {
      switchToCameraByIndex(1);
    },
    SELECT_SECOND_CAMERA: () => {
      switchToCameraByIndex(2);
    },
    SELECT_THIRD_CAMERA: () => {
      switchToCameraByIndex(3);
    },
    SELECT_FOURTH_CAMERA: () => {
      switchToCameraByIndex(4);
    },
    SELECT_FIFTH_CAMERA: () => {
      switchToCameraByIndex(5);
    },
    TOGGLE_MUTED: toggleMuted,
    TOGGLE_PLAYBACK: togglePlayback,
  };

  return (
    <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
      {children}
    </GlobalHotKeys>
  );
};

export default connect(
  // mapStateToProps
  () => ({}),
  // mapDispatchToProps
  {
    cueBackward: () => adjustPlaybackPositionBy(-10),
    cueForward: () => adjustPlaybackPositionBy(10),
    rewind,
    switchToCameraByIndex,
    toggleMuted: toggleMuted as any,
    togglePlayback: onlyWhenNoButtonIsFocused(togglePlayback),
  }
)(AppHotkeys);
