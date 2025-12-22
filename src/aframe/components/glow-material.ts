import AFrame, { type Component } from 'aframe';

import GlowingMaterial from '../materials/GlowingMaterial';

export type GlowMaterialProps = {
  color: string;
  falloff: number;
  internalRadius: number;
  sharpness: number;
  opacity: number;
};
export type GlowMaterialComponent = Component<GlowMaterialProps> & {
  material: GlowingMaterial;
  _getMaterialProperties(): GlowMaterialProps;
};

AFrame.registerComponent('glow-material', {
  schema: {
    color: { type: 'color', is: 'uniform', default: '#0080ff' },
    falloff: { type: 'number', is: 'uniform', default: 0.1 },
    internalRadius: { type: 'number', is: 'uniform', default: 6 },
    sharpness: { type: 'number', is: 'uniform', default: 1 },
    opacity: { type: 'number', is: 'uniform', default: 1 },
  },

  init(this: GlowMaterialComponent) {
    this.material = new GlowingMaterial(this._getMaterialProperties());
    this.el.addEventListener('loaded', () => {
      const mesh = this.el.getObject3D('mesh');
      if (mesh) {
        (mesh as any).material = this.material;
      }
    });
  },

  update(this: GlowMaterialComponent) {
    this.material?.setValues(this._getMaterialProperties());
  },

  _getMaterialProperties(this: GlowMaterialComponent) {
    const { color, falloff, internalRadius, sharpness, opacity } = this.data;
    return {
      color,
      falloff,
      internalRadius,
      sharpness,
      opacity,
    };
  },
});
