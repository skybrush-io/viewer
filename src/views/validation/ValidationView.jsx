import React from 'react';

import Box from '@material-ui/core/Box';

import TopOverlay from '~/components/TopOverlay';
import { isRunningOnMac } from '~/utils/platform';

import ChartGrid from './ChartGrid';
import ValidationHeader from './ValidationHeader';
import ValidationSidebar from './ValidationSidebar';

const SIDEBAR_WIDTH = 160;

const ValidationView = () => (
  <Box flex={1} display='flex' flexDirection='column' overflow='hidden' pr={1}>
    {window.isElectron && isRunningOnMac && <TopOverlay />}
    <ValidationHeader style={{ paddingLeft: SIDEBAR_WIDTH }} />
    <Box flex={1} display='flex' flexDirection='row' overflow='hidden'>
      <ValidationSidebar width={SIDEBAR_WIDTH} />
      <ChartGrid flex={1} pb={2} pr={1} />
    </Box>
  </Box>
);

export default ValidationView;
