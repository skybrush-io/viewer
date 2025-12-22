import AFrame from '@skybrush/aframe-components';
import * as THREE from 'three';

export type ArrowProps = {
  direction: THREE.Vector3;
  length?: number;
  color: string;
  headLength?: number;
  headWidth?: number;
};

type ArrowComponent = AFrame.Component<ArrowProps> & {
  arrow: THREE.ArrowHelper;
};

AFrame.registerComponent('arrow', {
  schema: {
    direction: {
      type: 'vec3',
      default: {
        x: 1,
        y: 0,
        z: 0,
      },
    },
    length: {
      type: 'number',
    },
    color: {
      type: 'color',
      default: '#ff0',
    },
    headLength: {
      type: 'number',
    },
    headWidth: {
      type: 'number',
    },
  },

  init(this: ArrowComponent) {
    const data = this.data;
    const direction = new THREE.Vector3(
      data.direction.x,
      data.direction.y,
      data.direction.z
    );
    const length = data.length || direction.length();
    const headLength = data.headLength || length * 0.2;
    const headWidth = data.headWidth || headLength * 0.2;
    const color = new THREE.Color(data.color);
    this.arrow = new THREE.ArrowHelper(
      direction.normalize(),
      new THREE.Vector3(),
      length,
      color,
      headLength,
      headWidth
    );
    this.el.setObject3D('arrow', this.arrow);
  },

  update(this: ArrowComponent, oldData: ArrowProps) {
    const data = this.data;
    const diff = AFRAME.utils.diff(data, oldData);
    if ('color' in diff) {
      this.arrow.setColor(new THREE.Color(data.color));
    }
    let length;
    if ('direction' in diff) {
      const direction = new THREE.Vector3(
        data.direction.x,
        data.direction.y,
        data.direction.z
      );
      length = direction.length();
      this.arrow.setDirection(direction.normalize());
    }
    if (
      ('direction' in diff && typeof data.length === 'undefined') ||
      'length' in diff ||
      'headLength' in diff ||
      'headWidth' in diff
    ) {
      length = data.length ?? length ?? 0;
      const headLength = data.headLength ?? length * 0.2;
      const headWidth = data.headWidth ?? headLength * 0.2;
      this.arrow.setLength(length, headLength, headWidth);
    }
  },
});
