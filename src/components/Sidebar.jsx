import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';

import { closeSidebar } from '~/features/sidebar/slice';
import { setScenery, toggleGrid } from '~/features/settings/actions';
import { isDark } from '~/theme';

const logo = require('~/../assets/img/logo.png').default;

const useStyles = makeStyles(
  theme => ({
    contents: {
      height: '100%',
      width: 250,
      display: 'flex',
      flexDirection: 'column'
    },

    footer: {
      padding: theme.spacing(2),
      textAlign: 'center',
      opacity: 0.4
    },

    list: {
      background: 'unset',
      flex: 1
    },

    paper: {
      background: isDark(theme)
        ? 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) 80%, black)'
        : 'rgba(255, 255, 255, 0.7)'
    }
  }),
  {
    name: 'Sidebar'
  }
);

const modalProps = {
  BackdropProps: {
    invisible: true
  }
};

/**
 * Sidebar drawer component for the application.
 */
const SidebarDrawer = ({
  open,
  onClose,
  onSetScenery,
  onToggleGrid,
  scenery,
  showGrid
}) => {
  const classes = useStyles();
  return (
    <Drawer
      anchor="right"
      open={open}
      classes={{ paper: classes.paper }}
      ModalProps={modalProps}
      onClose={onClose}
    >
      <div className={classes.contents}>
        <List className={classes.list}>
          <Box px={2}>
            <FormControl fullWidth variant="filled">
              <InputLabel id="sidebar-environment-type-label">
                Scenery
              </InputLabel>
              <Select
                labelId="sidebar-environment-type-label"
                id="sidebar-environment-type"
                value={scenery}
                onChange={onSetScenery}
              >
                <MenuItem value="day">Day</MenuItem>
                <MenuItem value="night">Night</MenuItem>
                <MenuItem value="indoor">Indoor</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <ListItem>
            <Switch
              color="primary"
              edge="start"
              checked={showGrid}
              onChange={onToggleGrid}
            />
            <ListItemText primary="Show grid" />
          </ListItem>
        </List>

        <Box className={classes.footer}>
          <a href="https://skybrush.io">
            <img src={logo} alt="Skybrush Viewer" width="160" />
          </a>
        </Box>
      </div>
    </Drawer>
  );
};

SidebarDrawer.propTypes = {
  onClose: PropTypes.func,
  onSetScenery: PropTypes.func,
  onToggleGrid: PropTypes.func,
  open: PropTypes.bool,
  scenery: PropTypes.oneOf(['day', 'night', 'indoor']),
  showGrid: PropTypes.bool
};

export default connect(
  // mapStateToProps
  state => ({
    open: state.sidebar.open,
    scenery: state.settings.threeD.scenery,
    showGrid: state.settings.threeD.grid !== 'none'
  }),
  // mapDispatchToProps
  {
    onClose: closeSidebar,
    onSetScenery: setScenery,
    onToggleGrid: toggleGrid
  }
)(SidebarDrawer);
