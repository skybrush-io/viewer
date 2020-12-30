import zipWith from 'lodash-es/zipWith';
import { createSelector } from '@reduxjs/toolkit';

import { getNamesOfDronesInShow } from '~/features/show/selectors';
import {
  getSampledTimeInstants,
  isSelectionEmpty,
} from '~/features/validation/selectors';

import { getIndicesOfSelectedDrones } from './items';

const createChartPoint = (x, y) => ({ x, y });

export const createChartPoints = (xs, ys) => zipWith(xs, ys, createChartPoint);

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
    (data, times) => {
      const minValues = [];
      const maxValues = [];
      const meanValues = [];

      const numberDrones = data.length;
      const numberFrames = times.length;

      minValues.length = numberFrames;
      maxValues.length = numberFrames;
      meanValues.length = numberFrames;

      for (let frameIndex = 0; frameIndex < numberFrames; frameIndex++) {
        const time = times[frameIndex];
        let minValue = Number.POSITIVE_INFINITY;
        let maxValue = Number.NEGATIVE_INFINITY;
        let sum = 0;

        for (let droneIndex = 0; droneIndex < numberDrones; droneIndex++) {
          const currentValue = data[droneIndex][frameIndex];
          minValue = Math.min(minValue, currentValue);
          maxValue = Math.max(maxValue, currentValue);
          sum += currentValue;
        }

        minValues[frameIndex] = { x: time, y: minValue };
        maxValues[frameIndex] = { x: time, y: maxValue };
        meanValues[frameIndex] = {
          x: time,
          y: sum / Math.max(numberDrones, 1),
        };
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
        {
          label: 'Mean',
          values: meanValues,
          role: 'mean',
        },
      ];
    }
  );

  return (state) =>
    isSelectionEmpty(state)
      ? getAggregatedChartData(state)
      : getChartDataForSelectedDrones(state);
};
