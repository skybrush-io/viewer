import { t } from 'i18next';
import { connect } from 'react-redux';

import { getTimestampFormatter } from '~/features/show/selectors';
import type { RootState } from '~/store';

import ChartPanel from '~/features/charts/ChartPanel';
import {
  getHorizontalAccelerationThreshold,
  selectSampledHorizontalAccelerationGetter,
} from './selectors';
import { createChartSelectorFromDroneRelatedSelector } from './utils';

const getHorizontalAccelerationChart =
  createChartSelectorFromDroneRelatedSelector(
    selectSampledHorizontalAccelerationGetter
  );

// Custom range to use for the chart panel. This prevents the annotations from
// affecting the range chosen by Chart.js but it will still allow the data to
// expand the range if needed.
const Y_RANGE: [number, number] = [-1, 1];

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    chart: getHorizontalAccelerationChart(state),
    formatPlaybackTimestamp: getTimestampFormatter(state),
    range: Y_RANGE,
    threshold: getHorizontalAccelerationThreshold(state),
    thresholdLabel: t('validation.horizontalAccelerationThreshold'),
    title: t('validation.horizontalAcceleration'),
    verticalUnit: ' m/s²',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
