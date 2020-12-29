import { createSelector } from '@reduxjs/toolkit';

import { getNamesOfDronesInShow } from '~/features/show/selectors';
import { SAMPLES_PER_SECOND } from '~/features/validation/constants';
import { isSelectionEmpty } from '~/features/validation/selectors';

import { getIndicesOfSelectedDrones } from './items';

export const createChartDataSelector = (selector) => {
  // Sub-selector that returns the chart data that should be shown if some
  // drones are selected explicitly.
  const getChartDataForSelectedDrones = createSelector(
    selector,
    getNamesOfDronesInShow,
    getIndicesOfSelectedDrones,
    (data, names, selectedDroneIndices) => {
      return selectedDroneIndices.map((index) => ({
        label: names[index],
        values: data[index],
      }));
    }
  );

  // Sub-selector that returns aggregated data series that contain the minimum,
  // maximum and mean of all the individual data points in the series
  // corresponding to the drones
  const getAggregatedChartData = createSelector(selector, (data) => {
    const minValues = [];
    const maxValues = [];
    const meanValues = [];

    const numberDrones = data.length;
    let maxFrame = 0;
    for (const dataForSingleDrone of data) {
      maxFrame = Math.max(
        Array.isArray(dataForSingleDrone) ? dataForSingleDrone.length : 0,
        maxFrame
      );
    }

    minValues.length = maxFrame;
    maxValues.length = maxFrame;
    meanValues.length = maxFrame;

    for (let frameIndex = 0; frameIndex < maxFrame; frameIndex++) {
      const time = frameIndex / SAMPLES_PER_SECOND;
      let minValue = Number.POSITIVE_INFINITY;
      let maxValue = Number.NEGATIVE_INFINITY;
      let sum = 0;

      for (let droneIndex = 0; droneIndex < numberDrones; droneIndex++) {
        const currentValue = data[droneIndex][frameIndex].y;
        minValue = Math.min(minValue, currentValue);
        maxValue = Math.max(maxValue, currentValue);
        sum += currentValue;
      }

      minValues[frameIndex] = { x: time, y: minValue };
      maxValues[frameIndex] = { x: time, y: maxValue };
      meanValues[frameIndex] = { x: time, y: sum / Math.max(numberDrones, 1) };
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
  });

  return (state) =>
    isSelectionEmpty(state)
      ? getAggregatedChartData(state)
      : getChartDataForSelectedDrones(state);
};
