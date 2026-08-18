import { useDispatch, useSelector } from 'react-redux';
import { checkForUpdates, installUpdate, selectAutoUpdateState } from './slice';

export const useAutoUpdate = () => {
  const updateState = useSelector(selectAutoUpdateState);
  const dispatch = useDispatch();
  return {
    checkForUpdates: () => {
      dispatch(checkForUpdates());
    },
    installUpdate: () => {
      dispatch(installUpdate());
    },
    ...updateState,
  };
};
