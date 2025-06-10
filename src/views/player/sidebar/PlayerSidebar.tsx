import React from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { type Theme } from '@mui/material/styles';

import { isThemeDark } from '@skybrush/app-theme-mui';

import SkybrushLogo from '~/components/SkybrushLogo';
import { closeSidebar } from '~/features/sidebar/slice';
import { useAppDispatch, useAppSelector } from '~/hooks/store';

import PlayerSidebarTabs from './PlayerSidebarTabs';
import { getActiveSidebarTab } from '~/features/sidebar/selectors';
import { SidebarTab } from '~/features/sidebar/types';
import SettingsTab from './SettingsTab';

const styles = {
  contents: {
    height: '100%',
    width: 250,
    display: 'flex',
    flexDirection: 'column',
    pt: 1,
    pb: 2,
  },

  footer: {
    px: 2,
    pt: 2,
    textAlign: 'center',
    opacity: 0.4,
  },

  main: {
    flex: 1,
    overflowX: 'hidden',
  },

  root: {
    '& .MuiDrawer-paper': {
      backdropFilter: 'blur(24px)',
      background: (theme: Theme) =>
        isThemeDark(theme)
          ? 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) 80%, rgba(0, 0, 0, 0.75))'
          : 'rgba(255, 255, 255, 0.7)',
    },
  },
} as const;

const modalProps = {
  BackdropProps: {
    invisible: true,
  },
};

/**
 * Sidebar drawer component for the application.
 */
const PlayerSidebar = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.sidebar.open);
  const activeTab = useAppSelector(getActiveSidebarTab);

  return (
    <Drawer
      anchor='right'
      open={open}
      sx={styles.root}
      ModalProps={modalProps}
      onClose={() => {
        dispatch(closeSidebar());
      }}
    >
      <PlayerSidebarTabs />
      <Box sx={styles.contents}>
        <Box sx={styles.main}>
          {activeTab === SidebarTab.INSPECTOR && <div />}
          {activeTab === SidebarTab.SETTINGS && <SettingsTab />}
        </Box>
        <Box sx={styles.footer}>
          <a href='https://skybrush.io'>
            <SkybrushLogo />
          </a>
        </Box>
      </Box>
    </Drawer>
  );
};

export default PlayerSidebar;
