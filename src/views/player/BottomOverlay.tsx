import config from 'config';
import { t } from 'i18next';
import React from 'react';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MuteButton from '@skybrush/mui-components/lib/MuteButton';
import PlayStopButton from '@skybrush/mui-components/lib/PlayStopButton';

import OpenButton from '~/components/buttons/OpenButton';
import SettingsButton from '~/components/buttons/SettingsButton';

import { hasAudio, isAudioMuted } from '~/features/audio/selectors';
import { toggleMuted } from '~/features/audio/slice';
import { togglePlayback } from '~/features/playback/actions';
import { canTogglePlayback, isPlaying } from '~/features/playback/selectors';
import ShareButton from '~/features/sharing/ShareButton';
import { pickLocalFileAndLoadShow } from '~/features/show/actions';
import {
  canLoadShowFromLocalFile,
  getShowDuration,
  getTimestampFormatter,
  hasLoadedShowFile,
} from '~/features/show/selectors';
import ToggleValidationModeButton from '~/features/validation/ToggleValidationModeButton';

import VirtualReality from '~/icons/VirtualReality';

import type { RootState } from '~/store';

import PlaybackSlider from './PlaybackSlider';

const style = {
  background: 'linear-gradient(transparent 0px, rgba(0, 0, 0, 0.6) 48px)',
  cursor: 'default',
  fontSize: 'fontSize',
  pb: 0.5,

  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
} as const;

const noWrap = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as const;

interface BottomOverlayProps {
  readonly canLoadShowFromLocalFile: boolean;
  readonly canTogglePlayback: boolean;
  readonly duration: number;
  readonly formatPlaybackTimestamp: (timestamp: number) => string;
  readonly hasAudio: boolean;
  readonly hasShow: boolean;
  readonly leftText: string;
  readonly muted: boolean;
  readonly playing: boolean;
  readonly rightText: string;
  readonly onLoadShowFromLocalFile: () => void;
  readonly onToggleMuted: () => void;
  readonly onTogglePlayback: () => void;
}

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
    }: BottomOverlayProps,
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
          {hasAudio && <MuteButton muted={muted} onClick={onToggleMuted} />}
        </Box>
        <Box flex={1} textAlign='center' pt={0.5}>
          <PlaybackSlider />
        </Box>
        <Box textAlign='right' pl={2}>
          {formatPlaybackTimestamp(duration)}
        </Box>
        <Box px={1}>
          {config.modes.deepLinking && <ShareButton />}
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

const CURRENT_YEAR = new Date().getFullYear();

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    canLoadShowFromLocalFile: canLoadShowFromLocalFile(),
    canTogglePlayback: canTogglePlayback(state),
    duration: getShowDuration(state),
    formatPlaybackTimestamp: getTimestampFormatter(state),
    hasAudio: hasAudio(state),
    hasShow: hasLoadedShowFile(state),
    leftText: t('bottomOverlay.leftText'),
    muted: isAudioMuted(state),
    playing: isPlaying(state),
    rightText: t('bottomOverlay.rightText', { year: CURRENT_YEAR }),
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
