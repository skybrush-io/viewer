import type { TrajectoryPlayer, Vector3 } from '@skybrush/show-format';
import { useRef } from 'react';
import {
  getElapsedSecondsGetter,
  isPlaying,
} from '~/features/playback/selectors';
import { getSelectedDroneIndices } from '~/features/selection/selectors';
import { getTrajectoryPlayers } from '~/features/show/selectors';
import { getEffectiveDroneRadius } from '~/features/three-d/selectors';
import { useAppSelector } from '~/hooks/store';
import usePeriodicRefresh from '~/hooks/usePeriodicRefresh';

type SelectionMarkerProps = {
  size: number;
  timestamp: number;
  trajectoryPlayer?: TrajectoryPlayer;
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
  const state = useRef<State | null>(null);
  if (!state.current) {
    state.current = createState();
  }

  const { position } = state.current;
  if (trajectoryPlayer) {
    trajectoryPlayer.getPositionAt(timestamp, position);
  } else {
    position.x = 0;
    position.y = 0;
    position.z = 0;
  }

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
