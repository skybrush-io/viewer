/**
 * Main entry point for workers used by the application.
 */

import type { Promise } from 'workerpool';
import { pool } from './pool';
import { type AsyncFnEvent, isAsyncFnEvent, type WorkerApi } from './types';
export type { AsyncFnOptions } from './types';

const workers: WorkerApi = {
  async getClosestPairsAndDistances(positions, times, options?) {
    // We cannot transfer an AbortSignal to the worker so we need to handle it here
    const { abortSignal, handleEvent } = options ?? {};
    const execOptions: Parameters<typeof pool.exec>[2] = {};

    if (handleEvent) {
      execOptions.on = (payload) => {
        if (isAsyncFnEvent(payload)) {
          handleEvent(
            payload as AsyncFnEvent<
              Awaited<ReturnType<WorkerApi['getClosestPairsAndDistances']>>
            >
          );
        } else {
          console.warn('Unknown event received from worker:', payload);
        }
      };
    }

    const promise: Promise<
      ReturnType<WorkerApi['getClosestPairsAndDistances']>,
      Error
    > = pool.exec(
      'getClosestPairsAndDistances',
      [positions, times],
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
      return await promise;
    } catch (error) {
      abortSignal?.throwIfAborted();
      throw error;
    }
  },
};

export default workers;
