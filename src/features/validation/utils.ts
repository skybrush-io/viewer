import { createSelector } from '@reduxjs/toolkit';

import type { Chart, ChartPointWithTip } from '~/features/charts/types';
import { createChartPoints } from '~/features/charts/utils';
import { getNamesOfDronesInShow } from '~/features/show/selectors';
import type { RootState } from '~/store';

import { getIndicesOfSelectedDrones } from './items';
import { getSampledTimeInstants, isSelectionEmpty } from './selectors';

type NamedDataProvider<T> = {
  getItemCount: () => number;
  getItemAt: (itemIndex: number) => T;
  getNameOfItemAt: (itemIndex: number) => string;
};

type ValidationDataProvider = NamedDataProvider<number[]>;

function aggregateDataSeries(
  dataProvider: ValidationDataProvider,
  times: number[]
) {
  const { getItemCount, getItemAt, getNameOfItemAt } = dataProvider;
  const minValues: ChartPointWithTip[] = [];
  const maxValues: ChartPointWithTip[] = [];
  const seriesCount = getItemCount();
  let frameCount = 0;

  for (let seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
    const series = getItemAt(seriesIndex);
    const name = getNameOfItemAt(seriesIndex);
    const numCommonItems = Math.min(series.length, frameCount);

    for (let itemIndex = 0; itemIndex < numCommonItems; itemIndex++) {
      const currentValue = series[itemIndex];
      const minValue = minValues[itemIndex];
      const maxValue = maxValues[itemIndex];

      if (currentValue < minValue.y!) {
        minValue.y = currentValue;
        minValue.tip = name;
      }

      if (currentValue > maxValue.y!) {
        maxValue.y = currentValue;
        maxValue.tip = name;
      }
    }

    if (series.length > frameCount) {
      minValues.splice(
        frameCount,
        0,
        ...series.slice(frameCount).map((y, index) => ({
          x: times[frameCount + index],
          y,
          name,
        }))
      );
      maxValues.splice(
        frameCount,
        0,
        ...series.slice(frameCount).map((y, index) => ({
          x: times[frameCount + index],
          y,
          name,
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

/**
 * Creates a chart selector that takes the current state of the application and
 * produces the data for a chart, given a _single_ selector that maps the state to
 * an array containing some precomputed data for all drones.
 *
 * In this function it is assumed that the provided selector is memoized so retrieving
 * an individual data series related to a drone is efficient.
 *
 * @param selector - a selector that takes the root state and returns an array where the
 *        i-th element is some precomputed data series for the i-th drone in the show
 * @param options - additional options to apply on the generated chart
 * @returns the chart selector
 */
export const createChartSelectorFromSwarmRelatedSelector = (
  selector: (state: RootState) => number[][],
  options: Omit<Chart, 'datasets'> = {}
): ((state: RootState) => Chart) => {
  const getDataProvider = createSelector(
    selector,
    getNamesOfDronesInShow,
    (data: number[][], names: string[]): ValidationDataProvider => ({
      getItemCount: () => data.length,
      getItemAt: (itemIndex: number) => data[itemIndex],
      getNameOfItemAt: (itemIndex: number) => names[itemIndex],
    })
  );

  // Sub-selector that returns the chart data that should be shown if some
  // drones are selected explicitly. This is relatively simple as the selection
  // only contains a few drones so we can just compute the data on the fly, saving
  // some memory.
  const getChartDataForSelectedDrones = (state: RootState) => {
    const { getItemAt, getNameOfItemAt } = getDataProvider(state);
    const times = getSampledTimeInstants(state);
    return getIndicesOfSelectedDrones(state).map((index) => ({
      label: getNameOfItemAt(index),
      values: createChartPoints(times, getItemAt(index)),
    }));
  };

  // Sub-selector that returns aggregated data series that contain the minimum and
  // maximum of all the individual data points in the series corresponding to the drones.
  // This needs to be cached separately to avoid re-computation when the user switches
  // back and forth between "no selection" and "some selection".
  const getAggregatedChartData = createSelector(
    getDataProvider,
    getSampledTimeInstants,
    aggregateDataSeries
  );

  return (state: RootState) => ({
    datasets: isSelectionEmpty(state)
      ? getAggregatedChartData(state)
      : getChartDataForSelectedDrones(state),
    ...options,
  });
};
