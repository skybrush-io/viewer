import type { RootState } from '~/store';

export const getSelectedDroneIndices = (state: RootState) =>
  state.selection.droneIndices;
