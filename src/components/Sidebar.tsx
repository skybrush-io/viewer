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
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import { type Theme } from '@mui/material/styles';

import { isThemeDark } from '@skybrush/app-theme-mui';

import { setPlaybackSpeed } from '~/features/playback/actions';
import { getPlaybackSpeed } from '~/features/playback/selectors';
import { closeSidebar } from '~/features/sidebar/slice';
import {
  setDroneSize,
  setScenery,
  toggleAxes,
  toggleGrid,
  toggleLabels,
  toggleScaleLabels,
  toggleYaw,
} from '~/features/settings/actions';
import { getDroneSize } from '~/features/settings/selectors';
import type { RootState } from '~/store';

import SkybrushLogo from './SkybrushLogo';
import Typography from '@mui/material/Typography';

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
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onSetDroneSize: (event: Event, value: number) => void;
  readonly onSetScenery: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly onSetPlaybackSpeed: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  readonly onToggleAxes: () => void;
  readonly onToggleGrid: () => void;
  readonly onToggleLabels: () => void;
  readonly onToggleScaleLabels: () => void;
  readonly onToggleYaw: () => void;
  readonly droneSize: number;
  readonly scaleLabels: boolean;
  readonly scenery: 'disabled' | 'auto' | 'day' | 'night' | 'indoor';
  readonly showAxes: boolean;
  readonly showGrid: boolean;
  readonly showLabels: boolean;
  readonly showYaw: boolean;
  readonly speed: number;
}

/**
 * Sidebar drawer component for the application.
 */
const SidebarDrawer = ({
  open,
  onClose,
  onSetDroneSize,
  onSetPlaybackSpeed,
  onSetScenery,
  onToggleAxes,
  onToggleGrid,
  onToggleLabels,
  onToggleScaleLabels,
  onToggleYaw,
  droneSize,
  scaleLabels,
  scenery,
  showAxes,
  showGrid,
  showLabels,
  showYaw,
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
              <MenuItem value='disabled'>Disabled</MenuItem>
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

        <Box px={2} pt={2} pb={1}>
          <Typography gutterBottom>Drone size</Typography>
          <Slider
            id='sidebar-drone-size'
            value={droneSize}
            valueLabelDisplay='auto'
            min={0.1}
            max={2}
            step={0.05}
            onChange={onSetDroneSize}
          />
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

        <ListItem>
          <Switch
            color='primary'
            edge='start'
            checked={showYaw}
            onChange={onToggleYaw}
          />
          <ListItemText primary='Show yaw indicators' />
        </ListItem>
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
    droneSize: getDroneSize(state),
    open: state.sidebar.open,
    scenery: state.settings.threeD.scenery,
    speed: getPlaybackSpeed(state),
    scaleLabels: Boolean(state.settings.threeD.scaleLabels),
    showAxes: Boolean(state.settings.threeD.axes),
    showGrid: state.settings.threeD.grid !== 'none',
    showLabels: Boolean(state.settings.threeD.showLabels),
    showYaw: Boolean(state.settings.threeD.showYaw),
  }),
  // mapDispatchToProps
  {
    onClose: closeSidebar,
    onSetDroneSize: setDroneSize,
    onSetScenery: setScenery,
    onSetPlaybackSpeed: (event: React.ChangeEvent<HTMLInputElement>) =>
      setPlaybackSpeed(Number.parseFloat(event.target.value)),
    onToggleAxes: toggleAxes,
    onToggleGrid: toggleGrid,
    onToggleLabels: toggleLabels,
    onToggleScaleLabels: toggleScaleLabels,
    onToggleYaw: toggleYaw,
  }
)(SidebarDrawer);
