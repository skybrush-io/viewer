import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import Colorize from '@mui/icons-material/Colorize';
import LocationOn from '@mui/icons-material/LocationOn';
import NearMe from '@mui/icons-material/NearMe';
import type {
  Color,
  LightProgramPlayer,
  TrajectoryPlayer,
  Vector3,
} from '@skybrush/show-format';
import Vector3D from '~/components/Vector3D';
import { getElapsedSeconds } from '~/features/playback/selectors';
import { useAppSelector } from '~/hooks/store';
import MiniList from '@skybrush/mui-components/lib/MiniList';
import MiniListItem from '@skybrush/mui-components/lib/MiniListItem';
import { ICON_STYLE } from './MetadataSection';

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

export default function DroneInspectorSection({
  index,
  trajectoryPlayer,
  lightProgramPlayer,
}: DroneInspectorSectionProps) {
  const timestamp = useAppSelector(getElapsedSeconds);
  const state = useRef<State | null>(null);
  if (!state.current) {
    state.current = createState();
  }

  const { position, velocity, color } = state.current;
  trajectoryPlayer.getPositionAt(timestamp, position);
  trajectoryPlayer.getVelocityAt(timestamp, velocity);
  lightProgramPlayer.evaluateColorAt(timestamp, color);

  return (
    <MiniList>
      <MiniListItem
        primaryText={<Vector3D {...position} unit='m' />}
        icon={<LocationOn fontSize='small' sx={ICON_STYLE} />}
      />
      <MiniListItem
        primaryText={<Vector3D {...velocity} unit='m/s' />}
        icon={<NearMe fontSize='small' sx={ICON_STYLE} />}
      />
      <MiniListItem
        primaryText={
          <Vector3D
            x={Math.round(color[0] * 255)}
            y={Math.round(color[1] * 255)}
            z={Math.round(color[2] * 255)}
            digits={0}
            labels={RGB_LABELS}
            unit='RGB'
          />
        }
        icon={<Colorize fontSize='small' sx={ICON_STYLE} />}
      />
    </MiniList>
  );
}
