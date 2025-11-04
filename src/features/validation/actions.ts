import { type PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk, RootState } from '~/store';

import { findPanelById, type ValidationPanel } from './panels';
import { getSelection, getVisiblePanels } from './selectors';
import { setSelection, setVisiblePanels } from './slice';

const createItemToggler =
  <T>(
    getter: (state: RootState) => T[],
    setter: (selection: T[]) => PayloadAction<any>,
    { sort = false }: { sort?: boolean | ((a: T, b: T) => number) } = {}
  ) =>
  (itemId: T): AppThunk =>
  (dispatch, getState) => {
    const selection = getter(getState()) || [];

    const newSelection = selection.includes(itemId)
      ? selection.toSpliced(selection.indexOf(itemId), 1)
      : sort
        ? typeof sort === 'function'
          ? [...selection, itemId].toSorted(sort)
          : [...selection, itemId].toSorted()
        : [...selection, itemId];

    dispatch(setter(newSelection));
  };

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
