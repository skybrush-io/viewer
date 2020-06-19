/**
 * Helper A-Frame component that deallocates the WebGL context when the
 * scene is unmounted.
 *
 * Source: https://github.com/ngokevin/aframe-react/issues/110
 */

import AFrame from '@skybrush/aframe-components';

const { Cache } = AFrame.THREE;

AFrame.registerComponent('deallocate', {
  remove() {
    Cache.clear();
    this.el.renderer.forceContextLoss();
  },
});
