import { connect } from 'react-redux';

import { getSampledVerticalVelocitiesForDrones } from '~/features/validation/selectors';

import ChartPanel from './ChartPanel';
import { createChartDataSelector } from './utils';

const getDataForVerticalVelocityChart = createChartDataSelector(
  getSampledVerticalVelocitiesForDrones
);

// Custom range to use for the chart panel. This prevents the annotations from
// affecting the range chosen by Chart.js but it will still allow the data to
// expand the range if needed.
const Y_RANGE = [-1, 1];

export default connect(
  // mapStateToProps
  (state) => ({
    data: getDataForVerticalVelocityChart(state),
    range: Y_RANGE,
    threshold: 3,
    thresholdIsAbsolute: true,
    thresholdLabel: 'Z velocity threshold',
    verticalUnit: ' m/s',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);