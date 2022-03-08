import * as React from 'react';
import { connect } from 'react-redux';

import Fade from '@mui/material/Fade';

import type { RootState } from '~/store';

import BottomOverlay from './BottomOverlay';
import TopOverlay from './TopOverlay';

const Overlays = ({ visible = false }: { visible: boolean }) => (
  <>
    <Fade in={visible}>
      <TopOverlay />
    </Fade>
    <Fade in={visible}>
      <BottomOverlay />
    </Fade>
  </>
);

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    ...state.threeD.overlays,
  }),
  // mapDispatchToProps
  {}
)(Overlays);
