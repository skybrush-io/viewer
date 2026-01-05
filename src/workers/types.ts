import { type Vector3Array } from '@skybrush/show-format';
import type { DistancesAndIndices } from './functions/proximity-check';

/**
 * Events that can be sent from an async function to report progress.
 */
export type AsyncFnEvent<T> =
  | {
      type: 'progress';
      progress: number;
    }
  | {
      type: 'log';
      message: string;
    }
  | {
      type: 'partialResult';
      result: T;
    };

export function isAsyncFnEvent(event: unknown): event is AsyncFnEvent<unknown> {
  if (typeof event !== 'object' || event === null || !('type' in event)) {
    return false;
  }

  const eventType = (event as { type: unknown }).type;
  return (
    eventType === 'progress' ||
    eventType === 'log' ||
    eventType === 'partialResult'
  );
}

/**
 * An object that can provide an abort signal and event listeners to long-running operations.
 */
export type AsyncFnOptions = {
  /**
   * Abort signal, used both on the worker pool side and on the executor side. The
   * caller can inject an abort signal from an abort controller, and then use the
   * abort controller later to abort the operation. The executor side must call
   * `abortSignal.throwIfAborted()` periodically to check for abortion.
   */
  abortSignal?: AbortSignal;

  /**
   * Handles events from the executor when it reports progress, logs messages or
   * provides partial results to the caller.
   *
   * @param event - the event sent by the worker
   */
  handleEvent?: <T>(event: AsyncFnEvent<T>) => void;
};

/**
 * Converts a standard sync function signature into a "workerified" version that
 * returns a promise and has an extra argument for worker options.
 */
export type Workerify<F> = F extends (...args: infer A) => infer R
  ? (...args: [...A, options?: AsyncFnOptions]) => Promise<Awaited<R>>
  : never;

/**
 * Type specification for the API of functions exposed by the worker module.
 */
export type WorkerApi = {
  getClosestPairsAndDistances: (
    positions: Vector3Array[],
    times: number[],
    options?: AsyncFnOptions
  ) => Promise<DistancesAndIndices>;
};
