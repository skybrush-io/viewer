import React from 'react';

import Box from '@material-ui/core/Box';

const ValidationView = () => (
  <Box flex={1} display='flex' flexDirection='row'>
    <Box width={160}>Sidebar</Box>

    <Box flex={1}>Main area</Box>
  </Box>
);

export default ValidationView;
