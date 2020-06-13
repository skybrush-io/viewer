/**
 * Saga that loads the default hardcoded drone show when the app is started.
 */

import config from 'config';
import ky from 'ky';
import { all, call, put } from 'redux-saga/effects';

import { setAudioUrl } from '~/features/audio/slice';
import { loadShow } from '~/features/show/async';

const PATHNAME_REGEX = /^\/s\/([-\w]+)\/?$/;

/**
 * Saga that loads the default hardcoded drone show when the app is started,
 * or figures out the show file to load if the URL has a certain form.
 */
export default function* loaderSaga() {
  let audioUrl;
  let showDataPromise;

  const { href } = window.location;
  const url = new URL(href);
  const match = url.pathname.match(PATHNAME_REGEX);
  if (match) {
    // looks like we are running on share.skybrush.io so let's load the show
    // file from the same folder where we are
    audioUrl = new URL('music.mp3', url).toString();
    showDataPromise = ky.get('show.json', { prefix: url }).json();
  } else {
    // This is outside share.skybrush.io so just load a bundled demo show or
    // just do nothing
    audioUrl = config.preloadedShow.audioUrl;
    showDataPromise = config.preloadedShow.data;
  }

  // Start loading the show and the audio in parallel
  yield all([put(loadShow(showDataPromise)), loadAudioSaga(audioUrl)]);
}

/**
 * Saga that loads the audio file from the given URL.
 */
function* loadAudioSaga(url) {
  // Check whether the audio URL exists; if it returns an error code, don't
  // even try to set the audio URL.
  const response = yield call(() =>
    ky.head(url, {
      throwHttpErrors: false,
    })
  );

  if (response && response.ok) {
    yield put(setAudioUrl(url));
  }
}
