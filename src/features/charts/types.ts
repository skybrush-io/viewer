/**
 * A single point on a 2D chart. The Y coordinate may be missing if the value is not
 * defined for that X coordinate.
 */
export type ChartPoint = {
  x: number;
  y?: number;
};

/**
 * A single point on a 2D chart, with a tooltip.
 */
export type ChartPointWithTip = ChartPoint & {
  tip?: string | undefined;
};

/**
 * Object representing a single dataset (typically a line) on a chart.
 */
export type ChartDataset = {
  // Array of data points for the dataset
  values: ChartPointWithTip[];

  // Label for the dataset
  label: string;

  // Role of the dataset in the chart (e.g., minimum, maximum, mean, single)
  role?: 'minimum' | 'maximum' | 'mean' | 'single';
};

/**
 * Object representing a chart.
 */
export type Chart = {
  datasets: ChartDataset[];
};

/**
 * Object representing the state of an operation that is calculating some data
 * asynchronously, with an optional progress information.
 */
export type CalculationState<T> = {
  id: string;
  status: 'idle' | 'calculating' | 'ready' | 'error' | 'cancelled';
  progress?: number | undefined;
  data?: T;
  error?: string;
};

export type ChartCalculationState = CalculationState<Chart>;
