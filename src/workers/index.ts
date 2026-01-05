/**
 * Main entry point for workers used by the application.
 */

import { Vector3Array } from '@skybrush/show-format';
import type { Promise as WorkerPoolPromise } from 'workerpool';
import type { DistancesAndIndices } from './functions/proximity-check';
import { pool } from './pool';
import { type WorkerApi } from './types';
export type { AsyncFnOptions } from './types';

type Batch = [number, number];

const workers: WorkerApi = {
  async getClosestPairsAndDistances(positions, times, options?) {
    // We cannot transfer an AbortSignal to the worker so we need to handle it here
    const { abortSignal, handleEvent } = options ?? {};

    // Extract takeoff and landing positions for each drone
    const takeoffPositions = positions.map((pos) => pos.at(0)!);
    const landingPositions = positions.map((pos) => pos.at(-1)!);

    // We will send the frames to the workers in batches to avoid having to transfer
    // large arrays at once (which would cause an OOM condition in the worker).
    const batches: Batch[] = [];
    const droneCount = positions.length;
    const frameCount = times.length;
    const result: DistancesAndIndices = [
      Array.from({ length: frameCount }),
      Array.from({ length: frameCount }),
    ];
    const batchSize = 100;
    let numBatchesProcessed = 0;

    for (let i = 0; i < frameCount; i += batchSize) {
      const end = Math.min(i + batchSize, frameCount);
      batches.push([i, end]);
    }

    const processBatch = async ([start, end]: Batch) => {
      const batchFrameCount = end - start;
      const batchPositions = new Vector3Array(batchFrameCount * droneCount);
      for (let droneIndex = 0; droneIndex < droneCount; droneIndex++) {
        const trajectorySlice = positions[droneIndex].slice(start, end);
        trajectorySlice.copyInto(batchPositions, {
          start: droneIndex,
          step: droneCount,
        });
      }
      const batchPositionsArray = batchPositions.release();
      const promise: WorkerPoolPromise<DistancesAndIndices, Error> = pool.exec(
        'getClosestPairsAndDistances',
        [
          batchPositionsArray,
          batchFrameCount,
          droneCount,
          takeoffPositions,
          landingPositions,
        ],
        { transfer: [batchPositionsArray.buffer] }
      );

      if (abortSignal) {
        if (abortSignal.aborted) {
          promise.cancel();
        } else {
          abortSignal.addEventListener('abort', () => {
            promise.cancel();
          });
        }
      }

      try {
        const [distances, indices] = await promise;
        result[0].splice(start, distances.length, ...distances);
        result[1].splice(start, indices.length, ...indices);
      } catch (error) {
        abortSignal?.throwIfAborted();
        throw error;
      }

      numBatchesProcessed += 1;

      if (handleEvent) {
        handleEvent({
          type: 'progress',
          progress: Math.ceil((100 * numBatchesProcessed) / batches.length),
        });
      }
    };

    await Promise.all(batches.map(processBatch));

    return result;
  },
};

export default workers;
