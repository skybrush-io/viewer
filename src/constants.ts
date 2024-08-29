/**
 * Radius of a single drone in meters in an outdoor setting.
 */
export const DEFAULT_DRONE_RADIUS = 0.75;

/**
 * Downscaling factor for indoor drones, based on the default drone radius
 * for an outdoor setting.
 */
export const INDOOR_DRONE_SIZE_SCALING_FACTOR = 0.2;

/**
 * Placeholder to use for the label of the default camera. Will be replaced
 * when the camera label is formatted to use an appropriate localized label.
 */
export const DEFAULT_CAMERA_NAME_PLACEHOLDER = '$DEFAULT';

/**
 * Default drone model to use in 3D views.
 */
export const DEFAULT_DRONE_MODEL = 'sphere';
