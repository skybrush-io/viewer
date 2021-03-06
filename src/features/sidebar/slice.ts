/**
 * @file Slice of the state object that stores the state of the sidebar.
 */

import { createSlice } from '@reduxjs/toolkit';
import { noPayload } from '@skybrush/redux-toolkit';

interface SidebarSliceState {
  open: boolean;
}

const initialState: SidebarSliceState = {
  open: false,
};

const { actions, reducer } = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    closeSidebar: noPayload((state) => {
      state.open = false;
    }),

    toggleSidebar: noPayload((state) => {
      state.open = !state.open;
    }),
  },
});

export const { closeSidebar, toggleSidebar } = actions;

export default reducer;
