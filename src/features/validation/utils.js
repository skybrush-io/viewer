import zipWith from 'lodash-es/zipWith';
import { createSelector } from '@reduxjs/toolkit';

import { getNamesOfDronesInShow } from '~/features/show/selectors';

import { getIndicesOfSelectedDrones } from './items';
import { getSampledTimeInstants, isSelectionEmpty } from './selectors';

const createChartPoint = (x, y) => ({ x, y });
const createChartPointWithTip = (x, y, tip) => ({ x, y, tip });

export const createChartPoints = (xs, ys) => zipWith(xs, ys, createChartPoint);
export const createChartPointsWithTips = (xs, ys, tips) =>
  zipWith(xs, ys, tips, createChartPointWithTip);

export const createChartDataSelector = (selector) => {
  // Sub-selector that returns the chart data that should be shown if some
  // drones are selected explicitly.
  const getChartDataForSelectedDrones = createSelector(
    selector,
    getSampledTimeInstants,
    getNamesOfDronesInShow,
    getIndicesOfSelectedDrones,
    (data, times, names, selectedDroneIndices) => {
      return selectedDroneIndices.map((index) => ({
        label: names[index],
        values: createChartPoints(times, data[index]),
      }));
    }
  );

  // Sub-selector that returns aggregated data series that contain the minimum,
  // maximum and mean of all the individual data points in the series
  // corresponding to the drones
  const getAggregatedChartData = createSelector(
    selector,
    getSampledTimeInstants,
    getNamesOfDronesInShow,
    (data, times, names) => {
      const minValues = [];
      const maxValues = [];

      const numberDrones = data.length;
      const numberFrames = times.length;

      minValues.length = numberFrames;
      maxValues.length = numberFrames;

      for (let frameIndex = 0; frameIndex < numberFrames; frameIndex++) {
        const time = times[frameIndex];
        let minValue = Number.POSITIVE_INFINITY;
        let maxValue = Number.NEGATIVE_INFINITY;
        let minIndex;
        let maxIndex;

        for (let droneIndex = 0; droneIndex < numberDrones; droneIndex++) {
          const currentValue = data[droneIndex][frameIndex];

          if (minValue > currentValue) {
            minValue = currentValue;
            minIndex = droneIndex;
          }

          if (maxValue < currentValue) {
            maxValue = currentValue;
            maxIndex = droneIndex;
          }
        }

        minValues[frameIndex] = {
          x: time,
          y: minValue,
        };
        if (minIndex !== undefined) {
          minValues[frameIndex].tip = names[minIndex];
        }

        maxValues[frameIndex] = {
          x: time,
          y: maxValue,
        };
        if (maxIndex !== undefined) {
          maxValues[frameIndex].tip = names[maxIndex];
        }
      }

      return [
        {
          label: 'Minimum',
          values: minValues,
          role: 'minimum',
        },
        {
          label: 'Maximum',
          values: maxValues,
          role: 'maximum',
        },
      ];
    }
  );

  return (state) =>
    isSelectionEmpty(state)
      ? getAggregatedChartData(state)
      : getChartDataForSelectedDrones(state);
};

/**
 * Removes all messages from the state slice corresponding to the validation
 * reducer.
 */
export function removeAllMessages(state) {
  state.messages.byId = {};
  state.messages.order = [];
}
