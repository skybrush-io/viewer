/**
 * Main entry point for workers used by the application.
 */

import type { Promise as WorkerPoolPromise } from 'workerpool';
import type { DistancesAndIndices } from './functions/proximity-check';
import { pool } from './pool';
import { type AsyncFnEvent, isAsyncFnEvent, type WorkerApi } from './types';
export type { AsyncFnOptions } from './types';

type Batch = [number, number];

const workers: WorkerApi = {
  async getClosestPairsAndDistances(positions, times, options?) {
    // We cannot transfer an AbortSignal to the worker so we need to handle it here
    const { abortSignal, handleEvent } = options ?? {};
    const execOptions: Parameters<typeof pool.exec>[2] = {};

    if (handleEvent) {
      execOptions.on = (payload) => {
        if (isAsyncFnEvent(payload)) {
          handleEvent(payload as AsyncFnEvent<DistancesAndIndices>);
        } else {
          console.warn('Unknown event received from worker:', payload);
        }
      };
    }

    // Extract takeoff and landing positions for each drone
    const takeoffPositions = positions.map((pos) => pos[0]);
    const landingPositions = positions.map((pos) => pos.at(-1)!);

    // We will send the frames to the workers in batches to avoid having to transfer
    // large arrays at once (which would cause an OOM condition in the worker).
    const batches: Batch[] = [];
    const frameCount = times.length;
    const result: DistancesAndIndices = [
      Array.from({ length: frameCount }),
      Array.from({ length: frameCount }),
    ];
    const batchSize = 100;
    for (let i = 0; i < frameCount; i += batchSize) {
      const end = Math.min(i + batchSize, frameCount);
      batches.push([i, end]);
    }

    const processBatch = async ([start, end]: Batch) => {
      const batchPositions = positions.map((dronePositions) =>
        dronePositions.slice(start, end)
      );
      const batchTimes = times.slice(start, end);

      // TODO(ntamas): not entirely correct yet; takeoff and landing positions need
      // to be considered from the full array, not just the batch!
      // TODO(ntamas): progress events need to be dispatched from here and not from
      // the worker, as we have multiple batches
      const promise: WorkerPoolPromise<DistancesAndIndices, Error> = pool.exec(
        'getClosestPairsAndDistances',
        [batchPositions, batchTimes, takeoffPositions, landingPositions],
        execOptions
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
    };

    await Promise.all(batches.map(processBatch));

    return result;
  },
};

export default workers;
