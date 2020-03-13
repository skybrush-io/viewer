import PropTypes from 'prop-types';
import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import VolumeOff from '@material-ui/icons/VolumeOff';
import VolumeUp from '@material-ui/icons/VolumeUp';

const VolumeButton = ({ muted, ...rest }) => (
  <IconButton disableRipple {...rest}>
    {muted ? <VolumeOff /> : <VolumeUp />}
  </IconButton>
);

VolumeButton.propTypes = {
  muted: PropTypes.bool
};

export default VolumeButton;
