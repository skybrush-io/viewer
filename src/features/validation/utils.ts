import { createSelector } from '@reduxjs/toolkit';
import zipWith from 'lodash-es/zipWith';

import { getNamesOfDronesInShow } from '~/features/show/selectors';
import type { RootState } from '~/store';

import { getIndicesOfSelectedDrones } from './items';
import { getSampledTimeInstants, isSelectionEmpty } from './selectors';
import type { ValidationSliceState } from './slice';

type ChartPoint = {
  x: number;
  y: number | null;
};

type ChartPointWithTip = ChartPoint & {
  tip: string | null;
};

const createChartPoint = (x: number, y: number | null): ChartPoint => ({
  x,
  y,
});
const createChartPointWithTip = (
  x: number,
  y: number | null,
  tip: string | null
): ChartPointWithTip => ({
  x,
  y,
  tip,
});

export const createChartPoints = (xs: number[], ys: Array<number | null>) =>
  zipWith(xs, ys, createChartPoint);

export const createChartPointsWithTips = (
  xs: number[],
  ys: Array<number | null>,
  tips: Array<string | null>
) => zipWith(xs, ys, tips, createChartPointWithTip);

export const createChartDataSelector = (
  selector: (state: RootState) => number[][]
) => {
  // Sub-selector that returns the chart data that should be shown if some
  // drones are selected explicitly.
  const getChartDataForSelectedDrones = createSelector(
    selector,
    getSampledTimeInstants,
    getNamesOfDronesInShow,
    getIndicesOfSelectedDrones,
    (
      data: number[][],
      times: number[],
      names: string[],
      selectedDroneIndices: number[]
    ) => {
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
      const minValues: ChartPointWithTip[] = [];
      const maxValues: ChartPointWithTip[] = [];

      const droneCount = data.length;
      const frameCount = times.length;

      minValues.length = frameCount;
      maxValues.length = frameCount;

      for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
        const time = times[frameIndex];
        let minValue = Number.POSITIVE_INFINITY;
        let maxValue = Number.NEGATIVE_INFINITY;
        let minIndex;
        let maxIndex;

        for (let droneIndex = 0; droneIndex < droneCount; droneIndex++) {
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
          tip: null,
        };
        if (minIndex !== undefined) {
          minValues[frameIndex].tip = names[minIndex];
        }

        maxValues[frameIndex] = {
          x: time,
          y: maxValue,
          tip: null,
        };
        if (maxIndex !== undefined) {
          maxValues[frameIndex].tip = names[maxIndex];
        }
      }

      return [
        {
          label: 'Maximum',
          values: maxValues,
          role: 'maximum',
        },
        {
          label: 'Minimum',
          values: minValues,
          role: 'minimum',
        },
      ];
    }
  );

  return (state: RootState) =>
    isSelectionEmpty(state)
      ? getAggregatedChartData(state)
      : getChartDataForSelectedDrones(state);
};

/**
 * Removes all messages from the state slice corresponding to the validation
 * reducer.
 */
export function removeAllMessages(state: ValidationSliceState) {
  state.messages.byId = {};
  state.messages.order = [];
}
