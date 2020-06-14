import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Folder from '@material-ui/icons/Folder';

const OpenButton = (props) => (
  <IconButton disableRipple {...props}>
    <Folder />
  </IconButton>
);

export default OpenButton;
