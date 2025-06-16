import React from 'react';

import ChevronRight from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { type Theme } from '@mui/material/styles';

import { isThemeDark } from '@skybrush/app-theme-mui';

import SkybrushLogo from '~/components/SkybrushLogo';
import { closeSidebar, isSidebarOpen } from '~/features/sidebar/slice';
import { getActiveSidebarTab } from '~/features/sidebar/selectors';
import { SidebarTab } from '~/features/sidebar/types';
import { useAppDispatch, useAppSelector } from '~/hooks/store';

import PlayerSidebarTabs from './PlayerSidebarTabs';
import SettingsTab from './SettingsTab';
import InspectorTab from './InspectorTab';

const styles = {
  contents: {
    height: '100%',
    width: 300,
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
  const open = useAppSelector(isSidebarOpen);
  const activeTab = useAppSelector(getActiveSidebarTab);

  return (
    <Drawer
      anchor='right'
      open={open}
      sx={styles.root}
      ModalProps={modalProps}
      variant='persistent'
    >
      <Stack direction='row' sx={{ height: '100%' }}>
        <IconButton
          disableRipple
          size='small'
          sx={{ p: 0 }}
          onClick={() => {
            dispatch(closeSidebar());
          }}
        >
          <ChevronRight />
        </IconButton>
        <Box sx={{ position: 'relative' }}>
          <PlayerSidebarTabs />
          <Box sx={styles.contents}>
            <Box sx={styles.main}>
              {activeTab === SidebarTab.INSPECTOR && <InspectorTab />}
              {activeTab === SidebarTab.SETTINGS && <SettingsTab />}
            </Box>
            <Box sx={styles.footer}>
              <a href='https://skybrush.io'>
                <SkybrushLogo />
              </a>
            </Box>
          </Box>
        </Box>
      </Stack>
    </Drawer>
  );
};

export default PlayerSidebar;
