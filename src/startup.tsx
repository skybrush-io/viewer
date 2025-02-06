import config from 'config';
import { Base64 } from 'js-base64';
import ky from 'ky';
import React from 'react';
import { createRoot } from 'react-dom/client';

import type { Pose } from '@skybrush/aframe-components/lib/spatial';

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
    show: async () =>
      ky
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
    show: async () => ky.get(manifest.show, {}).json(),
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
    return config.preloadedShow as ShowLoadingRequest;
  }
}

function parsePoseFromURLParam(value: string): Pose | null {
  let pose;

  try {
    pose = JSON.parse(Base64.decode(value));
  } catch {
    return null;
  }

  if (
    typeof pose === 'object' &&
    pose.p &&
    pose.q &&
    Array.isArray(pose.p) &&
    Array.isArray(pose.q) &&
    pose.p.length === 3 &&
    pose.q.length === 4 &&
    pose.p.every((x: any) => typeof x === 'number') &&
    pose.q.every((x: any) => typeof x === 'number')
  ) {
    return {
      position: pose.p,
      orientation: pose.q,
    };
  }

  return null;
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
    new SkybrushViewer().handleBrowserLocation().render('#root');
  }

  private _initialShow: ShowLoadingRequest | undefined = undefined;
  private readonly _initialShowExtra: Partial<ShowLoadingRequest> = {};

  configure(request: ShowLoadingRequest) {
    this._initialShow = request;
  }

  /**
   * Handles query arguments from the current location of the browser to
   * facilitate seeking to a known timestamp and other tricks that are achievable
   * via URL parameters.
   */
  handleBrowserLocation(location: string = window.location.href) {
    let url;

    if (!location) {
      return this;
    }

    try {
      url = new URL(location);
    } catch {
      console.warn('Failed to parse browser location:', location);
      return this;
    }

    const params = new URLSearchParams(url.search);
    for (const [key, value] of params.entries()) {
      if (key === 't') {
        const time = Number.parseFloat(value);
        if (time >= 0 && Number.isFinite(time)) {
          this._initialShowExtra.initialSeekTime = time;
        }
      }

      if (key === 'p') {
        const pose = parsePoseFromURLParam(value);
        if (pose) {
          this._initialShowExtra.initialCameraPose = pose;
        }
      }
    }

    return this;
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

    if (initialShow) {
      Object.assign(initialShow, this._initialShowExtra);
    }

    root.render(<App initialShow={initialShow} />);

    return root.unmount;
  }
}

export default SkybrushViewer;
