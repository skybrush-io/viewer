/**
 * @file Default application configuration at startup to run a local hardcoded demo.
 */

import type { ShowSpecification } from '@skybrush/show-format';
import { type ConfigOverrides } from 'config-overrides';

import audio from '~/../assets/shows/demo.mp3';

const show = async (): Promise<ShowSpecification> =>
  import(
    /* webpackChunkName: "show" */ '~/../assets/shows/demo.json'
  ) as unknown as ShowSpecification;

const overrides: ConfigOverrides = {
  buttons: {
    playbackHint: true,
  },
  electronBuilder: {
    productName: 'Skybrush Viewer Demo',
  },
  io: {
    localFiles: false,
  },
  modes: {
    deepLinking: true,
    validation: false,
  },
  preloadedShow: {
    audio,
    show,
  },
  useWelcomeScreen: false,
};

export default overrides;
