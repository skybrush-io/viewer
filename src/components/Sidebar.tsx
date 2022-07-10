import React from 'react';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import { Theme } from '@mui/material/styles';

import { isThemeDark } from '@skybrush/app-theme-mui';

import { setPlaybackSpeed } from '~/features/playback/actions';
import { getPlaybackSpeed } from '~/features/playback/selectors';
import { closeSidebar } from '~/features/sidebar/slice';
import {
  setScenery,
  toggleAxes,
  toggleGrid,
  toggleLabels,
  toggleScaleLabels,
} from '~/features/settings/actions';
import type { RootState } from '~/store';

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

interface SidebarDrawerProps {
  open: boolean;
  onClose: () => void;
  onSetScenery: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSetPlaybackSpeed: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleAxes: () => void;
  onToggleGrid: () => void;
  onToggleLabels: () => void;
  onToggleScaleLabels: () => void;
  scaleLabels: boolean;
  scenery: 'auto' | 'day' | 'night' | 'indoor';
  showAxes: boolean;
  showGrid: boolean;
  showLabels: boolean;
  speed: number;
}

/**
 * Sidebar drawer component for the application.
 */
const SidebarDrawer = ({
  open,
  onClose,
  onSetPlaybackSpeed,
  onSetScenery,
  onToggleAxes,
  onToggleGrid,
  onToggleLabels,
  onToggleScaleLabels,
  scaleLabels,
  scenery,
  showAxes,
  showGrid,
  showLabels,
  speed,
}: SidebarDrawerProps) => (
  <Drawer
    anchor='right'
    open={open}
    sx={styles.root}
    ModalProps={modalProps}
    onClose={onClose}
  >
    <Box sx={styles.contents}>
      <List sx={styles.list}>
        <Box px={2}>
          <FormControl fullWidth variant='filled'>
            <InputLabel id='sidebar-environment-type-label'>Scenery</InputLabel>
            <Select
              labelId='sidebar-scenery-label'
              id='sidebar-scenery-label'
              value={scenery}
              onChange={onSetScenery}
            >
              <MenuItem value='auto'>Automatic</MenuItem>
              <MenuItem value='day'>Day</MenuItem>
              <MenuItem value='night'>Night</MenuItem>
              <MenuItem value='indoor'>Indoor</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box px={2} pt={2} pb={1}>
          <FormControl fullWidth variant='filled'>
            <InputLabel id='sidebar-playback-speed-label'>
              Playback speed
            </InputLabel>
            <Select
              labelId='sidebar-playback-speed-label'
              id='sidebar-playback-speed'
              value={speed}
              onChange={onSetPlaybackSpeed}
            >
              <MenuItem value='1'>1x</MenuItem>
              <MenuItem value='2'>2x</MenuItem>
              <MenuItem value='3'>3x</MenuItem>
              <MenuItem value='5'>5x</MenuItem>
              <MenuItem value='10'>10x</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <ListItem>
          <Switch
            color='primary'
            edge='start'
            checked={showAxes}
            onChange={onToggleAxes}
          />
          <ListItemText primary='Show axes' />
        </ListItem>

        <ListItem>
          <Switch
            color='primary'
            edge='start'
            checked={showGrid}
            onChange={onToggleGrid}
          />
          <ListItemText primary='Show grid' />
        </ListItem>

        <ListItem>
          <Switch
            color='primary'
            edge='start'
            checked={showLabels}
            onChange={onToggleLabels}
          />
          <ListItemText primary='Show labels' />
        </ListItem>

        {showLabels && (
          <ListItem>
            <Switch
              color='primary'
              edge='start'
              checked={scaleLabels}
              onChange={onToggleScaleLabels}
            />
            <ListItemText primary='Equalize label sizes' />
          </ListItem>
        )}
      </List>

      <Box sx={styles.footer}>
        <a href='https://skybrush.io'>
          <SkybrushLogo />
        </a>
      </Box>
    </Box>
  </Drawer>
);

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    open: state.sidebar.open,
    scenery: state.settings.threeD.scenery,
    speed: getPlaybackSpeed(state),
    scaleLabels: Boolean(state.settings.threeD.scaleLabels),
    showAxes: Boolean(state.settings.threeD.axes),
    showGrid: state.settings.threeD.grid !== 'none',
    showLabels: Boolean(state.settings.threeD.showLabels),
  }),
  // mapDispatchToProps
  {
    onClose: closeSidebar,
    onSetScenery: setScenery,
    onSetPlaybackSpeed: (event: React.ChangeEvent<HTMLInputElement>) =>
      setPlaybackSpeed(Number.parseFloat(event.target.value)),
    onToggleAxes: toggleAxes,
    onToggleGrid: toggleGrid,
    onToggleLabels: toggleLabels,
    onToggleScaleLabels: toggleScaleLabels,
  }
)(SidebarDrawer);
