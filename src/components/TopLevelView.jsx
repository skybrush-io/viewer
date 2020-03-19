/**
 * @file Component that shows a three-dimensional view of the drone flock.
 */

import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';

import AudioController from './AudioController';
import ErrorNotificationController from './ErrorNotificationController';
import LoadingScreen from './LoadingScreen';
import Overlays from './Overlays';
import OverlayVisibilityController from './OverlayVisibilityController';
import ThreeDView from './ThreeDView';

import { setNavigationMode } from '~/features/three-d/slice';

const ThreeDTopLevelView = () => {
  const ref = useRef(null);

  return (
    <Box ref={ref} display="flex" flexDirection="column" height="100vh">
      <Box position="relative" flex={1}>
        <ThreeDView />
        <Overlays />
        <LoadingScreen />
      </Box>

      <AudioController />
      <OverlayVisibilityController areaRef={ref} />
      <ErrorNotificationController />
    </Box>
  );
};

ThreeDTopLevelView.propTypes = {
  navigation: PropTypes.shape({
    mode: PropTypes.string,
    parameters: PropTypes.object
  }),
  onSetNavigationMode: PropTypes.func,
  onShowSettings: PropTypes.func
};

export default connect(
  // mapStateToProps
  state => ({
    ...state.threeD
  }),
  // mapDispatchToProps
  {
    onSetNavigationMode: setNavigationMode
  }
)(ThreeDTopLevelView);
