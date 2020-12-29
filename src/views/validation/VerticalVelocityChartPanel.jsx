import { connect } from 'react-redux';

import { getSampledVerticalVelocitiesForDrones } from '~/features/validation/selectors';

import ChartPanel from './ChartPanel';
import { createChartDataSelector } from './utils';

const getDataForVerticalVelocityChart = createChartDataSelector(
  getSampledVerticalVelocitiesForDrones
);

export default connect(
  // mapStateToProps
  (state) => ({
    data: getDataForVerticalVelocityChart(state),
    threshold: 3,
    thresholdIsAbsolute: true,
    thresholdLabel: 'Z velocity threshold',
    verticalUnit: ' m/s',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
