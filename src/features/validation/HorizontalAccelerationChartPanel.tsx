import { t } from 'i18next';
import { connect } from 'react-redux';

import { getTimestampFormatter } from '~/features/show/selectors';
import type { RootState } from '~/store';

import ChartPanel from './ChartPanel';
import {
  getHorizontalAccelerationThreshold,
  getSampledHorizontalAccelerationsForDrones,
} from './selectors';
import { createChartDataSelector } from './utils';

const getDataForHorizontalAccelerationChart = createChartDataSelector(
  getSampledHorizontalAccelerationsForDrones
);

// Custom range to use for the chart panel. This prevents the annotations from
// affecting the range chosen by Chart.js but it will still allow the data to
// expand the range if needed.
const Y_RANGE: [number, number] = [-1, 1];

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    data: getDataForHorizontalAccelerationChart(state),
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
