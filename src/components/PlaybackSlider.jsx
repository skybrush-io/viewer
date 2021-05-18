import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { useHarmonicIntervalFn, useUpdate } from 'react-use';

import Slider from '@material-ui/core/Slider';
import { orange } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';

import { stripEvent } from '@skybrush/redux-toolkit';

import {
  setPlaybackPosition,
  temporarilyOverridePlaybackPosition,
} from '~/features/playback/actions';
import {
  getElapsedSecondsGetter,
  isAdjustingPlaybackPosition,
  isPlaying,
} from '~/features/playback/selectors';
import {
  getMarksFromShowCues,
  getShowDuration,
  getTimestampFormatter,
} from '~/features/show/selectors';

const styles = {
  mark: {
    height: 4,
    width: 4,
    backgroundColor: orange[500],
    transform: 'translateY(-1px)',
  },
  markActive: {
    opacity: 1,
  },
};

const PlaybackSlider = ({
  dragging,
  duration,
  formatPlaybackTimestamp,
  getElapsedSeconds,
  onDragged,
  onDragging,
  playing,
  updateInterval,
  ...rest
}) => {
  const update = useUpdate();
  useHarmonicIntervalFn(update, playing && !dragging ? updateInterval : null);

  const elapsed = Math.min(getElapsedSeconds(), duration);

  return (
    <Slider
      max={duration}
      value={elapsed}
      valueLabelDisplay='auto'
      valueLabelFormat={formatPlaybackTimestamp}
      onChange={onDragging}
      onChangeCommitted={onDragged}
      {...rest}
    />
  );
};

PlaybackSlider.propTypes = {
  dragging: PropTypes.bool,
  duration: PropTypes.number,
  formatPlaybackTimestamp: PropTypes.func,
  getElapsedSeconds: PropTypes.func,
  onDragged: PropTypes.func,
  onDragging: PropTypes.func,
  playing: PropTypes.bool,
  updateInterval: PropTypes.number,
};

PlaybackSlider.defaultProps = {
  updateInterval: 200,
};

export default connect(
  // mapStateToProps
  (state) => ({
    dragging: isAdjustingPlaybackPosition(state),
    duration: getShowDuration(state),
    formatPlaybackTimestamp: getTimestampFormatter(state),
    getElapsedSeconds: getElapsedSecondsGetter(state),
    marks: getMarksFromShowCues(state),
    playing: isPlaying(state),
  }),
  // mapDispatchToProps
  {
    onDragged: stripEvent(setPlaybackPosition),
    onDragging: stripEvent(temporarilyOverridePlaybackPosition),
  }
)(withStyles(styles)(PlaybackSlider));
