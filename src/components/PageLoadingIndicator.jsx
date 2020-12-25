import React from 'react';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

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
