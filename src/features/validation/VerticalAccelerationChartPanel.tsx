import { t } from 'i18next';
import { connect } from 'react-redux';

import { getTimestampFormatter } from '~/features/show/selectors';
import type { RootState } from '~/store';

import ChartPanel from './ChartPanel';
import {
  getSampledVerticalAccelerationsForDrones,
  getVerticalAccelerationThresholdDown,
  getVerticalAccelerationThresholdUp,
} from './selectors';
import { createChartDataSelector } from './utils';

const getDataForVerticalAccelerationChart = createChartDataSelector(
  getSampledVerticalAccelerationsForDrones
);

const maybeNegate = (x?: number) => (typeof x === 'number' ? -x : x);

// Custom range to use for the chart panel. This prevents the annotations from
// affecting the range chosen by Chart.js but it will still allow the data to
// expand the range if needed.
const Y_RANGE: [number, number] = [-1, 1];

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    data: getDataForVerticalAccelerationChart(state),
    formatPlaybackTimestamp: getTimestampFormatter(state),
    range: Y_RANGE,
    threshold: [
      getVerticalAccelerationThresholdUp(state),
      maybeNegate(getVerticalAccelerationThresholdDown(state)),
    ],
    thresholdLabel: t('validation.verticalAccelerationThreshold'),
    title: t('validation.verticalAcceleration'),
    verticalUnit: ' m/s²',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
