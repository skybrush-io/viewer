/**
 * @file Baseline values for the configuration options of the application.
 */

import { type Config } from 'config';

const baseline: Config = {
  buttons: {
    playbackHint: false,
  },
  io: {
    localFiles: true,
  },
  language: {
    default: 'en',
    enabled: ['en', 'hu'],
    fallback: 'en',
  },
  modes: {
    player: true,
    validation: true,
    vr: false,
  },
  preloadedShow: {},
  startAutomatically: true,
  useWelcomeScreen: true,
};

export default baseline;
