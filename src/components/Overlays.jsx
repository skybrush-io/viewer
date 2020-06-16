import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Fade from '@material-ui/core/Fade';

import { isRunningOnMac } from '~/utils/platform';

import BottomOverlay from './BottomOverlay';
import TopOverlay from './TopOverlay';

console.log(window.isElectron);
console.log(isRunningOnMac);

const Overlays = ({ visible }) => (
  <>
    {window.isElectron && isRunningOnMac && <TopOverlay />}
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
