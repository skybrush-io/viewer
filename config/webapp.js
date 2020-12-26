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
    validation: true,
    vr: true,
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
