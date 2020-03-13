import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { useHarmonicIntervalFn, useUpdate } from 'react-use';

import Slider from '@material-ui/core/Slider';

import {
  setPlaybackPosition,
  temporarilyOverridePlaybackPosition
} from '~/features/playback/actions';
import {
  getElapsedSecondsGetter,
  isAdjustingPlaybackPosition,
  isPlaying
} from '~/features/playback/selectors';
import { getShowDuration } from '~/features/show/selectors';
import { formatPlaybackTimestamp } from '~/utils/formatters';
import { stripEvent } from '~/utils/redux';

const PlaybackSlider = ({
  dragging,
  duration,
  getElapsedSeconds,
  onDragged,
  onDragging,
  playing,
  updateInterval
}) => {
  const update = useUpdate();
  useHarmonicIntervalFn(update, playing && !dragging ? updateInterval : null);

  const elapsed = Math.min(getElapsedSeconds(), duration);

  return (
    <Slider
      max={duration}
      value={elapsed}
      valueLabelDisplay="auto"
      valueLabelFormat={formatPlaybackTimestamp}
      onChange={onDragging}
      onChangeCommitted={onDragged}
    />
  );
};

PlaybackSlider.propTypes = {
  dragging: PropTypes.bool,
  duration: PropTypes.number,
  getElapsedSeconds: PropTypes.func,
  onDragged: PropTypes.func,
  onDragging: PropTypes.func,
  playing: PropTypes.bool,
  updateInterval: PropTypes.number
};

PlaybackSlider.defaultProps = {
  updateInterval: 200
};

export default connect(
  // mapStateToProps
  state => ({
    dragging: isAdjustingPlaybackPosition(state),
    duration: getShowDuration(state),
    getElapsedSeconds: getElapsedSecondsGetter(state),
    playing: isPlaying(state)
  }),
  // mapDispatchToProps
  {
    onDragged: stripEvent(setPlaybackPosition),
    onDragging: stripEvent(temporarilyOverridePlaybackPosition)
  }
)(PlaybackSlider);
