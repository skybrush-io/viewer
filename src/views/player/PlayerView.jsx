/**
 * @file Component that shows a three-dimensional view of the drone flock.
 */

import PropTypes from 'prop-types';
import React from 'react';

import Box from '@material-ui/core/Box';

import AudioController from '~/components/AudioController';
import LoadingScreen from '~/components/LoadingScreen';
import Overlays from '~/components/Overlays';
import OverlayVisibilityController from '~/components/OverlayVisibilityController';
import WelcomeScreen from '~/components/WelcomeScreen';

import ThreeDView from './ThreeDView';

const PlayerView = ({ screenRef }) => (
  <>
    <Box position='relative' flex={1}>
      <ThreeDView />
      <Overlays />
      <WelcomeScreen />
      <LoadingScreen />
    </Box>

    <AudioController />
    <OverlayVisibilityController areaRef={screenRef} />
  </>
);

PlayerView.propTypes = {
  screenRef: PropTypes.any,
};

export default PlayerView;
