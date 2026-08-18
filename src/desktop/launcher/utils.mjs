import { platform } from 'node:os';

export const isRunningOnMac = platform() === 'darwin';
