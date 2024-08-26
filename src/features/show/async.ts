import { createAsyncThunk } from '@reduxjs/toolkit';
import type { ShowLoadingRequest } from './types';

export const _doLoadShow = createAsyncThunk(
  'show/load',
  async ({ show }: ShowLoadingRequest) => {
    if (typeof show === 'function') {
      show = await show();
    }

    return show;
  }
);

export const withProgressIndicator = createAsyncThunk(
  'show/withProgressIndicator',
  async <T>(promise: any): Promise<T> => promise
) as any;
