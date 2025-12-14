import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import { styled } from '@mui/material/styles';

import { PLAYER_SIDEBAR_WIDTH } from '~/constants';
import { isSidebarOpen } from '~/features/sidebar/slice';
import { useAppSelector } from '~/hooks/store';
import type { RootState } from '~/store';

import BottomOverlay from './BottomOverlay';
import TopOverlay from './TopOverlay';

const OverlayContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'sidebarOpen',
})<{ sidebarOpen: boolean }>(({ sidebarOpen, theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: sidebarOpen ? PLAYER_SIDEBAR_WIDTH : 0,
  bottom: 0,
  transition: theme.transitions.create(['right'], {
    duration: theme.transitions.duration.enteringScreen,
  }),
  pointerEvents: 'none',
}));

const Overlays = ({ visible = false }: { readonly visible: boolean }) => {
  const sidebarOpen = useAppSelector(isSidebarOpen);

  return (
    <OverlayContainer sidebarOpen={sidebarOpen}>
      <Fade in={visible}>
        <TopOverlay />
      </Fade>
      <Fade in={visible}>
        <BottomOverlay />
      </Fade>
    </OverlayContainer>
  );
};

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    visible: state.threeD.overlays.visible,
  }),
  // mapDispatchToProps
  {}
)(Overlays);
