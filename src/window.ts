import type { ActionCreator } from 'redux';

import type { ShowSpecification } from '@skybrush/show-format';

/**
 * Type specification for the bridge that we inject into the window object
 * when running in Electron.
 */
export interface ElectronBridge {
  isElectron: boolean;

  getShowAsObjectFromLocalFile: (
    filename: string
  ) => Promise<ShowSpecification>;
  provideActions: (actionCreators: Record<string, ActionCreator<any>>) => void;
  selectLocalShowFileForOpening: () => Promise<string>;
  setTitle: (options: {
    appName?: string;
    representedFile?: string;
    alternateFile?: string;
  }) => void;
}

export interface WindowWithBridge extends Window {
  bridge: ElectronBridge;
}

export function isElectronWindow(window: Window): window is WindowWithBridge {
  const win: any = window;
  return (
    win.bridge !== undefined && (win as WindowWithBridge).bridge.isElectron
  );
}

export function getElectronBridge(): ElectronBridge | undefined {
  return isElectronWindow(window) ? window.bridge : undefined;
}
