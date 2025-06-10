/**
 * @file Slice of the state object that stores the state of the sidebar.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { noPayload } from '@skybrush/redux-toolkit';
import { SidebarTab } from './types';

interface SidebarSliceState {
  open: boolean;
  activeTab: SidebarTab;
}

const initialState: SidebarSliceState = {
  open: false,
  activeTab: SidebarTab.INSPECTOR,
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

    setActiveSidebarTab: (state, action: PayloadAction<SidebarTab>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { closeSidebar, setActiveSidebarTab, toggleSidebar } = actions;

export default reducer;
