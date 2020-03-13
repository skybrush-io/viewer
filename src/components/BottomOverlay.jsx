import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';

import { isAudioMuted, isAudioReadyToPlay } from '~/features/audio/selectors';
import { toggleMuted } from '~/features/audio/slice';
import { togglePlayback } from '~/features/playback/actions';
import { isPlaying } from '~/features/playback/selectors';
import { getShowDuration } from '~/features/show/selectors';
import { formatPlaybackTimestamp } from '~/utils/formatters';

import PlaybackSlider from './PlaybackSlider';
import PlayStopButton from './PlayStopButton';
import VolumeButton from './VolumeButton';

const BottomOverlay = ({
  audioReady,
  duration,
  muted,
  playing,
  onToggleMuted,
  onTogglePlayback,
  ...rest
}) => (
  <Box
    left={0}
    right={0}
    bottom={0}
    position="absolute"
    {...rest}
    display="flex"
    alignItems="center"
  >
    <Box px={2}>
      <PlayStopButton
        size="small"
        disabled={!playing && !audioReady}
        playing={playing}
        onClick={onTogglePlayback}
      />
      <VolumeButton size="small" muted={muted} onClick={onToggleMuted} />
    </Box>
    <Box flex={1} textAlign="center">
      <PlaybackSlider />
    </Box>
    <Box textAlign="right" px={2}>
      {formatPlaybackTimestamp(duration)}
    </Box>
  </Box>
);

BottomOverlay.propTypes = {
  audioReady: PropTypes.bool,
  duration: PropTypes.number,
  muted: PropTypes.bool,
  playing: PropTypes.bool,
  onToggleMuted: PropTypes.func,
  onTogglePlayback: PropTypes.func
};

export default connect(
  // mapStateToProps
  state => ({
    audioReady: isAudioReadyToPlay(state),
    duration: getShowDuration(state),
    muted: isAudioMuted(state),
    playing: isPlaying(state)
  }),
  // mapDispatchToProps
  {
    onToggleMuted: toggleMuted,
    onTogglePlayback: togglePlayback
  }
)(BottomOverlay);
