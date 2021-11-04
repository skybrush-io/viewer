import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import IconButton from '@mui/material/IconButton';
import Settings from '@mui/icons-material/Settings';

import { toggleSidebar } from '~/features/sidebar/slice';

/**
 * Toggle button for the settings sidebar.
 */
const SettingsButton = ({ onClick }) => (
  <IconButton size='large' onClick={onClick}>
    <Settings />
  </IconButton>
);

SettingsButton.propTypes = {
  onClick: PropTypes.func,
};

export default connect(
  // mapStateToProps
  null,
  // mapDispatchToProps
  {
    onClick: toggleSidebar,
  }
)(SettingsButton);
