import React from 'react';

import IconButton from '@mui/material/IconButton';
import CenterFocusStrong from '@mui/icons-material/CenterFocusStrong';
import Tooltip from '@skybrush/mui-components/lib/Tooltip';

const TrackDronesButton = (props) => (
  <Tooltip content='Rotate camera towards drones'>
    <IconButton disableRipple {...props} size='large'>
      <CenterFocusStrong />
    </IconButton>
  </Tooltip>
);

export default TrackDronesButton;
