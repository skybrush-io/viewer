/**
 * @file Component that shows a three-dimensional view of the drone flock.
 */

import React, { useRef } from 'react';

import Box from '@material-ui/core/Box';

import AudioController from './AudioController';
import LoadingScreen from './LoadingScreen';
import Overlays from './Overlays';
import OverlayVisibilityController from './OverlayVisibilityController';
import ThreeDView from './ThreeDView';
import WelcomeScreen from './WelcomeScreen';

const ThreeDTopLevelView = () => {
  const ref = useRef(null);

  return (
    <Box ref={ref} display='flex' flexDirection='column' height='100vh'>
      <Box position='relative' flex={1}>
        <ThreeDView />
        <Overlays />
        <WelcomeScreen />
        <LoadingScreen />
      </Box>

      <AudioController />
      <OverlayVisibilityController areaRef={ref} />
    </Box>
  );
};

ThreeDTopLevelView.propTypes = {};

export default ThreeDTopLevelView;
