import {
  blue,
  green,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
} from '@material-ui/core/colors';

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
