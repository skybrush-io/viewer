import React from 'react';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(rgba(0, 0, 0, 0.6), transparent)'
  }
});

const TopOverlay = ({ ...rest }) => {
  const classes = useStyles();
  return (
    <Box
      left={0}
      right={0}
      top={0}
      position="absolute"
      textAlign="center"
      className={classes.root}
      {...rest}
    >
      Top overlay
    </Box>
  );
};

export default TopOverlay;
