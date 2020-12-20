import {
  getElapsedSecondsGetter,
  getPlaybackSpeed,
  isPlaying,
} from './selectors';
import { setStartStopTimeAndSpeed } from './slice';

export { temporarilyOverridePlaybackPosition } from './slice';

export const rewind = () => (dispatch) => {
  dispatch(setPlaybackPosition(0));
};

export const startPlaybackFromBeginning = () => (dispatch) => {
  dispatch(setStartStopTimeAndSpeed({ start: Date.now(), stop: null }));
};

export const stopPlayback = () => (dispatch) => {
  dispatch(setStartStopTimeAndSpeed({ stop: Date.now() }));
};

export const togglePlayback = () => (dispatch, getState) => {
  const now = Date.now();
  const state = getState();

  if (isPlaying(state)) {
    dispatch(setStartStopTimeAndSpeed({ stop: now }));
  } else {
    const elapsed = getElapsedSecondsGetter(state)(now);
    const speed = getPlaybackSpeed(state);

    dispatch(
      setStartStopTimeAndSpeed({
        start: now - (elapsed / speed) * 1000,
        stop: null,
      })
    );
  }
};

export const setPlaybackPosition = (seconds) => (dispatch, getState) => {
  const state = getState();
  const now = Date.now();
  const speed = getPlaybackSpeed(state);

  const start = now - (seconds / speed) * 1000;
  const stop = isPlaying(state) ? null : now;

  dispatch(setStartStopTimeAndSpeed({ start, stop }));
};

export const setPlaybackSpeed = (speed) => (dispatch, getState) => {
  speed = Number.parseFloat(speed);

  if (Number.isNaN(speed) || speed <= 0 || speed >= 100) {
    speed = 1;
  }

  const state = getState();
  const now = Date.now();
  const seconds = getElapsedSecondsGetter(state)(now);

  const start = now - (seconds / speed) * 1000;
  const stop = isPlaying(state) ? null : now;

  dispatch(setStartStopTimeAndSpeed({ start, stop, speed }));
};
