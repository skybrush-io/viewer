import {
  blue,
  green,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
} from '@mui/material/colors';

/**
 * Number of samples to take from trajectories per second for the validation.
 */
export const SAMPLES_PER_SECOND = 5;

/**
 * Colors to use on validation charts to indicate individual data series.
 */
export const CHART_COLORS = [
  blue,
  green,
  red,
  orange,
  pink,
  purple,
  lime,
  teal,
].map((color) => color[500]);

/**
 * Default validation settings for indoor and outdoor shows if the show file
 * does not specify validation settings.
 */
export const DEFAULT_VALIDATION_SETTINGS = {
  indoor: Object.freeze({
    maxAltitude: 6,
    maxVelocityXY: 2.5,
    maxVelocityZ: 1,
    minDistance: 0.5,
  }),
  outdoor: Object.freeze({
    maxAltitude: 150,
    maxVelocityXY: 10,
    maxVelocityZ: 2,
    minDistance: 3,
  }),
};
