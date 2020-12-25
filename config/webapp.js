/**
 * @file Default application configuration at startup.
 */

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
    audioUrl: require('~/../assets/shows/demo.mp3').default,
    data: import(
      /* webpackChunkName: "show" */ '~/../assets/shows/demo.json'
    ).then((module) => module.default),
  },
  useWelcomeScreen: false,
};

export default config;
