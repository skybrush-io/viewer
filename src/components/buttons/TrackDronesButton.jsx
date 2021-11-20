import React from 'react';

import IconButton from '@mui/material/IconButton';
import CenterFocusStrong from '@mui/icons-material/CenterFocusStrong';

const TrackDronesButton = (props) => (
  <IconButton disableRipple {...props} size='large'>
    <CenterFocusStrong />
  </IconButton>
);

export default TrackDronesButton;
