import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';

import { togglePlayback } from '~/features/playback/actions';
import { isPlaying } from '~/features/playback/selectors';
import { formatPlaybackTimestamp } from '~/utils/formatters';

import PlaybackSlider from './PlaybackSlider';
import PlayStopButton from './PlayStopButton';

const BottomOverlay = ({ playing, onTogglePlayback, ...rest }) => (
  <Box
    left={0}
    right={0}
    bottom={0}
    position="absolute"
    {...rest}
    display="flex"
    alignItems="center"
  >
    <PlayStopButton playing={playing} onClick={onTogglePlayback} />
    <Box flex={1} textAlign="center">
      <PlaybackSlider />
    </Box>
    <Box textAlign="right" px={2}>
      {formatPlaybackTimestamp(3 * 60 + 47)}
    </Box>
  </Box>
);

BottomOverlay.propTypes = {
  playing: PropTypes.bool,
  onTogglePlayback: PropTypes.func
};

export default connect(
  // mapStateToProps
  state => ({
    playing: isPlaying(state)
  }),
  // mapDispatchToProps
  {
    onTogglePlayback: togglePlayback
  }
)(BottomOverlay);
