import PropTypes from 'prop-types';
import React from 'react';

import IconButton from '@mui/material/IconButton';
import Pause from '@mui/icons-material/Pause';
import Play from '@mui/icons-material/PlayArrow';

const PlayStopButton = ({ playing, ...rest }) => (
  <IconButton disableRipple {...rest} size='large'>
    {playing ? <Pause /> : <Play />}
  </IconButton>
);

PlayStopButton.propTypes = {
  playing: PropTypes.bool,
};

export default PlayStopButton;
