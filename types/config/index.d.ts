declare module 'config' {
  import type { ShowSpecification } from '@skybrush/show-format';

  // NOTE: We do need to allow `null` here in order to enable the
  //       "unsetting" of default values in configuration overrides.
  type Nullable<T> = T | null;

  export type Config = {
    buttons: {
      playbackHint: boolean;
    };

    electronBuilder?: {
      appId?: string;
      productName?: string;
    };

    io: {
      /** Specifies whether the user is allowed to load local files */
      localFiles: boolean;
    };

    language: {
      /** Default display language of the application. */
      default: string;
      /** Set of languages that should be shown in the selector. */
      enabled: string[];
      /** Fallback language to use for missing translations. */
      fallback: string;
    };

    modes: {
      /** Specifies whether the user is allowed to use the player module */
      player: boolean;

      /** Specifies whether the user is allowed to use the validation module */
      validation: boolean;

      /** Specifies whether the user is allowed to use the VR mode */
      vr: boolean;

      /** Whether the user is allowed to share a deep link to the show */
      deepLinking: boolean;
    };

    preloadedShow: {
      audio?: string;
      show?: () => Promise<ShowSpecification>;
    };

    /** Whether the app should start automatically */
    startAutomatically: boolean;

    /** Whether a welcome screen should be shown to the user after startup */
    useWelcomeScreen: boolean;
  };

  const config: Config;
  export default config;
}

declare module 'config-overrides' {
  import { type Config } from 'config';
  import { type PartialDeep } from 'type-fest';

  export type ConfigOverrides = PartialDeep<Config>;

  const overrides: ConfigOverrides;
  export default overrides;
}
