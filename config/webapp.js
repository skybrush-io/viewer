/**
 * @file Default application configuration at startup.
 */

const config = {
  buttons: {
    playbackHint: true,
    vr: true,
  },
  io: {},
  preloadedShow: {
    audioUrl: require('~/../assets/shows/demo.mp3').default,
    data: import(
      /* webpackChunkName: "show" */ '~/../assets/shows/demo.json'
    ).then((module) => module.default),
  },
  useWelcomeScreen: false,
};

export default config;
