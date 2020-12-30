import { connect } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import ChartPanel from './ChartPanel';

import {
  getNearestNeighborDistancesForFrames,
  getSampledTimeInstants,
} from '~/features/validation/selectors';

import { createChartPoints } from './utils';

const getDataForProximityChart = createSelector(
  getSampledTimeInstants,
  getNearestNeighborDistancesForFrames,
  (times, distances) => [
    {
      label: 'Distance of closest drone pair',
      values: createChartPoints(times, distances),
    },
  ]
);

export default connect(
  // mapStateToProps
  (state) => ({
    data: getDataForProximityChart(state),
    verticalUnit: ' m',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
