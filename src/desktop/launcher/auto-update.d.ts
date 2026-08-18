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

export function configureAutoUpdater(options?: UpdaterConfiguration): void;
export function getAutoUpdater(): AppUpdater;
export function checkForUpdates(
  options?: CheckForUpdateOptions
): Promise<UpdateInfo>;
export function registerUpdateListener(
  listener: (info: UpdateInfo) => void
): Disposer;
export function quitAndInstallUpdate(options?: CheckForUpdateOptions): void;
