import React from 'react';
import { connect } from 'react-redux';
import {
  configure as configureHotkeys,
  GlobalHotKeys,
  type KeyMap,
} from 'react-hotkeys';

import { PLAYBACK_FPS } from '~/constants';
import { toggleMuted } from '~/features/audio/slice';
import {
  adjustPlaybackPositionBy,
  rewind,
  togglePlayback,
} from '~/features/playback/actions';
import { switchToCameraByIndex } from '~/features/three-d/actions';

import { keyMap } from './keymap';
import { bindHotkeyHandlers, onlyWhenNoButtonIsFocused } from './utils';
import type { AppDispatch, RootState } from '~/store';
import type { HotkeyHandler } from './types';
import { getActiveHotkeyScope } from './selectors';

configureHotkeys({
  // Uncomment the next line for debugging problems with hotkeys
  // logLevel: 'debug',
});

interface AppHotkeysProps<ScopeType = string> {
  readonly activeHotkeyScope: ScopeType;
  readonly handlers: Record<string, HotkeyHandler>;
}

const AppHotkeys = ({ activeHotkeyScope, handlers }: AppHotkeysProps) => {
  const filteredKeyMap: KeyMap = Object.fromEntries(
    Object.entries(keyMap).filter(([, { scopes }]) =>
      scopes.includes(activeHotkeyScope as any)
    )
  ) as any;
  return (
    <GlobalHotKeys allowChanges keyMap={filteredKeyMap} handlers={handlers} />
  );
};

const CUE_STEP = 1; // seconds
const FINE_CUE_STEP = 1 / PLAYBACK_FPS; // seconds
const LARGE_MULTIPLIER = 10; // for large cue steps

const isFineAdjustment = (event?: KeyboardEvent) => {
  return event?.altKey;
};

const isLargeAdjustment = (event?: KeyboardEvent) => {
  return event?.shiftKey;
};

const getCueStep = (event?: KeyboardEvent) => {
  // Logic is modelled based on Inkscape's move operator:
  // Alt forces the base distance to the smallest movement possible, while
  // Shift multiplies the distance by 10. The default nudge distance is 1 second.

  const base = isFineAdjustment(event) ? FINE_CUE_STEP : CUE_STEP;
  return isLargeAdjustment(event) ? base * LARGE_MULTIPLIER : base;
};

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    activeHotkeyScope: getActiveHotkeyScope(state),
  }),
  // mapDispatchToProps
  (dispatch: AppDispatch) => ({
    handlers: bindHotkeyHandlers(
      {
        CUE_BACKWARD: (event?: KeyboardEvent) =>
          adjustPlaybackPositionBy(-getCueStep(event)),
        CUE_FORWARD: (event?: KeyboardEvent) =>
          adjustPlaybackPositionBy(getCueStep(event)),
        REWIND: rewind,
        SELECT_DEFAULT_CAMERA: () => switchToCameraByIndex(0),
        SELECT_FIRST_CAMERA: () => switchToCameraByIndex(1),
        SELECT_SECOND_CAMERA: () => switchToCameraByIndex(2),
        SELECT_THIRD_CAMERA: () => switchToCameraByIndex(3),
        SELECT_FOURTH_CAMERA: () => switchToCameraByIndex(4),
        SELECT_FIFTH_CAMERA: () => switchToCameraByIndex(5),
        TOGGLE_MUTED: () => toggleMuted(),
        TOGGLE_PLAYBACK: onlyWhenNoButtonIsFocused<AppDispatch>(togglePlayback),
      },
      {},
      dispatch
    ),
  })
)(AppHotkeys);
