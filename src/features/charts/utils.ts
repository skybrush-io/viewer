import zipWith from 'lodash-es/zipWith';
import type { ChartPoint, ChartPointWithTip } from './types';

const createChartPoint = (x: number, y: number | undefined): ChartPoint => ({
  x,
  y,
});
const createChartPointWithTip = (
  x: number,
  y: number | undefined,
  tip: string | undefined
): ChartPointWithTip => ({
  x,
  y,
  tip,
});

export const createChartPoints = (
  xs: number[],
  ys: Array<number | undefined>
) => zipWith(xs, ys, createChartPoint);

export const createChartPointsWithTips = (
  xs: number[],
  ys: Array<number | undefined>,
  tips: Array<string | undefined>
) => zipWith(xs, ys, tips, createChartPointWithTip);
