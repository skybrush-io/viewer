import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { type Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { isThemeDark } from '@skybrush/app-theme-mui';

import SkybrushLogo from '~/components/SkybrushLogo';
import { PLAYER_SIDEBAR_WIDTH } from '~/constants';
import { getActiveSidebarTab } from '~/features/sidebar/selectors';
import { isSidebarOpen } from '~/features/sidebar/slice';
import { SidebarTab } from '~/features/sidebar/types';
import { useAppSelector } from '~/hooks/store';

import InspectorTab from './InspectorTab';
import PlayerSidebarTabs from './PlayerSidebarTabs';
import SettingsTab from './SettingsTab';

const styles = {
  contents: {
    display: 'flex',
    flexDirection: 'column',
    py: 1,
    flex: 1,
    minHeight: 0,
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
      <Box
        sx={{
          position: 'relative',
          width: PLAYER_SIDEBAR_WIDTH,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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
            <Typography align='center' variant='caption' component='footer'>
              {VERSION}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default PlayerSidebar;
