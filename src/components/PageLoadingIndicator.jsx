import React from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(
  {
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
  },
  {
    name: 'PageLoadingIndicator',
  }
);

const PageLoadingIndicator = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.progress}>
        <CircularProgress size={64} />
      </Box>
    </Box>
  );
};

PageLoadingIndicator.propTypes = {};

export default PageLoadingIndicator;
