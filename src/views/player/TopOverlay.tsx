import React from 'react';
import { connect } from 'react-redux';

import Box, { type BoxProps } from '@mui/material/Box';

import { systemFont } from '@skybrush/app-theme-mui';

import TrackDronesButton from '~/components/buttons/TrackDronesButton';
import ZoomOutButton from '~/components/buttons/ZoomOutButton';
import WindowDragMoveArea from '~/components/WindowDragMoveArea';
import { hasLoadedShowFile } from '~/features/show/selectors';
import { resetZoom, rotateViewToDrones } from '~/features/three-d/actions';
import type { RootState } from '~/store';

import CameraSelectorChip from './CameraSelectorChip';

const style = {
  background: 'linear-gradient(rgba(0, 0, 0, 0.3) 0px, transparent 48px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: systemFont,
  WebkitAppRegion: 'drag',
  WebkitUserSelect: 'none',
  left: 0,
  top: 0,
  right: 0,
  pt: 2,
  minHeight: 48,
  position: 'absolute',
  textAlign: 'center',
};

interface TopOverlayProps extends BoxProps {
  hasShow: boolean;
  onRotateViewToDrones: () => void;
  onResetZoom: () => void;
}

/**
 * Overlay at the top of the window that acts as a draggable area on macOS
 * to allow the window to be moved around.
 */
const TopOverlay = React.forwardRef(
  (
    { hasShow, onRotateViewToDrones, onResetZoom, ...rest }: TopOverlayProps,
    ref
  ) => (
    <Box ref={ref} sx={style} {...rest}>
      <WindowDragMoveArea />
      {hasShow && (
        <>
          <ZoomOutButton onClick={onResetZoom} />
          <CameraSelectorChip />
          <TrackDronesButton onClick={onRotateViewToDrones} />
        </>
      )}
    </Box>
  )
);

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    hasShow: hasLoadedShowFile(state),
  }),
  // mapDispatchToProps
  {
    onResetZoom: resetZoom,
    onRotateViewToDrones: rotateViewToDrones,
  },
  null,
  { forwardRef: true }
)(TopOverlay);
