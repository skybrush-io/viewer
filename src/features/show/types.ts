import type { Pose } from '@skybrush/aframe-components/lib/spatial';
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
   * Whether to keep the current camera pose of the playback window. Useful
   * when updating the show from the Blender plugin.
   *
   * When unspecified, it is synced with the value of the `keepPlayhead`
   * property.
   */
  keepCameraPose?: boolean;

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

  /**
   * Specifies the timestamp to seek to when the show is loaded, in seconds.
   * Ignored if `keepPlayhead` is `true`.
   */
  initialSeekTime?: number;

  /**
   * Specifies the initial pose of the camera, overriding the default camera
   * in the show.
   */
  initialCameraPose?: Pose;
}
