import isNil from 'lodash-es/isNil';
import sortBy from 'lodash-es/sortBy';
import { createSelector } from '@reduxjs/toolkit';

import { getNamesOfDronesInShow } from '~/features/show/selectors';

/**
 * Creates a validation chart item ID that represents a single drone with the
 * given index.
 */
export function createItemIdForDroneIndex(index) {
  return typeof index === 'number' && index >= 0 ? 'drone$' + index : undefined;
}

/**
 * Parses a validation chart item ID and returns the index of the drone that it
 * represents, or undefined if the validation chart item represents multiple
 * drones.
 */
export function getDroneIndexFromItemId(itemId) {
  return itemId.slice(0, 6) === 'drone$'
    ? Number.parseInt(itemId.slice(6), 10)
    : undefined;
}

/**
 * Selector that takes the current state object and returns the list of
 * single-drone item IDs and their corresponding labels to use in the sidebar.
 */
export const getSidebarItemsForSingleDrones = createSelector(
  getNamesOfDronesInShow,
  (names) =>
    sortBy(
      names.map((name, index) => ({
        id: createItemIdForDroneIndex(index),
        label: name,
      })),
      ['label']
    )
);

export const getIndicesOfSelectedDrones = createSelector(
  (state) => state.validation.selection,
  (itemIds) =>
    (itemIds || []).map(getDroneIndexFromItemId).filter((item) => !isNil(item))
);
