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

// Custom range to use for the chart panel. This prevents the annotations from
// affecting the range chosen by Chart.js but it will still allow the data to
// expand the range if needed.
const Y_RANGE: [number, number] = [-1, 1];

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    chart: getYawChart(state),
    formatPlaybackTimestamp: getTimestampFormatter(state),
    range: Y_RANGE,
    title: t('validation.yaw'),
    verticalUnit: ' deg',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
