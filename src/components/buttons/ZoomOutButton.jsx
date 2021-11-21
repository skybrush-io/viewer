import React from 'react';

import IconButton from '@mui/material/IconButton';
import ZoomOut from '@mui/icons-material/ZoomOut';
import Tooltip from '@skybrush/mui-components/lib/Tooltip';

const ZoomOutButton = (props) => (
  <Tooltip content='Reset zoom'>
    <IconButton disableRipple {...props} size='large'>
      <ZoomOut />
    </IconButton>
  </Tooltip>
);

export default ZoomOutButton;
