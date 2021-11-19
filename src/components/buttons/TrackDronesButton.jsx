import React from 'react';

import IconButton from '@mui/material/IconButton';
import GpsFixed from '@mui/icons-material/GpsFixed';

const TrackDronesButton = (props) => (
  <IconButton disableRipple {...props} size='large'>
    <GpsFixed />
  </IconButton>
);

export default TrackDronesButton;
