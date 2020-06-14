import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Fade from '@material-ui/core/Fade';

import BottomOverlay from './BottomOverlay';

const Overlays = ({ visible }) => (
  <>
    {/*
    <Fade in={visible}>
      <TopOverlay />
    </Fade>
    */}
    <Fade in={visible}>
      <BottomOverlay />
    </Fade>
  </>
);

Overlays.propTypes = {
  visible: PropTypes.bool,
};

Overlays.defaultProps = {
  visible: false,
};

export default connect(
  // mapStateToProps
  (state) => ({
    ...state.threeD.overlays,
  }),
  // mapDispatchToProps
  {}
)(Overlays);
