import get from 'lodash-es/get';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const loadShow = createAsyncThunk(
  'show/load',
  async (promise) => promise
);
