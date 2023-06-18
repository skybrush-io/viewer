import { getShowDuration } from '~/features/show/selectors';
import type { AppThunk } from '~/store';

import {
  canTogglePlayback,
  getElapsedSeconds,
  getPlaybackSpeed,
  isPlaying,
} from './selectors';
import { setStartStopTimeAndSpeed } from './slice';

export { temporarilyOverridePlaybackPosition } from './slice';

export const rewind = (): AppThunk => (dispatch) => {
  dispatch(setPlaybackPosition(0));
};

export const startPlaybackFromBeginning = (): AppThunk => (dispatch) => {
  dispatch(setStartStopTimeAndSpeed({ start: Date.now(), stop: null }));
};

export const stopPlayback = (): AppThunk => (dispatch) => {
  dispatch(setStartStopTimeAndSpeed({ stop: Date.now() }));
};

export const togglePlayback = (): AppThunk => (dispatch, getState) => {
  const now = Date.now();
  const state = getState();

  if (!canTogglePlayback(state)) {
    return;
  }

  if (isPlaying(state)) {
    dispatch(setStartStopTimeAndSpeed({ stop: now }));
  } else {
    const elapsed = getElapsedSeconds(state, now);
    const speed = getPlaybackSpeed(state);

    dispatch(
      setStartStopTimeAndSpeed({
        start: now - (elapsed / speed) * 1000,
        stop: null,
      })
    );
  }
};

export const setPlaybackPosition =
  (seconds: number): AppThunk =>
  (dispatch, getState) => {
    const state = getState();
    const now = Date.now();
    const speed = getPlaybackSpeed(state);

    const start = now - (seconds / speed) * 1000;
    const stop = isPlaying(state) ? null : now;

    dispatch(setStartStopTimeAndSpeed({ start, stop }));
  };

export const adjustPlaybackPositionBy =
  (delta: number): AppThunk =>
  (dispatch, getState) => {
    if (!Number.isFinite(delta)) {
      return;
    }

    const state = getState();
    const seconds = getElapsedSeconds(state);
    const newPosition = Math.min(
      Math.max(0, seconds + delta),
      getShowDuration(state)
    );
    dispatch(setPlaybackPosition(newPosition));
  };

export const setPlaybackSpeed =
  (speed_: any): AppThunk =>
  (dispatch, getState) => {
    let speed = Number.parseFloat(String(speed_));

    if (Number.isNaN(speed) || speed <= 0 || speed >= 100) {
      speed = 1;
    }

    const state = getState();
    const now = Date.now();
    const seconds = getElapsedSeconds(state, now);

    const start = now - (seconds / speed) * 1000;
    const stop = isPlaying(state) ? null : now;

    dispatch(setStartStopTimeAndSpeed({ start, stop, speed }));
  };
