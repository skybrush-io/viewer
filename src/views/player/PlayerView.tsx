/**
 * @file Component that shows a three-dimensional view of the drone flock.
 */

import type React from 'react';

import Box from '@mui/material/Box';

import AudioController from '~/components/AudioController';
import LoadingScreen from '~/components/LoadingScreen';
import WelcomeScreen from '~/components/WelcomeScreen';
import { cameraRef } from '~/features/three-d/saga';

import Overlays from './Overlays';
import OverlayVisibilityController from './OverlayVisibilityController';
import PlayerSidebar from './sidebar';
import ThreeDView from './ThreeDView';

const PlayerView = ({
  screenRef,
}: {
  readonly screenRef: React.RefObject<Element>;
}) => (
  <>
    <Box position='relative' flex={1}>
      <ThreeDView cameraRef={cameraRef} />
      <Overlays />
      <WelcomeScreen />
      <LoadingScreen />
    </Box>

    <PlayerSidebar />
    <AudioController />
    <OverlayVisibilityController areaRef={screenRef} />
  </>
);

export default PlayerView;
