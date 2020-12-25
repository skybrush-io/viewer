import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import Settings from '@material-ui/icons/Settings';

import { toggleSidebar } from '~/features/sidebar/slice';

/**
 * Toggle button for the settings sidebar.
 */
const SettingsButton = ({ onClick }) => (
  <IconButton onClick={onClick}>
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
