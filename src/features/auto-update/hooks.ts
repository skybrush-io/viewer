import { useAppDispatch, useAppSelector } from '~/hooks/store';
import { checkForUpdates, installUpdate } from './slice';

export const useAutoUpdate = () => {
  const updateState = useAppSelector((state) => state.autoUpdate);
  const dispatch = useAppDispatch();
  return {
    checkForUpdates: () => {
      dispatch(checkForUpdates());
    },
    installUpdate: () => {
      dispatch(installUpdate());
    },
    error: updateState.error,
    isCheckingForUpdates: updateState.checking,
    isDownloadingUpdate:
      typeof updateState.updateInfo.downloadProgress === 'number',
    downloadProgress: updateState.updateInfo.downloadProgress,
    updateAvailable: updateState.updateInfo.available,
    updateDownloaded: updateState.updateInfo.downloaded,
    updateSupported: updateState.supported,
  };
};
