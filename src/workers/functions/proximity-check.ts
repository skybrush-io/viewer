import { Vector3Array, type Vector3 } from '@skybrush/show-format';
import { workerEmit } from 'workerpool';
import { areVectorsAlmostEqual } from '~/features/validation/calculations';
import getClosestPair from '~/features/validation/closest-pair';

export type DistancesAndIndices = [
  Array<number | undefined>,
  Array<[number, number] | undefined>,
];

export default function getClosestPairsAndDistances(
  positionData: Float32Array,
  frameCount: number,
  droneCount: number,
  takeoffPositions?: Vector3[],
  landingPositions?: Vector3[]
): DistancesAndIndices {
  // positionData is encoded as a flat Float32Array where the positions of the drones
  // in each frame stored sequentially for all frames as follows:
  //
  // [drone0_frame0_x, drone0_frame0_y, drone0_frame0_z,
  //  drone1_frame0_x, drone1_frame0_y, drone1_frame0_z,
  //  ...,
  //  drone0_frame1_x, drone0_frame1_y, drone0_frame1_z,
  //  drone1_frame1_x, drone1_frame1_y, drone1_frame1_z,
  //  ...]
  //
  // This allows us to extract the positions in a frame simply by slicing the array.

  if (positionData.length !== frameCount * droneCount * 3) {
    throw new Error(
      `Expected position data length to be ${frameCount * droneCount * 3}, ` +
        `but got ${positionData.length}`
    );
  }

  const distances: Array<number | undefined> = Array.from({
    length: frameCount,
  });
  const indices: Array<[number, number] | undefined> = Array.from({
    length: frameCount,
  });
  const indexMap: number[] = [];
  const sizeOfSingleFrame = droneCount * 3;
  let lastProgressAt = 0;

  takeoffPositions ??= [];
  landingPositions ??= [];

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

    const allPositionsInCurrentFrame = Vector3Array.from(
      positionData.slice(
        frameIndex * sizeOfSingleFrame,
        (frameIndex + 1) * sizeOfSingleFrame
      )
    );
    let selectedPositionsInCurrentFrame: Vector3[] = [];

    // We collect only those drones that are not at their takeoff or landing
    // positions. This is to provide sensible results for multi-stage shows
    // where half of the fleet is idling on the ground while the other half is
    // flying; in this case we are not interested in the minimum distance between
    // the drones on the ground, only between the flying ones.
    //
    // So, positionsInCurrentFrame will contain only the positions of the active drones,
    // and indexMap[i] contains the index of the i-th active drone.
    indexMap.length = 0;
    selectedPositionsInCurrentFrame.length = 0;
    for (let droneIndex = 0; droneIndex < droneCount; droneIndex++) {
      const pos = allPositionsInCurrentFrame.get(droneIndex);
      const takeoffPos = takeoffPositions[droneIndex];
      const landingPos = landingPositions[droneIndex];

      if (
        !areVectorsAlmostEqual(pos, takeoffPos) &&
        !areVectorsAlmostEqual(pos, landingPos)
      ) {
        indexMap.push(droneIndex);
        selectedPositionsInCurrentFrame.push(pos);
      }
    }

    // If all drones are idle, we can consider all of them for the closest pair calculation
    if (selectedPositionsInCurrentFrame.length === 0) {
      selectedPositionsInCurrentFrame = allPositionsInCurrentFrame.toArray();
    }

    const closestPair = getClosestPair(selectedPositionsInCurrentFrame);
    if (closestPair) {
      const firstIndex =
        indexMap[selectedPositionsInCurrentFrame.indexOf(closestPair[0])];
      const secondIndex =
        indexMap[selectedPositionsInCurrentFrame.indexOf(closestPair[1])];

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
