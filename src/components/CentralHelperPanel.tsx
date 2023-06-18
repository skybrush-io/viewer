import Color from 'color';
import React from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Fade from '@mui/material/Fade';
import { type Theme } from '@mui/material/styles';
import Close from '@mui/icons-material/Close';

import { isThemeDark } from '@skybrush/app-theme-mui';

const styles = {
  root: {
    background: (theme: Theme) =>
      String(
        new Color(
          isThemeDark(theme)
            ? theme.palette.common.black
            : theme.palette.background.default
        )
          .alpha(0.7)
          .string()
      ),
    borderRadius: 1,
    boxShadow: 8,
    fontSize: 'fontSize',
    minWidth: 200,
    p: 6,
    position: 'absolute',
    left: '50%',
    top: '50%',
    textAlign: 'center',
    transform: 'translate(-50%, -50%)',
  },

  inner: {
    position: 'absolute',
    right: 4,
    top: 4,
    opacity: 0.5,
  },
};

interface CentralHelperPanelProps {
  canDismiss?: boolean;
  children: React.ReactNode;
  onDismiss?: () => void;
  visible: boolean;
}

const CentralHelperPanel = ({
  canDismiss,
  children,
  onDismiss,
  visible,
}: CentralHelperPanelProps) => (
  <Fade appear mountOnEnter unmountOnExit timeout={500} in={visible}>
    <Box sx={styles.root}>
      {children}
      {canDismiss && (
        <Box sx={styles.inner}>
          <IconButton disableRipple size='large' onClick={onDismiss}>
            <Close fontSize='small' />
          </IconButton>
        </Box>
      )}
    </Box>
  </Fade>
);

export default CentralHelperPanel;
