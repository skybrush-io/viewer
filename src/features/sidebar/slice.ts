/**
 * @file Slice of the state object that stores the state of the sidebar.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { noPayload } from '@skybrush/redux-toolkit';
import { SidebarTab } from './types';

type SidebarSliceState = {
  open: boolean;
  activeTab: SidebarTab;
};

const initialState: SidebarSliceState = {
  open: false,
  activeTab: SidebarTab.INSPECTOR,
};

const { actions, reducer, selectors } = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    closeSidebar: noPayload((state) => {
      state.open = false;
    }),

    toggleSidebar: noPayload((state) => {
      state.open = !state.open;
    }),

    setActiveSidebarTab: (state, action: PayloadAction<SidebarTab>) => {
      state.activeTab = action.payload;
    },
  },
  selectors: {
    isSidebarOpen: (state: SidebarSliceState) => state.open,
  },
});

export const { closeSidebar, setActiveSidebarTab, toggleSidebar } = actions;
export const { isSidebarOpen } = selectors;

export default reducer;
