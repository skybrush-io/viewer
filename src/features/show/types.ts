import type { ShowSpecification } from '@skybrush/show-format';

/**
 * Request encapsulating all information needed to load a show from a
 * specification object, optionally accompanied with audio.
 */
export interface ShowLoadingRequest {
  /** URL of the audio corresponding to the show, if any */
  audio?: string;

  /** The show to load */
  show: ShowSpecification | (() => Promise<ShowSpecification>);

  /**
   * Whether to keep the playhead of the playback window at its current
   * location. Useful when updating the show from the Blender plugin.
   */
  keepPlayhead?: boolean;

  /**
   * Specifies whether the audio is optional (i.e. it is not an error if the
   * audio URL does not point anywhere).
   */
  missingAudioIsOkay?: boolean;
}
