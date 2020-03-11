import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHarmonicIntervalFn, useUpdate } from 'react-use';

import Slider from '@material-ui/core/Slider';

import { setPlaybackPosition } from '~/features/playback/actions';
import { getElapsedSeconds, isPlaying } from '~/features/playback/selectors';
import { formatPlaybackTimestamp } from '~/utils/formatters';

const PlaybackSlider = ({
  duration,
  getElapsedSeconds,
  isPlaying,
  onDragged,
  updateInterval
}) => {
  const [temporaryValue, setTemporaryValue] = useState();
  const update = useUpdate();
  useHarmonicIntervalFn(update, isPlaying ? updateInterval : null);

  const elapsed = temporaryValue || Math.min(getElapsedSeconds(), duration);

  return (
    <Slider
      max={duration}
      value={elapsed}
      valueLabelDisplay="auto"
      valueLabelFormat={formatPlaybackTimestamp}
      onChange={(_, value) => {
        setTemporaryValue(value);
      }}
      onChangeCommitted={(_, value) => {
        setTemporaryValue(null);
        onDragged(value);
      }}
    />
  );
};

PlaybackSlider.propTypes = {
  duration: PropTypes.number,
  getElapsedSeconds: PropTypes.func,
  isPlaying: PropTypes.bool,
  onDragged: PropTypes.func,
  updateInterval: PropTypes.number
};

PlaybackSlider.defaultProps = {
  updateInterval: 1000
};

export default connect(
  // mapStateToProps
  state => ({
    duration: 3 * 60 + 47,
    getElapsedSeconds: () => getElapsedSeconds(state),
    isPlaying: isPlaying(state)
  }),
  // mapDispatchToProps
  {
    onDragged: setPlaybackPosition
  }
)(PlaybackSlider);
