import React from 'react';

import Box from '@mui/material/Box';
import { systemFont } from '@skybrush/app-theme-mui';

import { isRunningOnMac } from '~/utils/platform';

const style = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: systemFont,
  WebkitAppRegion: 'drag',
  WebkitUserSelect: 'none',
  left: 0,
  top: 0,
  right: 0,
  height: 36,
  position: 'absolute',
  textAlign: 'center',
};

/**
 * Overlay at the top of the window that acts as a draggable area on macOS
 * to allow the window to be moved around.
 */
const WindowDragMoveArea = (props) =>
  window.bridge && window.bridge.isElectron && isRunningOnMac ? (
    <Box sx={style} {...props} />
  ) : null;

export default WindowDragMoveArea;
