import React from 'react';

import IconButton from '@mui/material/IconButton';
import Folder from '@mui/icons-material/Folder';
import Tooltip from '@skybrush/mui-components/lib/Tooltip';

const OpenButton = (props) => (
  <Tooltip content='Open show file'>
    <IconButton disableRipple {...props} size='large'>
      <Folder />
    </IconButton>
  </Tooltip>
);

export default OpenButton;
