import { connect } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import { getTimestampFormatter } from '~/features/show/selectors';

import ChartPanel from './ChartPanel';

import {
  getNearestNeighborDistancesForFrames,
  getProximityWarningThreshold,
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
    formatPlaybackTimestamp: getTimestampFormatter(state),
    threshold: getProximityWarningThreshold(state),
    thresholdLabel: 'Distance threshold',
    title: 'Proximity',
    verticalUnit: ' m',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
