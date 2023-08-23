import { createAsyncThunk } from '@reduxjs/toolkit';

export const _doLoadShow = createAsyncThunk(
  'show/load',
  async <T>(promise: Promise<T>) => promise
);

export const withProgressIndicator = createAsyncThunk(
  'show/withProgressIndicator',
  async <T>(promise: Promise<T>) => promise
);
