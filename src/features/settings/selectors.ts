import config from 'config';

export const shouldShowPlaybackHintButton = () => config.buttons.playbackHint;
export const shouldUseWelcomeScreen = () => config.useWelcomeScreen;
