import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import makeStyles from '@mui/styles/makeStyles';
import PlayIcon from '@mui/icons-material/PlayArrow';
import WarningIcon from '@mui/icons-material/Warning';

import { rewind, togglePlayback } from '~/features/playback/actions';
import { userInteractedWithPlayback } from '~/features/playback/selectors';
import {
  hasLoadedShowFile,
  isLoadingShowFile,
} from '~/features/show/selectors';
import { shouldShowPlaybackHintButton } from '~/features/settings/selectors';

import CentralHelperPanel from './CentralHelperPanel';

const useStyles = makeStyles(
  {
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
  },
  {
    name: 'LoadingScreen',
  }
);

const LoadingScreen = ({
  canPlay,
  error,
  loading,
  onDismiss,
  onPlay,
  visible,
}) => {
  const classes = useStyles();
  return (
    <CentralHelperPanel
      canDismiss={!loading && !error}
      visible={visible}
      onDismiss={onDismiss}
    >
      <Box className={classes.root}>
        {loading && <CircularProgress size={64} className={classes.progress} />}
        <Fab
          aria-label='play'
          color='primary'
          className={classes.button}
          style={{ opacity: !loading && (canPlay || error) ? 1 : 0 }}
          onClick={onPlay}
        >
          {error && <WarningIcon />}
          {canPlay && !error && <PlayIcon />}
        </Fab>
      </Box>
      <Box textAlign='center' mt={4}>
        {loading && 'Loading show'}
        {!loading && error ? error : null}
        {!loading && !error && canPlay && 'Click to play'}
      </Box>
    </CentralHelperPanel>
  );
};

LoadingScreen.propTypes = {
  canPlay: PropTypes.bool,
  error: PropTypes.string,
  loading: PropTypes.bool,
  onDismiss: PropTypes.func,
  onPlay: PropTypes.func,
  visible: PropTypes.bool,
};

export default connect(
  // mapStateToProps
  (state) => ({
    canPlay: hasLoadedShowFile(state),
    error: state.show.error,
    loading: isLoadingShowFile(state),
    visible:
      isLoadingShowFile(state) ||
      (!userInteractedWithPlayback(state) &&
        shouldShowPlaybackHintButton(state)) ||
      Boolean(state.show.error),
  }),
  // mapDispatchToProps
  {
    onDismiss: rewind,
    onPlay: togglePlayback,
  }
)(LoadingScreen);
