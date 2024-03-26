import React from 'react';

import Box, { type BoxProps } from '@mui/material/Box';
import { systemFont } from '@skybrush/app-theme-mui';

import { isElectronWindow } from '~/window';
import { isRunningOnMac } from '~/utils/platform';

const isShowingDragMoveArea = isElectronWindow(window) && isRunningOnMac;

export const WINDOW_DRAG_MOVE_AREA_HEIGHT = isShowingDragMoveArea ? 36 : 0;

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
  height: WINDOW_DRAG_MOVE_AREA_HEIGHT,
  position: 'absolute',
  textAlign: 'center',
} as const;

/**
 * Overlay at the top of the window that acts as a draggable area on macOS
 * to allow the window to be moved around.
 */
const WindowDragMoveArea = (props: BoxProps) =>
  isShowingDragMoveArea ? <Box sx={style} {...props} /> : null;

export default WindowDragMoveArea;
