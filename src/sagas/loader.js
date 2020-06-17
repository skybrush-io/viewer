/**
 * Saga that loads the default hardcoded drone show when the app is started.
 */

import config from 'config';
import get from 'lodash-es/get';
import ky from 'ky';
import { channel } from 'redux-saga';
import { call, fork, put, putResolve, take } from 'redux-saga/effects';

import { setAudioUrl } from '~/features/audio/slice';
import { loadShow } from '~/features/show/async';
import { requestToLoadShow } from '~/features/show/slice';

const PATHNAME_REGEX = /^\/s\/([-\w]+)\/?$/;

/**
 * Saga that watches a channel where it receives data sources to load a drone
 * show from. When a new source is received, it starts loading the show and
 * its audio in parallel, and returns to watching the queue when the show is
 * loaded successfully.
 */
function* loadShowFromRequestChannelSaga(chan) {
  while (true) {
    const { audio, show } = yield take(chan);

    const { payload: showSpec } = yield putResolve(loadShow(show));
    const audioInShowSpec = get(showSpec, 'media.audio.url');
    yield put(setAudioUrl(audio || audioInShowSpec));
  }
}

/**
 * Main saga that simply launches a worker saga that watches a request
 * queue for shows to be loaded, and then starts feeding the worker with
 * requests to load shows.
 */
export default function* loaderSaga() {
  const chan = yield call(channel);

  yield fork(loadShowFromRequestChannelSaga, chan);

  const { href } = window.location;
  const url = new URL(href);
  const match = url.pathname.match(PATHNAME_REGEX);
  if (match) {
    // looks like we are running on share.skybrush.io so let's load the show
    // file from the same folder where we are
    yield put(chan, {
      audio: new URL('music.mp3', url).toString(),
      show: ky.get('show.json', { prefix: url }).json(),
    });
  } else {
    // This is outside share.skybrush.io so just load a bundled demo show or
    // just do nothing
    const hasPreloadedShow = config.preloadedShow && config.preloadedShow.data;
    if (hasPreloadedShow) {
      yield put(chan, {
        audio: config.preloadedShow.audioUrl,
        show: config.preloadedShow.data,
      });
    }
  }

  while (true) {
    const request = yield take(requestToLoadShow.toString());
    const show = request.payload;

    if (show) {
      yield put(chan, { show });
    }
  }
}
