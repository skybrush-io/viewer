/* eslint-disable unicorn/prefer-top-level-await */
/**
 * @file Default application configuration at startup to run a local hardcoded demo.
 */

import music from '~/../assets/shows/demo.mp3';

const config = {
  electronBuilder: {
    productName: 'Skybrush Viewer Demo',
  },
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
    audio: music,
    show: import(
      /* webpackChunkName: "show" */ '~/../assets/shows/demo.json'
    ).then((module) => module.default),
  },
  useWelcomeScreen: false,
};

export default config;
