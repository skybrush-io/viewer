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

import { rewind, togglePlayback } from '~/features/playback/actions';
import { userInteractedWithPlayback } from '~/features/playback/selectors';
import {
  hasLoadedShowFile,
  isLoadingShowFile
} from '~/features/show/selectors';
import { isDark } from '~/theme';

const useStyles = makeStyles(
  theme => ({
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
      transform: 'translate(-50%, -50%)'
    },

    wrapper: {
      position: 'relative',
      display: 'inline-block'
    },

    progress: {
      position: 'absolute',
      top: -4,
      left: -4,
      zIndex: 1
    }
  }),
  {
    name: 'LoadingScreen'
  }
);

const LoadingScreen = ({ canPlay, loading, onDismiss, onPlay, visible }) => {
  const classes = useStyles();
  return (
    <Fade mountOnEnter unmountOnExit timeout={500} in={visible}>
      <Box className={classes.root} px={2} py={6} textAlign="center">
        <Box className={classes.wrapper}>
          {loading && (
            <CircularProgress size={64} className={classes.progress} />
          )}
          <Fab
            aria-label="play"
            color="primary"
            className={classes.button}
            style={{ opacity: !canPlay || loading ? 0 : 1 }}
            onClick={onPlay}
          >
            <PlayIcon />
          </Fab>
        </Box>
        <Box textAlign="center" mt={2}>
          {loading ? 'Loading show...' : 'Click to play'}
        </Box>
        {!loading && (
          <Box position="absolute" right={4} top={4}>
            <IconButton disableRipple onClick={onDismiss}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    </Fade>
  );
};

LoadingScreen.propTypes = {
  canPlay: PropTypes.bool,
  loading: PropTypes.bool,
  onDismiss: PropTypes.func,
  onPlay: PropTypes.func,
  visible: PropTypes.bool
};

export default connect(
  // mapStateToProps
  state => ({
    canPlay: hasLoadedShowFile(state),
    loading: isLoadingShowFile(state),
    visible: isLoadingShowFile(state) || !userInteractedWithPlayback(state)
  }),
  // mapDispatchToProps
  {
    onDismiss: rewind,
    onPlay: togglePlayback
  }
)(LoadingScreen);
