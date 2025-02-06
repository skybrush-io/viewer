/**
 * @file Default application configuration at startup when running as a web app.
 */

import { type ConfigOverrides } from 'config-overrides';

const overrides: ConfigOverrides = {
  buttons: {
    playbackHint: true,
  },
  io: {
    localFiles: false,
  },
  modes: {
    deepLinking: true,
    validation: false,
  },
  startAutomatically: false,
  useWelcomeScreen: false,
};

export default overrides;
