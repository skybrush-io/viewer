import { t } from 'i18next';
import { connect } from 'react-redux';

import ChartPanel from '~/features/charts/ChartPanel';
import { getTimestampFormatter, isShowIndoor } from '~/features/show/selectors';
import type { RootState } from '~/store';

import {
  getYawRateWarningThreshold,
  selectSampledYawRateGetter,
} from './selectors';
import { createChartSelectorFromDroneRelatedSelector } from './utils';

const getYawRateChart = createChartSelectorFromDroneRelatedSelector(
  selectSampledYawRateGetter
);

// Custom ranges to use for the chart panel. This prevents the annotations from
// affecting the range chosen by Chart.js but it will still allow the data to
// expand the range if needed.
const Y_RANGE_INDOOR: [number, number] = [0, 2];
const Y_RANGE_OUTDOOR: [number, number] = [0, 10];

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    chart: getYawRateChart(state),
    formatPlaybackTimestamp: getTimestampFormatter(state),
    range: isShowIndoor(state) ? Y_RANGE_INDOOR : Y_RANGE_OUTDOOR,
    threshold: getYawRateWarningThreshold(state),
    thresholdLabel: t('validation.yawRateThreshold'),
    title: t('validation.yawRate'),
    verticalUnit: ' m',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
