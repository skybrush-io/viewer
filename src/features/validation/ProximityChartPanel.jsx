import { connect } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import {
  getNamesOfDronesInShow,
  getTimestampFormatter,
} from '~/features/show/selectors';

import ChartPanel from './ChartPanel';

import {
  getNearestNeighborsAndDistancesForFrames,
  getProximityWarningThreshold,
  getSampledTimeInstants,
} from './selectors';
import { createChartPointsWithTips } from './utils';

const getDataForProximityChart = createSelector(
  getSampledTimeInstants,
  getNearestNeighborsAndDistancesForFrames,
  getNamesOfDronesInShow,
  (times, distancesAndIndices, names) => {
    const distances = distancesAndIndices[0];
    const indices = distancesAndIndices[1];
    return [
      {
        label: 'Distance of closest drone pair',
        values: createChartPointsWithTips(
          times,
          distances,
          indices.map((pair) =>
            pair ? `${names[pair[0]]}\u2013${names[pair[1]]}` : null
          )
        ),
      },
    ];
  }
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
