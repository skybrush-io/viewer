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
    'drone-model': 'drone-flock.droneModel',
    'drone-radius': 'drone-flock.droneRadius',
    indoor: 'drone-flock.indoor',
    'label-color': 'drone-flock.labelColor',
    'scale-labels': 'drone-flock.scaleLabels',
    'show-glow': 'drone-flock.showGlow',
    'show-labels': 'drone-flock.showLabels',
    'show-yaw': 'drone-flock.showYaw',
    size: 'drone-flock.size',
  },
});
