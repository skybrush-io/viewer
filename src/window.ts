import type { AudioData } from '@skybrush/show-format';
import type { ActionCreator } from 'redux';

import type { UpdaterApi } from './desktop/launcher/auto-update';

/**
 * Type specification for the bridge that we inject into the window object
 * when running in Electron.
 */
export type ElectronBridge = UpdaterApi & {
  isElectron: boolean;

  provideActions: (
    actionCreators: Record<string, ActionCreator<unknown>>
  ) => void;
  readFile: (filename: string) => Promise<Buffer>;
  selectLocalShowFileForOpening: () => Promise<string>;
  setAudioBuffer: (index: number, options: AudioData) => Promise<string | null>;
  setTitle: (options: {
    appName?: string;
    representedFile?: string;
    alternateFile?: string;
  }) => Promise<void>;
};

export type WindowWithBridge = Window & {
  bridge: ElectronBridge;
};

export function isElectronWindow(window: Window): window is WindowWithBridge {
  const win: any = window;
  return (
    win.bridge !== undefined && (win as WindowWithBridge).bridge.isElectron
  );
}

export function getElectronBridge(): ElectronBridge | undefined {
  return isElectronWindow(window) ? window.bridge : undefined;
}
