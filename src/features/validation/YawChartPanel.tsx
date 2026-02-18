import { t } from 'i18next';
import { connect } from 'react-redux';

import ChartPanel from '~/features/charts/ChartPanel';
import { getTimestampFormatter, isShowIndoor } from '~/features/show/selectors';
import type { RootState } from '~/store';

import {
  selectSampledYawGetter,
} from './selectors';
import { createChartSelectorFromDroneRelatedSelector } from './utils';

const getYawChart = createChartSelectorFromDroneRelatedSelector(
  selectSampledYawGetter
);

// Custom ranges to use for the chart panel. This prevents the annotations from
// affecting the range chosen by Chart.js but it will still allow the data to
// expand the range if needed.
const Y_RANGE_INDOOR: [number, number] = [0, 2];
const Y_RANGE_OUTDOOR: [number, number] = [0, 10];

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    chart: getYawChart(state),
    formatPlaybackTimestamp: getTimestampFormatter(state),
    range: isShowIndoor(state) ? Y_RANGE_INDOOR : Y_RANGE_OUTDOOR,
    title: t('validation.yaw'),
    verticalUnit: ' deg',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
