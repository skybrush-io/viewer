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
    gridColor: '#fff',
    skyType: 'atmosphere',
    skyColor: '#88c',
    ...grounds.default,
  },
  night: {
    preset: 'starry',
    gridColor: '#39d2f2',
    skyType: 'atmosphere',
    skyColor: '#88c',
    ...grounds.default,
  },
  indoor: {
    preset: 'default',
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
  showTerrainModel?: boolean;
  type: SceneryType;
};

/**
 * Returns the scale and stage size of the generated environment.
 *
 * The scale is a scaling factor applied to all axes of the generated environment.
 * The stage size is the radius of the sky sphere around the origin as well as the
 * distance of simulated stars from the origin.
 *
 * @returns the scale and stage size of the generated environment
 */
const getEnvironmentProps = ({
  type,
  showTerrainModel,
}: Pick<SceneryProps, 'type' | 'showTerrainModel'>): {
  fog: number;
  scale: number;
  stageSize: number;
} => {
  // The scale and the stage size will depend on whether we are showing a real terrain
  // model or not.
  //
  // If the show is an indoor one, we do not care about terrain models and we just use
  // a scale of 0.5 to ensure that the checkerboard pattern on the ground is 1x1 meters
  // in size.
  //
  // If the show is an outdoor show, the scale and the stage size will depend on whether
  // we are showing a real terrain model or not. For a real terrain model we want a
  // scale of 1, and the stage radius should be 2000 meters to ensure that we can
  // enclose the typical outdoor show in the sky sphere. If we do not have a real
  // terrain model, we want to show generated mountains around the show area, but in
  // order for the mountains to have a visible height, we need to use a smaller stage
  // size _but_ we can scale up the entire scenery instead.
  //
  // We also use a larger fog value when we are showing real terrain.

  const stageSizeInMeters = type === 'indoor' ? 100 : 2000;
  let scale = 1;
  let fog = 0.2;

  switch (type) {
    case 'indoor':
      scale = 0.5;
      fog = 0.2;
      break;

    case 'day':
      scale = showTerrainModel ? 1 : 10;
      fog = showTerrainModel ? 0.4 : 0.2;
      break;

    case 'night':
      scale = showTerrainModel ? 1 : 10;
      fog = showTerrainModel ? 0.7 : 0.2;
      break;
  }

  const stageSize = stageSizeInMeters / scale;

  return { fog, scale, stageSize };
};

/**
 * Component that renders a basic scenery in which the drones will be placed.
 */
const Scenery = ({
  grid,
  showTerrainModel = false,
  type = 'night',
}: SceneryProps) => {
  const enabled = type !== 'disabled';
  const { fog, scale, stageSize } = getEnvironmentProps({
    type,
    showTerrainModel,
  });

  const environment: Record<string, unknown> = {
    ...environments[type],
    grid: typeof grid === 'string' ? grid : grid ? '1x1' : 'none',
    fog,
    stageSize,
  };

  if (showTerrainModel && type !== 'indoor') {
    environment.ground = 'none';
  }

  console.log(JSON.stringify(environment));

  return enabled ? (
    <a-entity position='0 -0.001 0' scale={`${scale} ${scale} ${scale}`}>
      {/* Move the floor slightly down to ensure that the coordinate axes are nicely visible */}
      <a-entity environment={objectToString(environment)} />
    </a-entity>
  ) : null;
};

export default React.memo(Scenery);
