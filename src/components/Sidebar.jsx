import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';

import { closeSidebar } from '~/features/sidebar/slice';
import { toggleGrid } from '~/features/settings/actions';
import { isDark } from '~/theme';

const useStyles = makeStyles(theme => ({
  contents: {
    width: 250
  },

  list: {
    background: 'unset'
  },

  paper: {
    backgroundColor: isDark(theme)
      ? 'rgba(0, 0, 0, 0.5)'
      : 'rgba(255, 255, 255, 0.7)'
  }
}));

const modalProps = {
  BackdropProps: {
    invisible: true
  }
};

/**
 * Sidebar drawer component for the application.
 */
const SidebarDrawer = ({ open, onClose, showGrid, toggleGrid }) => {
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
          <ListItem>
            <Switch edge="start" checked={showGrid} onChange={toggleGrid} />
            <ListItemText primary="Grid" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

SidebarDrawer.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  showGrid: PropTypes.bool,
  toggleGrid: PropTypes.func
};

export default connect(
  // mapStateToProps
  state => ({
    open: state.sidebar.open,
    showGrid: state.settings.threeD.grid !== 'none'
  }),
  // mapDispatchToProps
  {
    close: closeSidebar,
    toggleGrid
  }
)(SidebarDrawer);
