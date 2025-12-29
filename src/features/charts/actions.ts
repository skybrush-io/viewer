import type { AppThunk } from '~/store';
import type { AsyncFnOptions } from '~/workers';
import type { AsyncFnEvent } from '~/workers/types';
import {
  _cancel,
  _finishSuccessfully,
  _finishWithError,
  _start,
  _updateProgress,
} from './slice';
import type { Chart } from './types';

export function handleAsyncOperation<T extends Chart = Chart>(
  id: string,
  fn: (options?: AsyncFnOptions) => Promise<T>,
  options?: AsyncFnOptions
): AppThunk<Promise<void>> {
  return async (dispatch, _getState) => {
    let result: T;
    const { handleEvent: handleEventInner, ...restOptions } = options ?? {};

    const handleEvent = (event: AsyncFnEvent<any>) => {
      switch (event.type) {
        case 'progress':
          dispatch(_updateProgress({ id, progress: event.progress }));
          break;

        case 'log':
          console.log(event.message);
          break;

        case 'partialResult':
          // TODO(ntamas)
          break;
      }

      if (handleEventInner) {
        handleEventInner(event);
      }
    };

    dispatch(_start({ id }));
    try {
      result = await fn({ handleEvent, ...restOptions });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        dispatch(_cancel({ id }));
      } else {
        console.error(error);
        dispatch(
          _finishWithError({
            id,
            error: error instanceof Error ? error.message : String(error),
          })
        );
      }
      return;
    }

    dispatch(
      _finishSuccessfully({
        id,
        data: result,
      })
    );
  };
}
