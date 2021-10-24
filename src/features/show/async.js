import { createAsyncThunk } from '@reduxjs/toolkit';

export const loadShow = createAsyncThunk(
  'show/load',
  async (promise) => promise
);

export const withProgressIndicator = createAsyncThunk(
  'show/withProgressIndicator',
  async (promise) => promise
);
