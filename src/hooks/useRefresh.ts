import { useReducer } from 'react';

/**
 * A custom hook that triggers a re-render of the component when called.
 * @returns A function that can be called to trigger a re-render.
 */
export default function useRefresh() {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  return forceUpdate;
}
