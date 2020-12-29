import React from 'react';

import Box from '@material-ui/core/Box';

import ChartGrid from './ChartGrid';
import ValidationHeader from './ValidationHeader';
import ValidationSidebar from './ValidationSidebar';

const ValidationView = () => (
  <Box flex={1} display='flex' flexDirection='row' overflow='hidden'>
    <ValidationSidebar />
    <Box flex={1} pb={2} pr={2} display='flex' flexDirection='column'>
      <ValidationHeader />
      <ChartGrid flex={1} />
    </Box>
  </Box>
);

export default ValidationView;
