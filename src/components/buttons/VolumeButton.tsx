import React from 'react';

import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import VolumeOff from '@mui/icons-material/VolumeOff';
import VolumeUp from '@mui/icons-material/VolumeUp';

const VolumeButton = ({
  muted,
  ...rest
}: IconButtonProps & { readonly muted: boolean }) => (
  <IconButton disableRipple {...rest} size='large'>
    {muted ? <VolumeOff /> : <VolumeUp />}
  </IconButton>
);

export default VolumeButton;
