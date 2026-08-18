import type { AppUpdater } from 'electron-updater';

export type UpdaterConfiguration = {
  log?: AppUpdater['logger'] | null | undefined;
};

export type UpdateInfo = {
  available: boolean;
  downloaded: boolean;
  downloadProgress: number | null;
  version: string | null;
};

export type CheckForUpdateOptions = {
  silent?: boolean;
};

type Disposer = () => void;

export function initialize(options?: UpdaterConfiguration): void;
export function checkForUpdates(
  options?: CheckForUpdateOptions
): Promise<UpdateInfo>;
export function quitAndInstallUpdate(options?: CheckForUpdateOptions): void;
