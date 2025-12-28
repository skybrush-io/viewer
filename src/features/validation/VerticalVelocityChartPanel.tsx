import { t } from 'i18next';
import { connect } from 'react-redux';

import ChartPanel from '~/features/charts/ChartPanel';
import { getTimestampFormatter } from '~/features/show/selectors';
import type { RootState } from '~/store';

import {
  getSampledVerticalVelocitiesForDrones,
  getVerticalVelocityThresholdDown,
  getVerticalVelocityThresholdUp,
} from './selectors';
import { createChartSelectorFromSwarmRelatedSelector } from './utils';

const getVerticalVelocityChart = createChartSelectorFromSwarmRelatedSelector(
  getSampledVerticalVelocitiesForDrones
);

// Custom range to use for the chart panel. This prevents the annotations from
// affecting the range chosen by Chart.js but it will still allow the data to
// expand the range if needed.
const Y_RANGE: [number, number] = [-1, 1];

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    chart: getVerticalVelocityChart(state),
    formatPlaybackTimestamp: getTimestampFormatter(state),
    range: Y_RANGE,
    threshold: [
      getVerticalVelocityThresholdUp(state),
      -getVerticalVelocityThresholdDown(state),
    ],
    thresholdLabel: t('validation.verticalVelocityThreshold'),
    title: t('validation.verticalVelocity'),
    verticalUnit: ' m/s',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
