import config from 'config';

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import PlaybackSlider from '~/components/PlaybackSlider';
import OpenButton from '~/components/buttons/OpenButton';
import PlayStopButton from '~/components/buttons/PlayStopButton';
import SettingsButton from '~/components/buttons/SettingsButton';
import VolumeButton from '~/components/buttons/VolumeButton';

import { hasAudio, isAudioMuted } from '~/features/audio/selectors';
import { toggleMuted } from '~/features/audio/slice';
import { togglePlayback } from '~/features/playback/actions';
import { canTogglePlayback, isPlaying } from '~/features/playback/selectors';
import { pickLocalFileAndLoadShow } from '~/features/show/actions';
import {
  canLoadShowFromLocalFile,
  getShowDuration,
  getTimestampFormatter,
  hasLoadedShowFile,
} from '~/features/show/selectors';
import ToggleValidationModeButton from '~/features/validation/ToggleValidationModeButton';

import VirtualReality from '~/icons/VirtualReality';

const style = {
  background: 'linear-gradient(transparent 0px, rgba(0, 0, 0, 0.6) 48px)',
  cursor: 'default',
  fontSize: 'fontSize',
  pb: 0.5,

  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
};

const noWrap = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const BottomOverlay = React.forwardRef(
  (
    {
      canLoadShowFromLocalFile,
      canTogglePlayback,
      duration,
      formatPlaybackTimestamp,
      hasAudio,
      hasShow,
      leftText,
      muted,
      playing,
      rightText,
      onLoadShowFromLocalFile,
      onToggleMuted,
      onTogglePlayback,
      ...rest
    },
    ref
  ) => (
    <Box ref={ref} sx={style} {...rest}>
      <Box display='flex' alignItems='center'>
        {canLoadShowFromLocalFile && (
          <Box pl={1} mr={-1}>
            <OpenButton disabled={playing} onClick={onLoadShowFromLocalFile} />
          </Box>
        )}
        <Box px={2}>
          <PlayStopButton
            edge='start'
            disabled={!canTogglePlayback}
            playing={playing}
            onClick={onTogglePlayback}
          />
          {hasAudio ? (
            <VolumeButton muted={muted} onClick={onToggleMuted} />
          ) : null}
        </Box>
        <Box flex={1} textAlign='center' pt={0.5}>
          <PlaybackSlider />
        </Box>
        <Box textAlign='right' pl={2}>
          {formatPlaybackTimestamp && formatPlaybackTimestamp(duration)}
        </Box>
        <Box px={1}>
          {config.modes.vr && (
            <IconButton id='vr-button' size='large'>
              <VirtualReality />
            </IconButton>
          )}
          {config.modes.validation && (
            <ToggleValidationModeButton disabled={!hasShow} />
          )}
          <SettingsButton />
        </Box>
      </Box>

      {leftText || rightText ? (
        <Box
          display='flex'
          alignItems='center'
          maxWidth='100%'
          minHeight={24}
          px={2}
        >
          <Box style={noWrap}>{leftText}</Box>
          <Box flex={1}> </Box>
          <Box style={{ ...noWrap, opacity: 0.5 }} textAlign='right'>
            {rightText}
          </Box>
        </Box>
      ) : null}
    </Box>
  )
);

BottomOverlay.propTypes = {
  canLoadShowFromLocalFile: PropTypes.bool,
  canTogglePlayback: PropTypes.bool,
  duration: PropTypes.number,
  formatPlaybackTimestamp: PropTypes.func,
  hasAudio: PropTypes.bool,
  hasShow: PropTypes.bool,
  leftText: PropTypes.string,
  muted: PropTypes.bool,
  playing: PropTypes.bool,
  onLoadShowFromLocalFile: PropTypes.func,
  onRotateViewToDrones: PropTypes.func,
  onToggleMuted: PropTypes.func,
  onTogglePlayback: PropTypes.func,
  rightText: PropTypes.string,
};

export default connect(
  // mapStateToProps
  (state) => ({
    canLoadShowFromLocalFile: canLoadShowFromLocalFile(state),
    canTogglePlayback: canTogglePlayback(state),
    duration: getShowDuration(state),
    formatPlaybackTimestamp: getTimestampFormatter(state),
    hasAudio: hasAudio(state),
    hasShow: hasLoadedShowFile(state),
    leftText:
      'Use arrow keys to move around (Shift to run) and E/C to change altitude. Drag the scenery to look around. Scroll wheel or +/- to zoom.',
    muted: isAudioMuted(state),
    playing: isPlaying(state),
    rightText: 'Skybrush © 2020-2021 CollMot Robotics Ltd.',
  }),
  // mapDispatchToProps
  {
    onLoadShowFromLocalFile: pickLocalFileAndLoadShow,
    onToggleMuted: toggleMuted,
    onTogglePlayback: togglePlayback,
  },
  null,
  { forwardRef: true }
)(BottomOverlay);
