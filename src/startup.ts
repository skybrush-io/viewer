import config from 'config';
import ky from 'ky';

import type { ShowLoadingRequest } from './features/show/types';

/**
 * Derives the common root of the location of the show JSON file and the audio
 * file when we are running on share.skybrush.io and the user has visited a
 * shared show URL.
 *
 * @param href the URL that the user has visited in the browser;
 *        defaults to `window.location.href` when omitted.
 * @return the root URL that can be passed on to getShowLoadingRequestFromRootURL()
 *         to obtain a show loading request, or `undefined` if the given URL
 *         does not look like the location of a shared show.
 */
function deriveShowFileRootUrl(href?: string): URL | undefined {
  if (href === undefined) {
    href = window.location.href;
  }

  const url = new URL(href);
  const PATHNAME_REGEX = /^\/s\/(?<id>[-\w]+)\/?$/;
  const match = PATHNAME_REGEX.exec(url.pathname);
  if (match) {
    return match.groups?.id === 'test'
      ? new URL('https://share.skybrush.io/s/itu-2019/')
      : url;
  }

  return undefined;
}

export function getShowLoadingRequestFromRootUrl(
  url: string | URL
): ShowLoadingRequest {
  const now = Date.now();

  return {
    audio: new URL(`music.mp3?t=${now}`, url).toString(),
    missingAudioIsOkay: true,
    show: ky
      .get(new URL(`show.json?t=${now}`, url).toString(), {
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

export function getInitialShowLoadingRequest(): ShowLoadingRequest | undefined {
  const rootUrl = deriveShowFileRootUrl();
  if (rootUrl) {
    // looks like we are running on share.skybrush.io so let's load the show
    // file from the same folder where we are
    return getShowLoadingRequestFromRootUrl(rootUrl);
  }

  // This is outside share.skybrush.io so just load a bundled demo show or
  // just do nothing
  const hasPreloadedShow = Boolean(config.preloadedShow?.show);
  if (hasPreloadedShow) {
    return config.preloadedShow! as ShowLoadingRequest;
  }
}
