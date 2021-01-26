import { connect } from 'react-redux';

import ChartPanel from './ChartPanel';
import {
  getHorizontalVelocityThreshold,
  getSampledHorizontalVelocitiesForDrones,
} from './selectors';
import { createChartDataSelector } from './utils';

const getDataForHorizontalVelocityChart = createChartDataSelector(
  getSampledHorizontalVelocitiesForDrones
);

// Custom range to use for the chart panel. This prevents the annotations from
// affecting the range chosen by Chart.js but it will still allow the data to
// expand the range if needed.
const Y_RANGE = [0, 1];

export default connect(
  // mapStateToProps
  (state) => ({
    data: getDataForHorizontalVelocityChart(state),
    range: Y_RANGE,
    threshold: getHorizontalVelocityThreshold(state),
    thresholdLabel: 'XY velocity threshold',
    title: 'Horizontal velocities',
    verticalUnit: ' m/s',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
