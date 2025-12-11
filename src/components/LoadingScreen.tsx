import React from 'react';
import { connect } from 'react-redux';

import PlayIcon from '@mui/icons-material/PlayArrow';
import WarningIcon from '@mui/icons-material/Warning';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';

import { rewind, togglePlayback } from '~/features/playback/actions';
import { userInteractedWithPlayback } from '~/features/playback/selectors';
import { shouldShowPlaybackHintButton } from '~/features/settings/selectors';
import {
  hasLoadedShowFile,
  isLoadingShowFile,
} from '~/features/show/selectors';
import type { RootState } from '~/store';

import CentralHelperPanel from './CentralHelperPanel';

const styles = {
  root: {
    position: 'relative',
    display: 'inline-block',
  },

  progress: {
    position: 'absolute',
    top: -4,
    left: -4,
    zIndex: 1,
  },

  label: {
    mt: 4,
    textAlign: 'center',
    userSelect: 'none',
  },
} as const;

type LoadingScreenProps = {
  readonly canPlay: boolean;
  readonly error: string | null;
  readonly loading: boolean;
  readonly onDismiss: () => void;
  readonly onPlay: () => void;
  readonly visible: boolean;
};

const LoadingScreen = ({
  canPlay,
  error,
  loading,
  onDismiss,
  onPlay,
  visible,
}: LoadingScreenProps) => (
  <CentralHelperPanel
    canDismiss={!loading && !error}
    visible={visible}
    onDismiss={onDismiss}
  >
    <Box sx={styles.root}>
      {loading && <CircularProgress size={64} sx={styles.progress} />}
      <Fab
        aria-label='play'
        color='primary'
        style={{ opacity: !loading && (canPlay || error) ? 1 : 0 }}
        disableRipple={Boolean(error)}
        onClick={onPlay}
      >
        {error && <WarningIcon />}
        {canPlay && !error && <PlayIcon />}
      </Fab>
    </Box>
    <Box sx={styles.label}>
      {loading && 'Loading show'}
      {!loading && error ? error : null}
      {!loading && !error && canPlay && 'Click to play'}
    </Box>
  </CentralHelperPanel>
);

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    canPlay: hasLoadedShowFile(state),
    error: state.show.error,
    loading: isLoadingShowFile(state),
    visible:
      isLoadingShowFile(state) ||
      (!userInteractedWithPlayback(state) && shouldShowPlaybackHintButton()) ||
      Boolean(state.show.error),
  }),
  // mapDispatchToProps
  {
    onDismiss: rewind,
    onPlay: togglePlayback,
  }
)(LoadingScreen);
