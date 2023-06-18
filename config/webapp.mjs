/* eslint-disable unicorn/prefer-top-level-await */
/**
 * @file Default application configuration at startup.
 */

import music from '~/../assets/shows/demo.mp3';

const config = {
  buttons: {
    playbackHint: true,
  },
  io: {},
  modes: {
    player: true,
    validation: false,
    vr: false, // advanced-camera-controls is not VR-friendly yet
  },
  preloadedShow: {
    audioUrl: music,
    data: import(
      /* webpackChunkName: "show" */ '~/../assets/shows/demo.json'
    ).then((module) => module.default),
  },
  useWelcomeScreen: false,
};

export default config;
