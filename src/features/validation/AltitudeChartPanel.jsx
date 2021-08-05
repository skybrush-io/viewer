import { connect } from 'react-redux';

import { getTimestampFormatter, isShowIndoor } from '~/features/show/selectors';

import ChartPanel from './ChartPanel';
import {
  getAltitudeWarningThreshold,
  getSampledAltitudesForDrones,
} from './selectors';
import { createChartDataSelector } from './utils';

const getDataForAltitudeChart = createChartDataSelector(
  getSampledAltitudesForDrones
);

// Custom ranges to use for the chart panel. This prevents the annotations from
// affecting the range chosen by Chart.js but it will still allow the data to
// expand the range if needed.
const Y_RANGE_INDOOR = [0, 2];
const Y_RANGE_OUTDOOR = [0, 10];

export default connect(
  // mapStateToProps
  (state) => ({
    data: getDataForAltitudeChart(state),
    formatPlaybackTimestamp: getTimestampFormatter(state),
    range: isShowIndoor(state) ? Y_RANGE_INDOOR : Y_RANGE_OUTDOOR,
    threshold: getAltitudeWarningThreshold(state),
    thresholdLabel: 'Altitude threshold',
    title: 'Altitudes',
    verticalUnit: ' m',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
