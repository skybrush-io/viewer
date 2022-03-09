import React from 'react';

import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import VolumeOff from '@mui/icons-material/VolumeOff';
import VolumeUp from '@mui/icons-material/VolumeUp';

const VolumeButton = ({
  muted,
  ...rest
}: IconButtonProps & { muted: boolean }) => (
  <IconButton disableRipple {...rest} size='large'>
    {muted ? <VolumeOff /> : <VolumeUp />}
  </IconButton>
);

export default VolumeButton;
