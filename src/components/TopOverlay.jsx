import React from 'react';

import Box from '@material-ui/core/Box';

const TopOverlay = ({ ...rest }) => (
  <Box
    left={0}
    right={0}
    top={0}
    position="absolute"
    textAlign="center"
    {...rest}
  >
    Top overlay
  </Box>
);

export default TopOverlay;
