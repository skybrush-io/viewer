import { t } from 'i18next';
import { connect } from 'react-redux';

import ChartPanel from '~/features/charts/ChartPanel';
import { getTimestampFormatter } from '~/features/show/selectors';
import type { RootState } from '~/store';

import {
  getYawRateWarningThreshold,
  selectSampledYawRateGetter,
} from './selectors';
import { createChartSelectorFromDroneRelatedSelector } from './utils';

const getYawRateChart = createChartSelectorFromDroneRelatedSelector(
  selectSampledYawRateGetter
);
const maybeNegate = (x?: number) => (typeof x === 'number' ? -x : x);

// Custom range to use for the chart panel. This prevents the annotations from
// affecting the range chosen by Chart.js but it will still allow the data to
// expand the range if needed.
const Y_RANGE: [number, number] = [-1, 1];

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    chart: getYawRateChart(state),
    formatPlaybackTimestamp: getTimestampFormatter(state),
    range: Y_RANGE,
    threshold: [
      getYawRateWarningThreshold(state),
      maybeNegate(getYawRateWarningThreshold(state)),
    ],
    thresholdLabel: t('validation.yawRateThreshold'),
    title: t('validation.yawRate'),
    verticalUnit: '\u00B0/s',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
