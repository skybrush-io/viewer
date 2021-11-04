import React from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const styles = {
  root: {
    position: 'relative',
    display: 'inline-block',
    flex: 1,
  },

  progress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
};

const PageLoadingIndicator = () => (
  <Box sx={styles.root}>
    <Box sx={styles.progress}>
      <CircularProgress size={64} />
    </Box>
  </Box>
);

export default PageLoadingIndicator;
