/**
 * Saga that loads the default hardcoded drone show when the app is started.
 */

import { put } from 'redux-saga/effects';

import { setAudioUrl } from '~/features/audio/slice';
import { loadShow } from '~/features/show/async';

const music = require('~/../assets/shows/demo.mp3').default;

/**
 * Saga that loads the default hardcoded drone show when the app is started.
 */
export default function* loaderSaga() {
  const promise = import(
    /* webpackChunkName: "show" */ '~/../assets/shows/demo.json'
  ).then(module => module.default);

  yield put(setAudioUrl(music));
  yield put(loadShow(promise));
}
