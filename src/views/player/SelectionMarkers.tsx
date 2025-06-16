import React, { useRef } from 'react';
import type { TrajectoryPlayer, Vector3 } from '@skybrush/show-format';
import { getTrajectoryPlayers } from '~/features/show/selectors';
import { useAppSelector } from '~/hooks/store';
import {
  getElapsedSecondsGetter,
  isPlaying,
} from '~/features/playback/selectors';
import { getSelectedDroneIndices } from '~/features/selection/selectors';
import { getEffectiveDroneRadius } from '~/features/three-d/selectors';
import usePeriodicRefresh from '~/hooks/usePeriodicRefresh';

type SelectionMarkerProps = {
  size: number;
  timestamp: number;
  trajectoryPlayer: TrajectoryPlayer;
};

type State = {
  position: Vector3;
};

const createState = () => ({
  position: { x: 0, y: 0, z: 0 },
});

const SelectionMarker = ({
  size,
  trajectoryPlayer,
  timestamp,
}: SelectionMarkerProps) => {
  const { getPositionAt } = trajectoryPlayer;

  const state = useRef<State | null>(null);
  if (!state.current) {
    state.current = createState();
  }

  const { position } = state.current;
  getPositionAt(timestamp, position);

  return (
    <a-box
      depth={size}
      height={size}
      width={size}
      position={`${position.x} ${position.y} ${position.z}`}
      color='#f80'
      material='shader: flat; opacity: 0.5;'
    />
  );
};

export default function SelectionMarkers() {
  const selection = useAppSelector(getSelectedDroneIndices);
  const getTimestamp = useAppSelector(getElapsedSecondsGetter);
  const trajectoryPlayers = useAppSelector(getTrajectoryPlayers);
  const droneRadius = useAppSelector(getEffectiveDroneRadius);
  const playing = useAppSelector(isPlaying);

  usePeriodicRefresh(playing ? 100 : null);

  const timestamp = getTimestamp();

  return (
    <>
      {selection.map((index) => (
        <SelectionMarker
          key={index}
          size={droneRadius * 3}
          trajectoryPlayer={trajectoryPlayers[index]}
          timestamp={timestamp}
        />
      ))}
    </>
  );
}
