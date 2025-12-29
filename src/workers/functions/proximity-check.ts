import type { Vector3 } from '@skybrush/show-format';
import { workerEmit } from 'workerpool';
import { areVectorsAlmostEqual } from '~/features/validation/calculations';
import getClosestPair from '~/features/validation/closest-pair';

export default function getClosestPairsAndDistances(
  positions: Vector3[][],
  times: number[]
): [Array<number | undefined>, Array<[number, number] | undefined>] {
  const frameCount = times.length;
  const droneCount = positions.length;
  const distances: Array<number | undefined> = Array.from({
    length: frameCount,
  });
  const indices: Array<[number, number] | undefined> = Array.from({
    length: frameCount,
  });
  const indexMap: number[] = [];
  const positionsInCurrentFrame: Vector3[] = [];
  let lastProgressAt = 0;

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
    const now = performance.now();
    if (now - lastProgressAt >= 100) {
      const progress = Math.round((frameIndex * 100) / frameCount);
      workerEmit({
        type: 'progress',
        progress,
      });
      lastProgressAt = now;
    }

    // We collect only those drones that are not at their takeoff or landing
    // positions. This is to provide sensible results for multi-stage shows
    // where half of the fleet is idling on the ground while the other half is
    // flying; in this case we are not interested in the minimum distance between
    // the drones on the ground, only between the flying ones.
    //
    // So, positionsInCurrentFrame will contain only the positions of the active drones,
    // and indexMap[i] contains the index of the i-th active drone.
    indexMap.length = 0;
    positionsInCurrentFrame.length = 0;
    for (let droneIndex = 0; droneIndex < droneCount; droneIndex++) {
      const pos = positions[droneIndex];
      if (
        pos.length > 0 &&
        !areVectorsAlmostEqual(pos[frameIndex], pos[0]) &&
        !areVectorsAlmostEqual(pos[frameIndex], pos.at(-1)!)
      ) {
        indexMap.push(droneIndex);
        positionsInCurrentFrame.push(pos[frameIndex]);
      }
    }

    // If all drones are idle, we can consider all of them for the closest pair calculation
    if (positionsInCurrentFrame.length === 0) {
      for (let droneIndex = 0; droneIndex < droneCount; droneIndex++) {
        const pos = positions[droneIndex];
        indexMap.push(droneIndex);
        positionsInCurrentFrame.push(pos[frameIndex]);
      }
    }

    const closestPair = getClosestPair(positionsInCurrentFrame);
    if (closestPair) {
      const firstIndex =
        indexMap[positionsInCurrentFrame.indexOf(closestPair[0])];
      const secondIndex =
        indexMap[positionsInCurrentFrame.indexOf(closestPair[1])];

      distances[frameIndex] = Math.hypot(
        closestPair[0].x - closestPair[1].x,
        closestPair[0].y - closestPair[1].y,
        closestPair[0].z - closestPair[1].z
      );
      indices[frameIndex] =
        firstIndex < secondIndex
          ? [firstIndex, secondIndex]
          : [secondIndex, firstIndex];
    } else {
      distances[frameIndex] = undefined;
      indices[frameIndex] = undefined;
    }
  }

  return [distances, indices];
}
