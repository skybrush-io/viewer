import React from 'react';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
    left: 0,
    top: 0,
    right: 0,
    height: 36,
    position: 'absolute',
    textAlign: 'center',
  },
});

/**
 * Overlay at the top of the window that acts as a draggable area on macOS
 * to allow the window to be moved around.
 */
const TopOverlay = ({ ...rest }) => {
  const classes = useStyles();
  return <Box className={classes.root} {...rest} />;
};

export default TopOverlay;
