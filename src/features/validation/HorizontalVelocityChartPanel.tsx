import { t } from 'i18next';
import { connect } from 'react-redux';

import { getTimestampFormatter } from '~/features/show/selectors';
import type { RootState } from '~/store';

import ChartPanel from '~/features/charts/ChartPanel';
import {
  getHorizontalVelocityThreshold,
  getSampledHorizontalVelocitiesForDrones,
} from './selectors';
import { createChartSelectorFromSwarmRelatedSelector } from './utils';

const getHorizontalVelocityChart = createChartSelectorFromSwarmRelatedSelector(
  getSampledHorizontalVelocitiesForDrones
);

// Custom range to use for the chart panel. This prevents the annotations from
// affecting the range chosen by Chart.js but it will still allow the data to
// expand the range if needed.
const Y_RANGE: [number, number] = [0, 1];

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    chart: getHorizontalVelocityChart(state),
    formatPlaybackTimestamp: getTimestampFormatter(state),
    range: Y_RANGE,
    threshold: getHorizontalVelocityThreshold(state),
    thresholdLabel: t('validation.horizontalVelocityThreshold'),
    title: t('validation.horizontalVelocity'),
    verticalUnit: ' m/s',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
