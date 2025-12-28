import type { TrajectoryPlayer, Vector3 } from '@skybrush/show-format';
import { range } from 'lodash-es';
import getClosestPair from './closest-pair';
import { SAMPLES_PER_SECOND } from './constants';

/**
 * Checks whether two 3D vectors are almost equal within a given epsilon.
 */
export const areVectorsAlmostEqual = (
  a: Vector3,
  b: Vector3,
  eps = 0.05
): boolean =>
  Math.abs(a.x - b.x) < eps &&
  Math.abs(a.y - b.y) < eps &&
  Math.abs(a.z - b.z) < eps;

/**
 * Calculates the derivative of a vector of scalars where the derivative at
 * index i is estimated from the values at indices (i-k) and (i+k), i.e. we
 * are using the midpoint method with a step size of k.
 */
export function calculateScalarDerivative(
  values: number[],
  numSteps = 1,
  dt = 1
): number[] {
  const n = values.length;
  const result: number[] = Array.from({ length: n });
  const scale = 2 * numSteps * dt;
  for (let i = numSteps; i < n - numSteps; i++) {
    result[i] = (values[i + numSteps] - values[i - numSteps]) / scale;
  }

  // Fill the endpoints
  if (n >= 2 * numSteps + 1) {
    for (let i = 0; i < numSteps; i++) {
      result[i] = result[numSteps];
      result[n - i - 1] = result[n - numSteps - 1];
    }
  } else {
    result.fill(0);
  }

  return result;
}

/**
 * Calculates the derivative of a vector of 3D vectors where the derivative at
 * index i is estimated from the vectors at indices (i-k) and (i+k), i.e. we
 * are using the midpoint method with a step size of k.
 */
export function calculateVectorDerivative(
  values: Vector3[],
  numSteps = 1,
  dt = 1
): Vector3[] {
  const n = values.length;
  const result: Vector3[] = Array.from({ length: n });
  const scale = 2 * numSteps * dt;
  for (let i = numSteps; i < n - numSteps; i++) {
    result[i] = {
      x: (values[i + numSteps].x - values[i - numSteps].x) / scale,
      y: (values[i + numSteps].y - values[i - numSteps].y) / scale,
      z: (values[i + numSteps].z - values[i - numSteps].z) / scale,
    };
  }

  // Fill the endpoints
  if (n >= 2 * numSteps + 1) {
    for (let i = 0; i < numSteps; i++) {
      result[i] = result[numSteps];
      result[n - i - 1] = result[n - numSteps - 1];
    }
  } else {
    const ZERO = { x: 0, y: 0, z: 0 };
    result.fill(ZERO);
  }

  return result;
}

/**
 * Projects a 3D vector to the XY plane and returns the length of the projected vector.
 */
export const projectToXY = (coord: Vector3) => Math.hypot(coord.x, coord.y);

/**
 * Projects a 3D vector to the Z axis and returns the length of the projected vector.
 */
export const projectToZ = (coord: Vector3) => coord.z;

/**
 * Projects multiple 3D vectors to the XY plane and returns the lengths of the projected vectors.
 */
export const projectAllToXY = (vectors: Vector3[]) => vectors.map(projectToXY);

/**
 * Projects multiple 3D vectors to the Z axis and returns the lengths of the projected vectors.
 */
export const projectAllToZ = (vectors: Vector3[]) => vectors.map(projectToZ);

/**
 * Samples a time interval evenly at a fixed rate.
 *
 * @param duration    the duration of the time interval
 * @param sampleRate  the sampling rate (samples per second)
 * @returns An array of time instants (in seconds) sampled evenly over the duration.
 *      It is ensured that the last sample is exactly at the end of the duration.
 */
export function sampleDurationEvenly(
  duration: number,
  sampleRate: number = SAMPLES_PER_SECOND
): number[] {
  const sampleCount = Math.ceil(duration * sampleRate);
  const result = range(sampleCount).map((x) => x / sampleRate);

  if (result.length > 0 && result.at(-1)! < duration) {
    result.push(duration);
  }

  return result;
}

/**
 * Samples the positions of a trajectory at the given time instants.
 *
 * @param player the trajectory player to use for sampling the trajectory
 * @param times  the time instants (in seconds) at which to sample the trajectory
 */
export function samplePositionAt(
  player: TrajectoryPlayer,
  times: number[]
): Vector3[] {
  return times.map((time) =>
    player.getPositionAt(time, {
      x: 0,
      y: 0,
      z: 0,
    } as Vector3)
  );
}

/**
 * Samples the velocities of a trajectory at the given time instants.
 *
 * @param player the trajectory player to use for sampling the trajectory
 * @param times  the time instants (in seconds) at which to sample the trajectory
 */
export function sampleVelocityAt(
  player: TrajectoryPlayer,
  times: number[]
): Vector3[] {
  return times.map((time) =>
    player.getVelocityAt(time, {
      x: 0,
      y: 0,
      z: 0,
    } as Vector3)
  );
}

export function getClosestPairsAndDistances(
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

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
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
