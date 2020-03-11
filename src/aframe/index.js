import AFrame from './aframe';

import 'aframe-environment-component';
import 'aframe-look-at-component';
import 'aframe-meshline-component';

import './components/altitude-control';
import './components/better-wasd-controls';
import './components/deallocate';
import './components/drone-flock';
import './components/sprite';
import createSyncPoseWithStoreComponent from './components/sync-pose-with-store';

import './primitives/drone-flock';

/*
import { getCameraPose as getCameraPoseFromState } from '~/features/three-d/selectors';
import { setCameraPose as setCameraPoseAction } from '~/features/three-d/slice';
import store from '~/store';
*/

AFrame.registerComponent(
  'sync-pose-with-store',
  createSyncPoseWithStoreComponent({
    getCameraPose() {},

    setCameraPose() {}
  })
);

export default AFrame;
