/**
 * @file Baseline values for the configuration options of the application.
 */

import { type Config } from 'config';

const baseline: Config = {
  buttons: {
    playbackHint: false,
    reload: true,
  },
  io: {
    localFiles: true,
  },
  language: {
    default: 'en',
    enabled: ['en', 'hu', 'zh-Hans'],
    fallback: 'en',
  },
  modes: {
    deepLinking: false,
    player: true,
    validation: true,
    vr: false,
  },
  preloadedShow: {},
  startAutomatically: true,
  useWelcomeScreen: true,
};

export default baseline;
