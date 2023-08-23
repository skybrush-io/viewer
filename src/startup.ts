import config from 'config';
import ky from 'ky';

import { loadShowFromRequest } from './features/show/slice';
import type { ShowLoadingRequest } from './features/show/types';
import type { AppDispatch } from './store';

const PATHNAME_REGEX = /^\/s\/(?<id>[-\w]+)\/?$/;

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

function getInitialShowLoadingRequest(): ShowLoadingRequest | undefined {
  const derivedUrls = deriveShowFileUrls();
  if (derivedUrls) {
    // looks like we are running on share.skybrush.io so let's load the show
    // file from the same folder where we are
    return {
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
    };
  }

  // This is outside share.skybrush.io so just load a bundled demo show or
  // just do nothing
  const hasPreloadedShow = Boolean(config.preloadedShow?.show);
  if (hasPreloadedShow) {
    return config.preloadedShow! as ShowLoadingRequest;
  }
}

/**
 * Loads the initial show file of the application, depending on its configuration
 * and execution environment.
 */
export const loadInitialShow = (dispatch: AppDispatch) => {
  const request = getInitialShowLoadingRequest();
  if (request) {
    dispatch(loadShowFromRequest(request));
  }
};
