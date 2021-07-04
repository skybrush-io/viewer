import PropTypes from 'prop-types';
// import { toggle as toggleFullScreen } from 'screenfull';
import React from 'react';
import { connect } from 'react-redux';
import { configure as configureHotkeys, GlobalHotKeys } from 'react-hotkeys';

import { toggleMuted } from '~/features/audio/slice';
import {
  adjustPlaybackPositionBy,
  rewind,
  togglePlayback,
} from '~/features/playback/actions';

configureHotkeys({
  // Uncomment the next line for debugging problems with hotkeys
  // logLevel: 'debug',
});

// Create the default keymap mapping keys to actions
const keyMap = {
  CUE_FORWARD: 'l',
  CUE_BACKWARD: 'j',
  REWIND: 'home',
  // TOGGLE_FULLSCREEN: 'f',
  TOGGLE_MUTED: 'p',
  TOGGLE_PLAYBACK: ['space', 'k'],
};

const AppHotkeys = ({
  cueForward,
  cueBackward,
  rewind,
  toggleMuted,
  togglePlayback,
  children,
}) => {
  const handlers = {
    CUE_FORWARD: cueForward,
    CUE_BACKWARD: cueBackward,
    REWIND: rewind,
    // Full-screen does not work yet; the OverlayVisibilityHandler stops working
    // and I don't have time to debug it.
    // TOGGLE_FULLSCREEN: toggleFullScreen,
    TOGGLE_MUTED: toggleMuted,
    TOGGLE_PLAYBACK: togglePlayback,
  };

  return (
    <GlobalHotKeys root keyMap={keyMap} handlers={handlers}>
      {children}
    </GlobalHotKeys>
  );
};

AppHotkeys.propTypes = {
  cueForward: PropTypes.func,
  cueBackward: PropTypes.func,
  rewind: PropTypes.func,
  toggleMuted: PropTypes.func,
  togglePlayback: PropTypes.func,
  children: PropTypes.node,
};

export default connect(
  // mapStateToProps
  () => ({}),
  // mapDispatchToProps
  {
    cueBackward: () => adjustPlaybackPositionBy(-10),
    cueForward: () => adjustPlaybackPositionBy(10),
    rewind,
    toggleMuted,
    togglePlayback,
  }
)(AppHotkeys);
