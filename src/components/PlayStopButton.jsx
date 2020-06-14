import PropTypes from 'prop-types';
import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Pause from '@material-ui/icons/Pause';
import Play from '@material-ui/icons/PlayArrow';

const PlayStopButton = ({ playing, ...rest }) => (
  <IconButton disableRipple {...rest}>
    {playing ? <Pause /> : <Play />}
  </IconButton>
);

PlayStopButton.propTypes = {
  playing: PropTypes.bool,
};

export default PlayStopButton;
