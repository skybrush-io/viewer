import PropTypes from 'prop-types';
import React from 'react';

import IconButton from '@mui/material/IconButton';
import VolumeOff from '@mui/icons-material/VolumeOff';
import VolumeUp from '@mui/icons-material/VolumeUp';

const VolumeButton = ({ muted, ...rest }) => (
  <IconButton disableRipple {...rest} size='large'>
    {muted ? <VolumeOff /> : <VolumeUp />}
  </IconButton>
);

VolumeButton.propTypes = {
  muted: PropTypes.bool,
};

export default VolumeButton;
