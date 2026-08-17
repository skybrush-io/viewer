import { type AppUpdater } from 'electron-updater';

declare const _autoUpdater: AppUpdater;

export type UpdateInfo = {
  available: boolean;
  downloaded: boolean;
  downloading: boolean;
  version: string | null;
};

export type CheckForUpdateOptions = {
  silent?: boolean;
};

type Disposer = () => void;

declare const NO_UPDATES: UpdateInfo;

export function getAutoUpdater(): AppUpdater;
export function checkForUpdates(
  options?: CheckForUpdateOptions
): Promise<UpdateInfo>;
export function registerUpdateListener(
  listener: (info: UpdateInfo) => void
): Disposer;
export function quitAndInstallUpdate(options?: CheckForUpdateOptions): void;
