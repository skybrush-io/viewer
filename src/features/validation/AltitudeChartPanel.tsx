import { t } from 'i18next';
import { connect } from 'react-redux';

import ChartPanel from '~/features/charts/ChartPanel';
import { getTimestampFormatter, isShowIndoor } from '~/features/show/selectors';
import type { RootState } from '~/store';

import {
  getAltitudeWarningThreshold,
  getSampledAltitudesForDrones,
} from './selectors';
import { createChartSelectorFromSwarmRelatedSelector } from './utils';

const getAltitudeChart = createChartSelectorFromSwarmRelatedSelector(
  getSampledAltitudesForDrones
);

// Custom ranges to use for the chart panel. This prevents the annotations from
// affecting the range chosen by Chart.js but it will still allow the data to
// expand the range if needed.
const Y_RANGE_INDOOR: [number, number] = [0, 2];
const Y_RANGE_OUTDOOR: [number, number] = [0, 10];

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    chart: getAltitudeChart(state),
    formatPlaybackTimestamp: getTimestampFormatter(state),
    range: isShowIndoor(state) ? Y_RANGE_INDOOR : Y_RANGE_OUTDOOR,
    threshold: getAltitudeWarningThreshold(state),
    thresholdLabel: t('validation.altitudeThreshold'),
    title: t('validation.altitude'),
    verticalUnit: ' m',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
