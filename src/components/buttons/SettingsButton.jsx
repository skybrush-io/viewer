import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import IconButton from '@mui/material/IconButton';
import Settings from '@mui/icons-material/Settings';
import Tooltip from '@skybrush/mui-components/lib/Tooltip';

import { toggleSidebar } from '~/features/sidebar/slice';

/**
 * Toggle button for the settings sidebar.
 */
const SettingsButton = ({ onClick }) => (
  <Tooltip content='Settings'>
    <IconButton size='large' onClick={onClick}>
      <Settings />
    </IconButton>
  </Tooltip>
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
