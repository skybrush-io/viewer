/**
 * Main entry point for workers used by the application.
 */

import { pool } from './pool';
import type { WorkerApi } from './types';

const workers: WorkerApi = {
  getClosestPairsAndDistances: (...args) =>
    pool.exec('getClosestPairsAndDistances', args),
};

export default workers;
