import React from 'react';

import IconButton from '@mui/material/IconButton';
import Folder from '@mui/icons-material/Folder';

const OpenButton = (props) => (
  <IconButton disableRipple {...props} size='large'>
    <Folder />
  </IconButton>
);

export default OpenButton;
