import { createAsyncThunk } from '@reduxjs/toolkit';

export const loadShow = createAsyncThunk('show/load', (promise) => {
  return promise;
});
