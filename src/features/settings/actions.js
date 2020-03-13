import { updateAppSettings } from './slice';

export const toggleGrid = () => (dispatch, getState) => {
  const state = getState();
  const { grid } = state.settings.threeD;

  dispatch(
    updateAppSettings('threeD', { grid: grid === 'none' ? '1x1' : 'none' })
  );
};
