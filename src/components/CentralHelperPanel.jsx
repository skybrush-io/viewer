import Color from 'color';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Fade from '@mui/material/Fade';
import makeStyles from '@mui/styles/makeStyles';
import Close from '@mui/icons-material/Close';
import { isThemeDark } from '@skybrush/app-theme-material-ui';

const useStyles = makeStyles(
  (theme) => ({
    root: {
      background: new Color(
        isThemeDark(theme)
          ? theme.palette.black
          : theme.palette.background.default
      )
        .alpha(0.7)
        .string(),
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[8],
      minWidth: 200,
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    },
  }),
  {
    name: 'CentralHelperPanel',
  }
);

const CentralHelperPanel = ({ canDismiss, children, onDismiss, visible }) => {
  const classes = useStyles();
  return (
    <Fade appear mountOnEnter unmountOnExit timeout={500} in={visible}>
      <Box className={classes.root} px={6} py={6} textAlign='center'>
        {children}
        {canDismiss && (
          <Box position='absolute' right={4} top={4} style={{ opacity: 0.5 }}>
            <IconButton disableRipple onClick={onDismiss} size="large">
              <Close fontSize='small' />
            </IconButton>
          </Box>
        )}
      </Box>
    </Fade>
  );
};

CentralHelperPanel.propTypes = {
  canDismiss: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  onDismiss: PropTypes.func,
  visible: PropTypes.bool,
};

export default CentralHelperPanel;
