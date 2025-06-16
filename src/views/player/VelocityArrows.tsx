import React, { useRef } from 'react';
import type { TrajectoryPlayer, Vector3 } from '@skybrush/show-format';
import { getTrajectoryPlayers } from '~/features/show/selectors';
import { useAppSelector } from '~/hooks/store';
import {
  getElapsedSecondsGetter,
  isPlaying,
} from '~/features/playback/selectors';
import { getSelectedDroneIndices } from '~/features/selection/selectors';
import usePeriodicRefresh from '~/hooks/usePeriodicRefresh';

type VelocityArrowProps = {
  playing?: boolean;
  timestamp: number;
  trajectoryPlayer: TrajectoryPlayer;
};

type State = {
  position: Vector3;
  velocity: Vector3;
};

const createState = () => ({
  position: { x: 0, y: 0, z: 0 },
  velocity: { x: 0, y: 0, z: 0 },
});

const VelocityArrow = ({ trajectoryPlayer, timestamp }: VelocityArrowProps) => {
  const { getPositionAt, getVelocityAt } = trajectoryPlayer;

  const state = useRef<State | null>(null);
  if (!state.current) {
    state.current = createState();
  }

  const { position, velocity } = state.current;
  getPositionAt(timestamp, position);
  getVelocityAt(timestamp, velocity);

  const length = Math.hypot(velocity.x, velocity.y, velocity.z);

  return (
    <a-arrow
      position={`${position.x} ${position.y} ${position.z}`}
      direction={`${velocity.x} ${velocity.y} ${velocity.z}`}
      length={String(length)}
      color='#08f'
    />
  );
};

export default function VelocityArrows() {
  const selection = useAppSelector(getSelectedDroneIndices);
  const getTimestamp = useAppSelector(getElapsedSecondsGetter);
  const trajectoryPlayers = useAppSelector(getTrajectoryPlayers);
  const playing = useAppSelector(isPlaying);

  usePeriodicRefresh(playing ? 100 : null);

  const timestamp = getTimestamp();

  return (
    <>
      {selection.map((index) => (
        <VelocityArrow
          key={index}
          trajectoryPlayer={trajectoryPlayers[index]}
          timestamp={timestamp}
        />
      ))}
    </>
  );
}
