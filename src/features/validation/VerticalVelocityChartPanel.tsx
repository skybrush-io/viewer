import { connect } from 'react-redux';

import { getTimestampFormatter } from '~/features/show/selectors';
import type { RootState } from '~/store';

import ChartPanel from './ChartPanel';
import {
  getSampledVerticalVelocitiesForDrones,
  getVerticalVelocityThresholdDown,
  getVerticalVelocityThresholdUp,
} from './selectors';
import { createChartDataSelector } from './utils';

const getDataForVerticalVelocityChart = createChartDataSelector(
  getSampledVerticalVelocitiesForDrones
);

// Custom range to use for the chart panel. This prevents the annotations from
// affecting the range chosen by Chart.js but it will still allow the data to
// expand the range if needed.
const Y_RANGE: [number, number] = [-1, 1];

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    data: getDataForVerticalVelocityChart(state),
    formatPlaybackTimestamp: getTimestampFormatter(state),
    range: Y_RANGE,
    threshold: [
      getVerticalVelocityThresholdUp(state),
      -getVerticalVelocityThresholdDown(state),
    ],
    thresholdLabel: 'Z velocity threshold',
    title: 'Vertical velocities',
    verticalUnit: ' m/s',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
