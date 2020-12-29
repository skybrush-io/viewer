import { connect } from 'react-redux';

import { getSampledHorizontalVelocitiesForDrones } from '~/features/validation/selectors';

import ChartPanel from './ChartPanel';
import { createChartDataSelector } from './utils';

const getDataForHorizontalVelocityChart = createChartDataSelector(
  getSampledHorizontalVelocitiesForDrones
);

export default connect(
  // mapStateToProps
  (state) => ({
    data: getDataForHorizontalVelocityChart(state),
    threshold: 10,
    thresholdLabel: 'XY velocity threshold',
    verticalUnit: ' m/s',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
