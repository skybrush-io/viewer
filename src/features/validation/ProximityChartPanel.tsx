import { connect } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import {
  getNamesOfDronesInShow,
  getTimestampFormatter,
} from '~/features/show/selectors';
import type { RootState } from '~/store';

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
          // TODO(ntamas): it would be great if we could calculate the tooltip
          // lazily, only when the user hovers over the chart
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
  (state: RootState) => ({
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
