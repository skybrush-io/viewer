import { useCallback, useEffect, useId } from 'react';
import { useAppDispatch, useAppSelector } from '~/hooks/store';
import type { RootState } from '~/store';
import type { AsyncFnOptions } from '~/workers/types';
import ChartPanel, { type ChartPanelProps } from './ChartPanel';
import { handleAsyncOperation } from './actions';
import { selectChartById } from './slice';
import type { Chart } from './types';

export type AsyncChartPanelProps = Omit<
  ChartPanelProps,
  'calculation' | 'chart'
> & {
  fn: (options?: AsyncFnOptions) => Promise<Chart>;
};

/**
 * Asynchronous chart panel that starts the calculation of the chart when mounted and
 * cancels it when unmounted.
 */
const AsyncChartPanel = ({ fn, ...rest }: AsyncChartPanelProps) => {
  const dispatch = useAppDispatch();
  const id = useId();
  const selectCalculation = useCallback(
    (state: RootState) => selectChartById(state, id),
    [id]
  );

  useEffect(() => {
    const abortController = new AbortController();
    void dispatch(
      handleAsyncOperation(id, fn, { abortSignal: abortController.signal })
    );
    return () => {
      abortController.abort();
    };
  }, [fn, id]);

  const calculation = useAppSelector(selectCalculation);

  return <ChartPanel calculation={calculation} {...rest} />;
};

export default AsyncChartPanel;
