import { useHarmonicIntervalFn } from 'react-use';
import useRefresh from './useRefresh';

/**
 * A hook that triggers a refresh at a specified interval.
 * If the interval is null or undefined, no periodic refresh will be set up.
 *
 * @param interval The interval in milliseconds for the periodic refresh.
 */
export default function usePeriodicRefresh(interval?: number | null) {
  const forceUpdate = useRefresh();
  useHarmonicIntervalFn(forceUpdate, interval);
}
