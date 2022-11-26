import React from 'react';

import { objectToString } from '@skybrush/aframe-components';

const grounds = {
  /* Minecraft-style ground texture (green) */
  default: {
    groundColor: '#8eb971',
    groundColor2: '#507a32',
    groundTexture: 'walkernoise',
    groundYScale: 24,
    /* make the "play area" larger so we have more space to fly around without
     * bumping into hills */
    playArea: 1.6,
  },
  /* Checkerboard indoor texture */
  indoor: {
    ground: 'flat',
    groundColor: '#333',
    groundColor2: '#666',
    groundTexture: 'checkerboard',
  },
};

const environments = {
  day: {
    preset: 'default',
    fog: 0.2,
    gridColor: '#fff',
    skyType: 'atmosphere',
    skyColor: '#88c',
    ...grounds.default,
  },
  night: {
    preset: 'starry',
    fog: 0.2,
    gridColor: '#39d2f2',
    skyType: 'atmosphere',
    skyColor: '#88c',
    ...grounds.default,
  },
  indoor: {
    preset: 'default',
    fog: 0.2,
    gridColor: '#888',
    skyType: 'gradient',
    skyColor: '#000',
    horizonColor: '#222',
    ...grounds.indoor,
  },
  disabled: {
    disabled: true,
  },
};

export type SceneryType = keyof typeof environments;

type SceneryProps = {
  grid: boolean | string;
  type: SceneryType;
};

/**
 * Component that renders a basic scenery in which the drones will be placed.
 */
const Scenery = ({ grid, type = 'night' }: SceneryProps) => {
  const scale = type === 'indoor' ? 0.5 : 10;
  const enabled = type !== 'disabled';
  return enabled ? (
    <a-entity position='0 -0.001 0' scale={`${scale} ${scale} ${scale}`}>
      {/* Move the floor slightly down to ensure that the coordinate axes are nicely visible */}
      <a-entity
        environment={objectToString({
          ...environments[type],
          grid: typeof grid === 'string' ? grid : grid ? '1x1' : 'none',
        })}
      />
    </a-entity>
  ) : null;
};

export default React.memo(Scenery);
