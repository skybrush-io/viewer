/**
 * Saga that loads the default hardcoded drone show when the app is started.
 */

import config from 'config';
import get from 'lodash-es/get';
import ky from 'ky';
import { Channel, channel } from 'redux-saga';
import { call, fork, put, putResolve, take } from 'redux-saga/effects';
import { freeze } from '@reduxjs/toolkit';

import { setAudioUrl } from '~/features/audio/slice';
import { rewind } from '~/features/playback/actions';
import { loadShow } from '~/features/show/async';
import { loadShowFromObject } from '~/features/show/slice';

const PATHNAME_REGEX = /^\/s\/(?<id>[-\w]+)\/?$/;

interface LoaderChannelEntry {
  audio?: string;
  show: any;
  keepPlayhead?: boolean;
  missingAudioIsOkay?: boolean;
}

/**
 * Saga that watches a channel where it receives data sources to load a drone
 * show from. When a new source is received, it starts loading the show and
 * its audio in parallel, and returns to watching the queue when the show is
 * loaded successfully.
 */
function* loadShowFromRequestChannelSaga(
  chan: Channel<LoaderChannelEntry>
): Generator<any, void, any> {
  while (true) {
    const { audio, keepPlayhead, missingAudioIsOkay, show } = (yield take(
      chan
    )) as LoaderChannelEntry;

    try {
      let audioOkay = true;

      if (audio && missingAudioIsOkay) {
        try {
          const audioResponse = yield call(ky.head, audio);
          audioOkay = audioResponse.ok;
        } catch {
          audioOkay = false;
        }
      }

      const { payload: showSpec } = yield putResolve(
        loadShow(freeze(show)) as any
      );
      const audioInShowSpec = get(showSpec, 'media.audio.url');
      yield put(setAudioUrl(audioOkay ? audio ?? audioInShowSpec : null));

      if (!keepPlayhead) {
        yield put(rewind() as any);
      }
    } catch {
      console.error('Unexpected error while loading show');
    }
  }
}

/**
 * Derives the location of the show JSON file when we are running on
 * share.skybrush.io and the user has visited a shared show URL.
 *
 * @param href the URL that the user has visited in the browser;
 *        defaults to `window.location.href` when omitted.
 * @return an object with `audio` and `show` keys, corresponding to
 *         the location of the audio file and the show file, or `undefined` if
 *         the given URL does not look like the location of a shared show.
 */
function deriveShowFileUrls(href?: string) {
  if (href === undefined) {
    href = window.location.href;
  }

  const url = new URL(href);
  const match = PATHNAME_REGEX.exec(url.pathname);
  if (match) {
    const now = Date.now();

    if (match.groups?.id === 'test') {
      return {
        show: `https://share.skybrush.io/s/itu-2019/show.json?t=${now}`,
      };
    }

    return {
      audio: new URL(`music.mp3?t=${now}`, url).toString(),
      show: new URL(`show.json?t=${now}`, url).toString(),
    };
  }

  return undefined;
}

/**
 * Main saga that simply launches a worker saga that watches a request
 * queue for shows to be loaded, and then starts feeding the worker with
 * requests to load shows.
 */
export default function* loaderSaga(): Generator<any, void, any> {
  const chan: Channel<LoaderChannelEntry> = yield call(channel);

  yield fork(loadShowFromRequestChannelSaga, chan);
  const derivedUrls = deriveShowFileUrls();
  if (derivedUrls) {
    // looks like we are running on share.skybrush.io so let's load the show
    // file from the same folder where we are
    yield put(chan, {
      audio: derivedUrls.audio,
      missingAudioIsOkay: true,
      show: ky
        .get(derivedUrls.show, {
          /* onDownloadProgress: (progress) => {
            // TODO(ntamas): this is problematic because ky will report the
            // uncompressed size but the Content-Length header contains the
            // compressed size so we eventually run above 100%.
            // console.log(`${progress.percent * 100}% - ${progress.transferredBytes} of ${progress.totalBytes} bytes`);
          } */
        })
        .json(),
    });
  } else {
    // This is outside share.skybrush.io so just load a bundled demo show or
    // just do nothing
    const hasPreloadedShow = Boolean(config.preloadedShow?.data);
    if (hasPreloadedShow) {
      yield put(chan, {
        audio: config.preloadedShow!.audioUrl,
        show: config.preloadedShow!.data,
      });
    }
  }

  while (true) {
    const request = yield take(loadShowFromObject.toString());
    const { show } = request.payload;
    if (show) {
      yield put(chan, request.payload);
    }
  }
}
