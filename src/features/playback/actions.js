import { getElapsedSecondsAt, isPlaying } from './selectors';
import { setStartAndStopTime } from './slice';

export const startPlaybackFromBeginning = () => dispatch => {
  dispatch(setStartAndStopTime({ start: Date.now(), stop: null }));
};

export const stopPlayback = () => dispatch => {
  dispatch(setStartAndStopTime({ stop: Date.now() }));
};

export const togglePlayback = () => (dispatch, getState) => {
  const now = Date.now();

  if (isPlaying(getState())) {
    dispatch(setStartAndStopTime({ stop: now }));
  } else {
    const elapsed = getElapsedSecondsAt(getState(), now);
    dispatch(setStartAndStopTime({ start: now - elapsed * 1000, stop: null }));
  }
};

export const setPlaybackPosition = seconds => (dispatch, getState) => {
  const now = Date.now();
  const start = now - seconds * 1000;
  const stop = isPlaying(getState()) ? null : now;

  dispatch(setStartAndStopTime({ start, stop }));
};
