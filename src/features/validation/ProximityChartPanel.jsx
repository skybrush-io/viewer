import { connect } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import ChartPanel from './ChartPanel';

import {
  getNearestNeighborDistancesForFrames,
  getSampledTimeInstants,
} from './selectors';
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
    threshold: 3,
    thresholdLabel: 'Distance threshold',
    title: 'Proximity',
    verticalUnit: ' m',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
