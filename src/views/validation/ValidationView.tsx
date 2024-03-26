import React from 'react';

import Box from '@mui/material/Box';

import WindowDragMoveArea, {
  WINDOW_DRAG_MOVE_AREA_HEIGHT,
} from '~/components/WindowDragMoveArea';

import ChartGrid from './ChartGrid';
import ValidationHeader from './ValidationHeader';
import ValidationSidebar from './ValidationSidebar';

const SIDEBAR_WIDTH = 160;

const styles = {
  root: {
    backgroundColor: '#303030',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',
    pr: 1,
  },
} as const;

const ValidationView = () => (
  <Box sx={styles.root}>
    <WindowDragMoveArea />
    <ValidationHeader
      style={{
        paddingLeft: SIDEBAR_WIDTH,
        paddingTop: WINDOW_DRAG_MOVE_AREA_HEIGHT,
      }}
    />
    <Box flex={1} display='flex' flexDirection='row' overflow='hidden'>
      <ValidationSidebar width={SIDEBAR_WIDTH} />
      <ChartGrid flex={1} pb={2} pr={1} />
    </Box>
  </Box>
);

export default ValidationView;
