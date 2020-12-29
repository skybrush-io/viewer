import { getSelection, getVisiblePanels } from './selectors';
import { setSelection, setVisiblePanels } from './slice';

function createItemToggler(getter, setter) {
  return (itemId) => (dispatch, getState) => {
    const selection = getter(getState()) || [];
    const index = selection.indexOf(itemId);
    const newSelection =
      index >= 0 ? selection.concat() : selection.concat([itemId]);

    if (index >= 0) {
      newSelection.splice(index, 1);
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
  setVisiblePanels
);

export function clearSelection() {
  return setSelection([]);
}
