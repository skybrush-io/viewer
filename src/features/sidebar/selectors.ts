import type { RootState } from '~/store';
import { SidebarTab } from './types';

export const getActiveSidebarTab = (state: RootState) =>
  state.sidebar.activeTab ?? SidebarTab.INSPECTOR;
