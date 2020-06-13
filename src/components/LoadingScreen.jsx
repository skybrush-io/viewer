import Color from 'color';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close';
import PlayIcon from '@material-ui/icons/PlayArrow';
import WarningIcon from '@material-ui/icons/Warning';

import { rewind, togglePlayback } from '~/features/playback/actions';
import { userInteractedWithPlayback } from '~/features/playback/selectors';
import {
  hasLoadedShowFile,
  isLoadingShowFile,
} from '~/features/show/selectors';
import { shouldShowPlaybackHintButton } from '~/features/settings/selectors';
import { isDark } from '~/theme';

const useStyles = makeStyles(
  (theme) => ({
    root: {
      background: new Color(
        isDark(theme) ? theme.palette.black : theme.palette.background.default
      )
        .alpha(0.7)
        .string(),
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[8],
      minWidth: 200,
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    },

    wrapper: {
      position: 'relative',
      display: 'inline-block',
    },

    progress: {
      position: 'absolute',
      top: -4,
      left: -4,
      zIndex: 1,
    },
  }),
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
    <Fade appear mountOnEnter unmountOnExit timeout={500} in={visible}>
      <Box className={classes.root} px={6} py={6} textAlign='center'>
        <Box className={classes.wrapper}>
          {loading && (
            <CircularProgress size={64} className={classes.progress} />
          )}
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
        {!loading && !error && (
          <Box position='absolute' right={4} top={4} style={{ opacity: 0.5 }}>
            <IconButton disableRipple onClick={onDismiss}>
              <Close fontSize='small' />
            </IconButton>
          </Box>
        )}
      </Box>
    </Fade>
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
