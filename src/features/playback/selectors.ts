import { createSelector } from '@reduxjs/toolkit';
import isNil from 'lodash-es/isNil';

import { isAudioReadyToPlay } from '~/features/audio/selectors';
import {
  getShowDataSource,
  hasLoadedShowFile,
  isLoadingShowFile,
} from '~/features/show/selectors';
import type { RootState } from '~/store';
import { isShowDataSourceReloadable } from '../show/utils';

/**
 * Returns whether the "reload show" action is available now.
 */
export const canReloadShow = (state: RootState): boolean =>
  isShowDataSourceReloadable(getShowDataSource(state)) &&
  !isPlaying(state) &&
  !isLoadingShowFile(state);

/**
 * Returns whether the "toggle playback" action is available now.
 */
export const canTogglePlayback = (state: RootState) =>
  isPlaying(state) || (hasLoadedShowFile(state) && isAudioReadyToPlay(state));

/**
 * Selector that returns the current playback speed multiplier.
 */
export const getPlaybackSpeed = (state: RootState): number => {
  const { speed } = state.playback;
  return isNil(speed) ? 1 : speed;
};

/**
 * Returns the number of seconds elapsed at the current or given timestamp.
 */
export const getElapsedSeconds = (
  state: RootState,
  timestamp: number | null = null
) => getElapsedSecondsGetter(state)(timestamp);

export type TimestampGetter = (timestamp?: number | null) => number;

/**
 * Selector that returns a getter function that can be invoked with a timestamp
 * and that will return the number of seconds elapsed in the show at the given
 * timestamp, based on the state of the playback.
 */
export const getElapsedSecondsGetter = createSelector(
  (state: RootState): number | null => state.playback.startedAt,
  (state: RootState): number | null => state.playback.stoppedAt,
  (state: RootState): number | null => state.playback.adjustedTo,
  getPlaybackSpeed,
  (
    startedAt: number | null,
    stoppedAt: number | null,
    adjustedTo: number | null,
    speed: number
  ): TimestampGetter =>
    (timestamp: number | null = null) => {
      if (!isNil(adjustedTo)) {
        return adjustedTo / 1000;
      }

      if (timestamp === null) {
        timestamp = Date.now();
      }

      if (!startedAt || timestamp < startedAt) {
        return 0;
      }

      if (stoppedAt && timestamp > stoppedAt) {
        return ((stoppedAt - startedAt) * speed) / 1000;
      }

      return ((timestamp - startedAt) * speed) / 1000;
    }
);

/**
 * Returns whether the user is currently adjusting the playback position by
 * dragging the thumb on the playback slider.
 */
export const isAdjustingPlaybackPosition = (state: RootState) =>
  !isNil(state.playback.adjustedTo);

/**
 * Returns whether we are currently playing the drone show.
 */
export const isPlaying = (state: RootState): boolean =>
  !isNil(state.playback.startedAt) && isNil(state.playback.stoppedAt);

/**
 * Returns whether we are currently playing the drone show in real time.
 */
export const isPlayingInRealTime = (state: RootState): boolean =>
  getPlaybackSpeed(state) === 1 && isPlaying(state);

/**
 * Returns whether the user has interacted with the playback settings at least
 * once.
 *
 * Used to decide whether a play button "hint" should be shown on the loading
 * screen when the show is loaded.
 *
 * This is set to <code>true</code> by default in the desktop variant because
 * we don't need a hint there.
 */
export const userInteractedWithPlayback = (state: RootState): boolean =>
  !isNil(state.playback.startedAt) || !isNil(state.playback.adjustedTo);
