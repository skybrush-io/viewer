import AFrame from '@skybrush/aframe-components';

import 'aframe-environment-component';
import 'aframe-look-at-component';

import '@skybrush/aframe-components/advanced-camera-controls';
import '@skybrush/aframe-components/deallocate';
import '@skybrush/aframe-components/meshline';
import { createSyncPoseWithStoreComponent } from '@skybrush/aframe-components/factories';

import './components/drone-flock';
import './components/glow-material';

import './primitives/drone-flock';

AFrame.registerComponent(
  'sync-pose-with-store',
  createSyncPoseWithStoreComponent({
    getCameraPose() {},

    setCameraPose() {},
  })
);

// eslint-disable-next-line unicorn/prefer-export-from
export default AFrame;
