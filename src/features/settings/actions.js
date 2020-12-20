import { updateAppSettings } from './slice';

export const setScenery = (event) => (dispatch) => {
  dispatch(updateAppSettings('threeD', { scenery: event.target.value }));
};

export const toggleGrid = () => (dispatch, getState) => {
  const state = getState();
  const { grid } = state.settings.threeD;

  dispatch(
    updateAppSettings('threeD', { grid: grid === 'none' ? '1x1' : 'none' })
  );
};
