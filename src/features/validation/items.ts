import isNil from 'lodash-es/isNil';
import { orderBy } from 'natural-orderby';
import { createSelector } from '@reduxjs/toolkit';

import { getNamesOfDronesInShow } from '~/features/show/selectors';

import type { RootState } from '~/store';

/**
 * Creates a validation chart item ID that represents a single drone with the
 * given index.
 */
export function createItemIdForDroneIndex(index: number): string | undefined {
  return typeof index === 'number' && index >= 0
    ? 'drone$' + String(index)
    : undefined;
}

/**
 * Parses a validation chart item ID and returns the index of the drone that it
 * represents, or undefined if the validation chart item represents multiple
 * drones.
 */
export function getDroneIndexFromItemId(itemId: string): number | undefined {
  return itemId.startsWith('drone$')
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
    orderBy(
      names.map((name, index) => ({
        id: createItemIdForDroneIndex(index) ?? 'invalid',
        label: name,
      })),
      ['label']
    )
);

export const getIndicesOfSelectedDrones = createSelector(
  (state: RootState) => state.validation.selection,
  (itemIds: string[]): number[] =>
    (itemIds || [])
      .map(getDroneIndexFromItemId)
      .filter((item): item is number => !isNil(item))
);
