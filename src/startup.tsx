import config from 'config';
import ky from 'ky';
import React from 'react';
import { createRoot } from 'react-dom/client';

import type { ShowLoadingRequest } from './features/show/types';

import App from './app';

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
  const PATHNAME_REGEX = /^\/s\/([-\w]+)\/?$/;
  const match = PATHNAME_REGEX.exec(url.pathname);
  if (match) {
    return match[1] === 'test'
      ? new URL('https://share.skybrush.io/s/itu-2019/')
      : url;
  }

  return undefined;
}

/**
 * Creates a show loading request to load a show from a root URL where it
 * is assumed that the show content and the audio file (optional) are to be
 * found at `show.json` and `music.mp3`, both relative to the root URL.
 *
 * @param url  the root URL
 * @returns an appropriately constructed show loading request
 */
function createShowLoadingRequestFromRootUrl(
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

type ShowManifest = {
  show: string;
  audio?: string;
};

function isShowManifest(object: any): object is ShowManifest {
  return (
    typeof object === 'object' &&
    typeof object.show === 'string' &&
    (object.audio === undefined ||
      object.audio === null ||
      typeof object.audio === 'string')
  );
}

/**
 * Creates a show loading request to load a show from a URL pointing to a show
 * manifest JSON object that contains two keys: `show` (URL of the show content)
 * and `audio` (URL of the audio file). `audio` is optional.
 *
 * @param url  the URL of the manifest
 * @returns an appropriately constructed show loading request
 */
async function createShowLoadingRequestFromManifestUrl(
  url: string | URL
): Promise<ShowLoadingRequest> {
  const now = Date.now();
  const manifest = await ky.get(url).json();

  if (!isShowManifest(manifest)) {
    throw new Error('Response is not a show manifest');
  }

  return {
    audio: manifest.audio,
    missingAudioIsOkay: true,
    show: ky.get(manifest.show, {}).json(),
  };
}

function getInitialShowLoadingRequest(): ShowLoadingRequest | undefined {
  const rootUrl = deriveShowFileRootUrl();
  if (rootUrl) {
    // looks like we are running on share.skybrush.io so let's load the show
    // file from the same folder where we are
    return createShowLoadingRequestFromRootUrl(rootUrl);
  }

  // This is outside share.skybrush.io so just load a bundled demo show or
  // just do nothing
  const hasPreloadedShow = Boolean(config.preloadedShow?.show);
  if (hasPreloadedShow) {
    return config.preloadedShow! as ShowLoadingRequest;
  }
}

/**
 * The main class exported from the bundle to let the hosting page decide
 * how it should interact with the application itself.
 */
export class SkybrushViewer {
  /**
   * Convenience method for the most common use-case of this class: find the
   * #root div on the page and inject Skybrush Viewer into it.
   */
  static run() {
    new SkybrushViewer().render('#root');
  }

  private _initialShow: ShowLoadingRequest | undefined = undefined;

  configure(request: ShowLoadingRequest) {
    this._initialShow = request;
  }

  async loadFromManifestUrl(url: string | URL) {
    this._initialShow = await createShowLoadingRequestFromManifestUrl(url);
  }

  loadFromRootUrl(url: string | URL) {
    this._initialShow = createShowLoadingRequestFromRootUrl(url);
  }

  render(selector: string): () => void {
    const element = document.querySelector(selector);
    const root = createRoot(element!);
    const initialShow = this._initialShow ?? getInitialShowLoadingRequest();
    root.render(<App initialShow={initialShow} />);
    return root.unmount;
  }
}

export default SkybrushViewer;
