import React from 'react';

import Box from '@material-ui/core/Box';

import ChartGrid from './ChartGrid';

const ValidationView = () => (
  <Box flex={1} display='flex' flexDirection='row' p={2}>
    <Box width={160}>Sidebar</Box>
    <Box flex={1} display='flex' flexDirection='row'>
      <ChartGrid flex={1} />
    </Box>
  </Box>
);

export default ValidationView;
