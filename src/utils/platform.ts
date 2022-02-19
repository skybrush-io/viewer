/**
 * @file Utility functions related to platform detection and other
 * platform-specific stuff.
 */

/**
 * Constant that evaluates to true if we are running on a Mac, false
 * otherwise.
 */
export const isRunningOnMac: boolean = navigator.platform.includes('Mac');
