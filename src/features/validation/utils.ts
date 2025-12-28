import { createSelector } from '@reduxjs/toolkit';

import type { Chart, ChartPointWithTip } from '~/features/charts/types';
import { createChartPoints } from '~/features/charts/utils';
import { getNamesOfDronesInShow } from '~/features/show/selectors';
import type { RootState } from '~/store';

import { getIndicesOfSelectedDrones } from './items';
import { getSampledTimeInstants, isSelectionEmpty } from './selectors';

function aggregateDataSeries(
  data: number[][],
  times: number[],
  names: string[]
) {
  const minValues: ChartPointWithTip[] = [];
  const maxValues: ChartPointWithTip[] = [];
  let frameCount = 0;
  let seriesIndex = 0;
  for (const series of data) {
    const numCommonItems = Math.min(series.length, frameCount);

    for (let itemIndex = 0; itemIndex < numCommonItems; itemIndex++) {
      const currentValue = series[itemIndex];
      const minValue = minValues[itemIndex];
      const maxValue = maxValues[itemIndex];

      if (currentValue < minValue.y!) {
        minValue.y = currentValue;
        minValue.tip = names[seriesIndex];
      }

      if (currentValue > maxValue.y!) {
        maxValue.y = currentValue;
        maxValue.tip = names[seriesIndex];
      }
    }

    if (series.length > frameCount) {
      const tip = names[seriesIndex];
      minValues.splice(
        frameCount,
        0,
        ...series.slice(frameCount).map((y, index) => ({
          x: times[frameCount + index],
          y,
          tip,
        }))
      );
      maxValues.splice(
        frameCount,
        0,
        ...series.slice(frameCount).map((y, index) => ({
          x: times[frameCount + index],
          y,
          tip,
        }))
      );
      frameCount = series.length;
    }

    seriesIndex++;
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

export const createChartSelector = (
  selector: (state: RootState) => number[][],
  options: Omit<Chart, 'datasets'> = {}
): ((state: RootState) => Chart) => {
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

  // Sub-selector that returns aggregated data series that contain the minimum and
  // maximum of all the individual data points in the series corresponding to the drones
  const getAggregatedChartData = createSelector(
    selector,
    getSampledTimeInstants,
    getNamesOfDronesInShow,
    aggregateDataSeries
  );

  return (state: RootState) => ({
    datasets: isSelectionEmpty(state)
      ? getAggregatedChartData(state)
      : getChartDataForSelectedDrones(state),
    ...options,
  });
};
