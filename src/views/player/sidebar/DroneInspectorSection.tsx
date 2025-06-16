import React, { useRef } from 'react';
import { Color as ThreeJsColor } from 'three';
import Colorize from '@mui/icons-material/Colorize';
import LocationOn from '@mui/icons-material/LocationOn';
import NorthEast from '@mui/icons-material/NorthEast';
import type {
  Color,
  LightProgramPlayer,
  TrajectoryPlayer,
  Vector3,
} from '@skybrush/show-format';
import VectorDisplay from '~/components/VectorDisplay';
import {
  getElapsedSecondsGetter,
  isPlaying,
} from '~/features/playback/selectors';
import { useAppSelector } from '~/hooks/store';
import MiniList from '@skybrush/mui-components/lib/MiniList';
import MiniListItem from '@skybrush/mui-components/lib/MiniListItem';
import { ICON_STYLE } from './MetadataSection';
import usePeriodicRefresh from '~/hooks/usePeriodicRefresh';
import type { RootState } from '~/store';
import { getValidationSettings } from '~/features/validation/selectors';

type DroneInspectorSectionProps = Readonly<{
  index: number;
  trajectoryPlayer: TrajectoryPlayer;
  lightProgramPlayer: LightProgramPlayer;
}>;

type State = {
  position: Vector3;
  velocity: Vector3;
  color: Color;
};

const createState = (): State => ({
  position: { x: 0, y: 0, z: 0 },
  velocity: { x: 0, y: 0, z: 0 },
  color: [0, 0, 0] as Color,
});

const RGB_LABELS: [string, string, string] = ['R', 'G', 'B'];
const EMPTY_ARRAY: number[] = [];

export default function DroneInspectorSection({
  trajectoryPlayer,
  lightProgramPlayer,
}: DroneInspectorSectionProps) {
  const shouldRefresh = useAppSelector(isPlaying);
  const getTimestamp = useAppSelector(getElapsedSecondsGetter);
  const { maxAltitude, maxVelocityXY, maxVelocityZ, maxVelocityZUp } =
    useAppSelector(getValidationSettings);

  usePeriodicRefresh(shouldRefresh ? 100 : null);

  const state = useRef<State | null>(null);
  if (!state.current) {
    state.current = createState();
  }

  const { position, velocity, color } = state.current;
  const timestamp = getTimestamp();
  trajectoryPlayer.getPositionAt(timestamp, position);
  trajectoryPlayer.getVelocityAt(timestamp, velocity);
  lightProgramPlayer.evaluateColorAt(timestamp, color);

  const srgbColor = new ThreeJsColor(color[0], color[1], color[2])
    .convertLinearToSRGB()
    .toArray();

  const positionWarnings = position.z > maxAltitude ? [2] : EMPTY_ARRAY;
  const velocityWarnings: number[] = [];
  const velocityMagnitudeWarnings: number[] = [];
  if (Math.hypot(velocity.x, velocity.y) > maxVelocityXY) {
    velocityWarnings.push(0, 1);
    velocityMagnitudeWarnings.push(0);
  }
  if (velocity.z < -maxVelocityZ) {
    velocityWarnings.push(2);
  } else if (
    (maxVelocityZUp !== undefined && velocity.z < -maxVelocityZUp) ||
    (maxVelocityZUp === undefined && velocity.z > maxVelocityZ)
  ) {
    velocityWarnings.push(2);
  }

  return (
    <MiniList>
      <MiniListItem
        primaryText={
          <VectorDisplay
            colored
            value={[position.x, position.y, position.z]}
            unit='m'
            warnings={positionWarnings}
          />
        }
        icon={<LocationOn fontSize='small' sx={ICON_STYLE} />}
      />
      <MiniListItem
        primaryText={
          <VectorDisplay
            colored
            value={[velocity.x, velocity.y, velocity.z]}
            unit='m/s'
            warnings={velocityWarnings}
          />
        }
        icon={<NorthEast fontSize='small' sx={ICON_STYLE} />}
      />
      <MiniListItem
        primaryText={
          <VectorDisplay
            value={[
              Math.hypot(velocity.x, velocity.y),
              Math.hypot(velocity.x, velocity.y, velocity.z),
            ]}
            labels={['2D', '3D']}
            unit='m/s'
            warnings={velocityMagnitudeWarnings}
          />
        }
        icon={
          <NorthEast fontSize='small' sx={ICON_STYLE} htmlColor='transparent' />
        }
      />
      <MiniListItem
        primaryText={
          <VectorDisplay
            colored
            value={[
              Math.round(color[0] * 255),
              Math.round(color[1] * 255),
              Math.round(color[2] * 255),
            ]}
            digits={0}
            labels={RGB_LABELS}
            unit='linear'
          />
        }
        icon={<Colorize fontSize='small' sx={ICON_STYLE} />}
      />
      <MiniListItem
        primaryText={
          <VectorDisplay
            colored
            value={[
              Math.round(srgbColor[0] * 255),
              Math.round(srgbColor[1] * 255),
              Math.round(srgbColor[2] * 255),
            ]}
            digits={0}
            labels={RGB_LABELS}
            unit='sRGB'
          />
        }
        icon={
          <Colorize fontSize='small' sx={ICON_STYLE} htmlColor='transparent' />
        }
      />
    </MiniList>
  );
}
