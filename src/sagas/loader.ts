/**
 * Saga that loads the default hardcoded drone show when the app is started.
 */

import get from 'lodash-es/get';
import isNil from 'lodash-es/isNil';
import ky from 'ky';
import { type Channel, channel } from 'redux-saga';
import { call, fork, put, putResolve, take } from 'redux-saga/effects';
import { freeze } from '@reduxjs/toolkit';

import { setAudioUrl } from '~/features/audio/slice';
import { setPlaybackPosition } from '~/features/playback/actions';
import { _doLoadShow } from '~/features/show/async';
import { loadShowFromRequest, setShowDataSource } from '~/features/show/slice';
import type { ShowLoadingRequest } from '~/features/show/types';
import { clearCameraPoseOverride } from '~/features/three-d/slice';

/**
 * Saga that watches a channel where it receives data sources to load a drone
 * show from. When a new source is received, it starts loading the show and
 * its audio in parallel, and returns to watching the queue when the show is
 * loaded successfully.
 */
function* loadShowFromRequestChannelSaga(
  chan: Channel<ShowLoadingRequest>
): Generator<any, void, any> {
  while (true) {
    const request = (yield take(chan)) as ShowLoadingRequest;
    const {
      audio,
      keepCameraPose,
      keepPlayhead,
      missingAudioIsOkay,
      initialSeekTime,
      source,
    } = request;

    const effectiveKeepCameraPose = keepCameraPose ?? keepPlayhead ?? false;

    try {
      let audioOkay = true;

      // Set the data source for the show before anything else so we can
      // attempt a reload even if the show loading fails.
      yield put(setShowDataSource(source));

      if (audio && missingAudioIsOkay) {
        try {
          const audioResponse = yield call(ky.head, audio);
          audioOkay = audioResponse.ok;
        } catch {
          audioOkay = false;
        }
      }

      const { payload: showSpec } = yield putResolve(
        _doLoadShow(freeze(request))
      );
      const audioInShowSpec = get(showSpec, 'media.audio.url');
      const audioUrl = isNil(audioInShowSpec) ? null : String(audioInShowSpec);
      yield put(setAudioUrl(audioOkay ? (audio ?? audioUrl) : null));

      if (!effectiveKeepCameraPose) {
        yield put(clearCameraPoseOverride() as any);
      }

      if (!keepPlayhead) {
        yield put(setPlaybackPosition(initialSeekTime ?? 0) as any);
      }
    } catch {
      console.error('Unexpected error while loading show');
    }
  }
}

/**
 * Main saga that simply launches a worker saga that watches a request
 * queue for shows to be loaded, and then starts feeding the worker with
 * requests to load shows.
 */
export default function* loaderSaga(): Generator<any, void, any> {
  const chan: Channel<ShowLoadingRequest> = yield call(channel);

  yield fork(loadShowFromRequestChannelSaga, chan);

  while (true) {
    const request = yield take(loadShowFromRequest.toString());
    const { show } = request.payload;
    if (show) {
      yield put(chan, request.payload);
    }
  }
}
