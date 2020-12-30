import { connect } from 'react-redux';

import { getSampledAltitudesForDrones } from '~/features/validation/selectors';

import ChartPanel from './ChartPanel';
import { createChartDataSelector } from './utils';

const getDataForAltitudeChart = createChartDataSelector(
  getSampledAltitudesForDrones
);

// Custom range to use for the chart panel. This prevents the annotations from
// affecting the range chosen by Chart.js but it will still allow the data to
// expand the range if needed.
const Y_RANGE = [0, 10];

export default connect(
  // mapStateToProps
  (state) => ({
    data: getDataForAltitudeChart(state),
    range: Y_RANGE,
    threshold: 150,
    thresholdLabel: 'Altitude threshold',
    verticalUnit: ' m',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
