import { useAppDispatch, useAppSelector } from '~/hooks/store';
import {
  checkForUpdates as checkForUpdatesAction,
  installUpdate,
} from './slice';

export const useAutoUpdate = () => {
  const updateState = useAppSelector((state) => state.autoUpdate);
  const dispatch = useAppDispatch();
  return {
    checkForUpdates: () => {
      dispatch(checkForUpdatesAction());
    },
    installUpdate: () => {
      dispatch(installUpdate());
    },
    isCheckingForUpdates: updateState.checking,
    updateAvailable: updateState.updateInfo.available,
    supported: updateState.supported,
  };
};
