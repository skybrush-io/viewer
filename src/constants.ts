/**
 * Number of frames per second to use for the playback slider.
 *
 * Note that the .skyc format itself does not have a concept of "frames". This
 * is just a convenience constant for the playback slider and it also defines
 * the smallest possible adjustment to the playback position.
 */
export const PLAYBACK_FPS = 25;

/**
 * Downscaling factor for indoor drones.
 *
 * The default setting for the drone size in the settings slice is always 1.0.
 * This setting is a multiplier to ensure that the default size "looks good" in
 * an indoor setting. For instance, a value of 0.15 means that in an indoor
 * setup, the drone will have a radius of 0.15 m, i.e. a diameter of 30 cm.
 */
export const INDOOR_DRONE_SIZE_SCALING_FACTOR = 0.15;

/**
 * Downscaling factor for outdoor drones.
 *
 * The default setting for the drone size in the settings slice is always 1.0.
 * This setting is a multiplier to ensure that the default size "looks good" in
 * an outdoor setting.
 */
export const OUTDOOR_DRONE_SIZE_SCALING_FACTOR = 0.75;

/**
 * Placeholder to use for the label of the default camera. Will be replaced
 * when the camera label is formatted to use an appropriate localized label.
 */
export const DEFAULT_CAMERA_NAME_PLACEHOLDER = '$DEFAULT';

/**
 * Placeholder to use for the label of the camera that originates from a
 * sharing request where the URL includes a camera pose. Will be replaced
 * when the camera label is formatted to use an appropriate localized label.
 */
export const SHARED_CAMERA_NAME_PLACEHOLDER = '$SHARED';

/**
 * Default drone model to use in 3D views.
 */
export const DEFAULT_DRONE_MODEL = 'sphere';
