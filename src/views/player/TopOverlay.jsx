import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';

import { systemFont } from '@skybrush/app-theme-mui';

import TrackDronesButton from '~/components/buttons/TrackDronesButton';
import ZoomOutButton from '~/components/buttons/ZoomOutButton';
import WindowDragMoveArea from '~/components/WindowDragMoveArea';
import { hasLoadedShowFile } from '~/features/show/selectors';
import { resetZoom, rotateViewToDrones } from '~/features/three-d/actions';

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

/**
 * Overlay at the top of the window that acts as a draggable area on macOS
 * to allow the window to be moved around.
 */
const TopOverlay = React.forwardRef(
  ({ hasShow, onRotateViewToDrones, onResetZoom, ...rest }, ref) => (
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

TopOverlay.propTypes = {
  hasShow: PropTypes.bool,
  onResetZoom: PropTypes.func,
  onRotateViewToDrones: PropTypes.func,
};

export default connect(
  // mapStateToProps
  (state) => ({
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
