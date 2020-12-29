import { connect } from 'react-redux';

import { getSampledAltitudesForDrones } from '~/features/validation/selectors';

import ChartPanel from './ChartPanel';
import { createChartDataSelector } from './utils';

const getDataForAltitudeChart = createChartDataSelector(
  getSampledAltitudesForDrones
);

export default connect(
  // mapStateToProps
  (state) => ({
    data: getDataForAltitudeChart(state),
    threshold: 150,
    thresholdLabel: 'Altitude threshold',
    verticalUnit: ' m',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
