/**
 * @file Default application configuration at startup when running as a web app.
 */

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
  useWelcomeScreen: false,
};

export default config;
