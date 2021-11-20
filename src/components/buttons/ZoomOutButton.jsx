import React from 'react';

import IconButton from '@mui/material/IconButton';
import ZoomOut from '@mui/icons-material/ZoomOut';

const ZoomOutButton = (props) => (
  <IconButton disableRipple {...props} size='large'>
    <ZoomOut />
  </IconButton>
);

export default ZoomOutButton;
