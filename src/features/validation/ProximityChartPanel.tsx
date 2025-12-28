import { createSelector } from '@reduxjs/toolkit';
import { t } from 'i18next';
import { connect } from 'react-redux';

import ChartPanel from '~/features/charts/ChartPanel';
import { createChartPointsWithTips } from '~/features/charts/utils';
import { getLanguage } from '~/features/settings/selectors';
import {
  getNamesOfDronesInShow,
  getTimestampFormatter,
} from '~/features/show/selectors';
import type { RootState } from '~/store';

import {
  getNearestNeighborsAndDistancesForFrames,
  getProximityWarningThreshold,
  getSampledTimeInstants,
} from './selectors';

const getProximityChart = createSelector(
  getLanguage,
  getSampledTimeInstants,
  getNearestNeighborsAndDistancesForFrames,
  getNamesOfDronesInShow,
  (_language, times, distancesAndIndices, names) => {
    const distances = distancesAndIndices[0];
    const indices = distancesAndIndices[1];
    return {
      datasets: [
        {
          label: t('validation.distanceOfClosestDronePair'),
          values: createChartPointsWithTips(
            times,
            distances,
            // TODO(ntamas): it would be great if we could calculate the tooltip
            // lazily, only when the user hovers over the chart
            indices.map((pair) =>
              pair ? `${names[pair[0]]}\u2013${names[pair[1]]}` : undefined
            )
          ),
        },
      ],
    };
  }
);

// Custom range to use for the chart panel. This prevents the annotations from
// affecting the range chosen by Chart.js but it will still allow the data to
// expand the range if needed. A minimum value of zero is enforced to ensure that
// the Y axis starts at zero.
const Y_RANGE: [number, number] = [0, 1];

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    chart: getProximityChart(state),
    formatPlaybackTimestamp: getTimestampFormatter(state),
    range: Y_RANGE,
    threshold: getProximityWarningThreshold(state),
    thresholdLabel: t('validation.distanceThreshold'),
    title: t('validation.proximity'),
    verticalUnit: ' m',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
