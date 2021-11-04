import PropTypes from 'prop-types';
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
import makeStyles from '@mui/styles/makeStyles';
import { isThemeDark } from '@skybrush/app-theme-material-ui';

import { setPlaybackSpeed } from '~/features/playback/actions';
import { getPlaybackSpeed } from '~/features/playback/selectors';
import { closeSidebar } from '~/features/sidebar/slice';
import {
  setScenery,
  toggleAxes,
  toggleGrid,
} from '~/features/settings/actions';

import SkybrushLogo from './SkybrushLogo';

const useStyles = makeStyles(
  (theme) => ({
    contents: {
      height: '100%',
      width: 250,
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(1, 0),
    },

    footer: {
      padding: theme.spacing(0, 2),
      textAlign: 'center',
      opacity: 0.4,
    },

    list: {
      background: 'unset',
      flex: 1,
    },

    paper: {
      background: isThemeDark(theme)
        ? 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) 80%, black)'
        : 'rgba(255, 255, 255, 0.7)',
    },
  }),
  {
    name: 'Sidebar',
  }
);

const modalProps = {
  BackdropProps: {
    invisible: true,
  },
};

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
  scenery,
  showAxes,
  showGrid,
  speed,
}) => {
  const classes = useStyles();
  return (
    <Drawer
      anchor='right'
      open={open}
      classes={{ paper: classes.paper }}
      ModalProps={modalProps}
      onClose={onClose}
    >
      <div className={classes.contents}>
        <List className={classes.list}>
          <Box px={2}>
            <FormControl fullWidth variant='filled'>
              <InputLabel id='sidebar-environment-type-label'>
                Scenery
              </InputLabel>
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
        </List>

        <Box className={classes.footer}>
          <a href='https://skybrush.io'>
            <SkybrushLogo />
          </a>
        </Box>
      </div>
    </Drawer>
  );
};

SidebarDrawer.propTypes = {
  onClose: PropTypes.func,
  onSetPlaybackSpeed: PropTypes.func,
  onSetScenery: PropTypes.func,
  onToggleAxes: PropTypes.func,
  onToggleGrid: PropTypes.func,
  open: PropTypes.bool,
  scenery: PropTypes.oneOf(['auto', 'day', 'night', 'indoor']),
  showAxes: PropTypes.bool,
  showGrid: PropTypes.bool,
  speed: PropTypes.number,
};

export default connect(
  // mapStateToProps
  (state) => ({
    open: state.sidebar.open,
    scenery: state.settings.threeD.scenery,
    speed: getPlaybackSpeed(state),
    showAxes: Boolean(state.settings.threeD.axes),
    showGrid: state.settings.threeD.grid !== 'none',
  }),
  // mapDispatchToProps
  {
    onClose: closeSidebar,
    onSetScenery: setScenery,
    onSetPlaybackSpeed: (event) =>
      setPlaybackSpeed(Number.parseFloat(event.target.value)),
    onToggleAxes: toggleAxes,
    onToggleGrid: toggleGrid,
  }
)(SidebarDrawer);
