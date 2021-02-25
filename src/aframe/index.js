import AFrame from '@skybrush/aframe-components';

import 'aframe-environment-component';
import 'aframe-glow';
import 'aframe-look-at-component';
import 'aframe-meshline-component';

import '@skybrush/aframe-components/altitude-control';
import '@skybrush/aframe-components/better-wasd-controls';
import '@skybrush/aframe-components/sprite';
import { createSyncPoseWithStoreComponent } from '@skybrush/aframe-components/factories';

import './components/deallocate';
import './components/drone-flock';

import './primitives/drone-flock';

AFrame.registerComponent(
  'sync-pose-with-store',
  createSyncPoseWithStoreComponent({
    getCameraPose() {},

    setCameraPose() {},
  })
);

export default AFrame;
