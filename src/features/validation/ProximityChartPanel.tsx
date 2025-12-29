import { createSelector } from '@reduxjs/toolkit';
import { t } from 'i18next';
import { connect } from 'react-redux';

import AsyncChartPanel from '~/features/charts/AsyncChartPanel';
import { createChartPointsWithTips } from '~/features/charts/utils';
import { getLanguage } from '~/features/settings/selectors';
import {
  getNamesOfDronesInShow,
  getTimestampFormatter,
} from '~/features/show/selectors';
import type { RootState } from '~/store';

import workerApi, { type AsyncFnOptions } from '~/workers';
import {
  getProximityWarningThreshold,
  getSampledPositionsForDrones,
  getSampledTimeInstants,
} from './selectors';

const selectProximityChartGetter = createSelector(
  getLanguage,
  getSampledPositionsForDrones,
  getSampledTimeInstants,
  getNamesOfDronesInShow,
  (_language, positions, times, names) => async (options?: AsyncFnOptions) => {
    const [distances, indices] = await workerApi.getClosestPairsAndDistances(
      positions,
      times,
      options
    );
    return {
      datasets: [
        {
          label: t('validation.distanceOfClosestDronePair'),
          values: createChartPointsWithTips(
            times,
            distances,
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
    formatPlaybackTimestamp: getTimestampFormatter(state),
    fn: selectProximityChartGetter(state),
    range: Y_RANGE,
    threshold: getProximityWarningThreshold(state),
    thresholdLabel: t('validation.distanceThreshold'),
    title: t('validation.proximity'),
    verticalUnit: ' m',
  }),
  // mapDispatchToProps
  {}
)(AsyncChartPanel);
