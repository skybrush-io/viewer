/**
 * A-Frame primitive that creates an arrow entity.
 */

import AFrame from 'aframe';

AFrame.registerPrimitive('a-arrow', {
  // Attaches the 'arrow' component by default.
  defaultComponents: {
    arrow: {},
  },
  mappings: {
    direction: 'arrow.direction',
    length: 'arrow.length',
    'head-length': 'arrow.headLength',
    'head-width': 'arrow.headWidth',
    color: 'arrow.color',
  },
});
