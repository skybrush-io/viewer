import React from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { type Theme } from '@mui/material/styles';

import { isThemeDark } from '@skybrush/app-theme-mui';

import { closeSidebar } from '~/features/sidebar/slice';
import DroneSizeSlider from '~/features/settings/DroneSizeSlider';
import PlaybackSpeedSelector from '~/features/settings/PlaybackSpeedSelector';
import ScenerySelector from '~/features/settings/ScenerySelector';
import ThreeDViewSettingToggles from '~/features/settings/ThreeDViewSettingToggles';
import { useAppDispatch, useAppSelector } from '~/hooks/store';

import SkybrushLogo from './SkybrushLogo';

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
    textAlign: 'center',
    opacity: 0.4,
  },

  list: {
    background: 'unset',
    flex: 1,
  },

  root: {
    '& .MuiDrawer-paper': {
      background: (theme: Theme) =>
        isThemeDark(theme)
          ? 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) 80%, black)'
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
const SidebarDrawer = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.sidebar.open);

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
      <Box sx={styles.contents}>
        <List sx={styles.list}>
          <Box px={2}>
            <ScenerySelector />
          </Box>

          <Box px={2} pt={2} pb={1}>
            <PlaybackSpeedSelector />
          </Box>

          <Box px={2} pt={2} pb={1}>
            <DroneSizeSlider />
          </Box>

          <ThreeDViewSettingToggles />
        </List>

        <Box sx={styles.footer}>
          <a href='https://skybrush.io'>
            <SkybrushLogo />
          </a>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SidebarDrawer;
