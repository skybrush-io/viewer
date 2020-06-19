/**
 * A-Frame primitive that creates a drone flock entity that will contain the
 * individual drones.
 */

import AFrame from '@skybrush/aframe-components';

AFrame.registerPrimitive('a-drone-flock', {
  // Attaches the 'drone-flock' component by default.
  defaultComponents: {
    'drone-flock': {},
  },
  mappings: {
    'drone-size': 'drone-flock.droneSize',
    size: 'drone-flock.size',
    type: 'drone-flock.type',
  },
});
