import { type PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk, RootState } from '~/store';

import { findPanelById, type ValidationPanel } from './panels';
import { getSelection, getVisiblePanels } from './selectors';
import { setSelection, setVisiblePanels } from './slice';

function createItemToggler(
  getter: (state: RootState) => string[],
  setter: (selection: string[]) => PayloadAction<any>,
  { sort = false }: { sort?: any } = {}
) {
  return (itemId: string): AppThunk =>
    (dispatch, getState) => {
      const selection = getter(getState()) || [];
      const index = selection.indexOf(itemId);
      let newSelection;

      if (index >= 0) {
        newSelection = selection.concat();
        newSelection.splice(index, 1);
      } else {
        newSelection = selection.concat([itemId]);
        if (sort) {
          if (typeof sort === 'function') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            newSelection.sort(sort);
          } else {
            newSelection.sort();
          }
        }
      }

      dispatch(setter(newSelection));
    };
}

export const toggleItemInSelection = createItemToggler(
  getSelection,
  setSelection
);

export const togglePanelVisibility = createItemToggler(
  getVisiblePanels,
  setVisiblePanels,
  {
    sort(firstPanelId: ValidationPanel, secondPanelId: ValidationPanel) {
      const firstPanel = findPanelById(firstPanelId);
      const secondPanel = findPanelById(secondPanelId);
      return (firstPanel?.priority ?? 0) - (secondPanel?.priority ?? 0);
    },
  }
);

export function clearSelection() {
  return setSelection([]);
}
