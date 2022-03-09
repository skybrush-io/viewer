import React from 'react';

import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Pause from '@mui/icons-material/Pause';
import Play from '@mui/icons-material/PlayArrow';

const PlayStopButton = ({
  playing,
  ...rest
}: IconButtonProps & { playing: boolean }) => (
  <IconButton disableRipple {...rest} size='large'>
    {playing ? <Pause /> : <Play />}
  </IconButton>
);

export default PlayStopButton;
