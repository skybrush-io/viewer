import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import Assignment from '@material-ui/icons/Assignment';
import AssignmentLate from '@material-ui/icons/AssignmentLate';
import AssignmentTurnedIn from '@material-ui/icons/AssignmentTurnedIn';

import { toggleMode } from '~/features/ui/actions';

import { hasValidationMessages } from './selectors';

const ToggleValidationModeButton = ({
  onToggleValidationMode,
  trajectoriesValid,
  validationInProgress,
  ...rest
}) => (
  <IconButton disableRipple onClick={onToggleValidationMode} {...rest}>
    {validationInProgress ? (
      <Assignment />
    ) : trajectoriesValid ? (
      <AssignmentTurnedIn />
    ) : (
      <AssignmentLate />
    )}
  </IconButton>
);

ToggleValidationModeButton.propTypes = {
  onToggleValidationMode: PropTypes.func,
  trajectoriesValid: PropTypes.bool,
  validationInProgress: PropTypes.bool,
};

export default connect(
  // mapStateToProps
  (state) => ({
    trajectoriesValid: !hasValidationMessages(state),
  }),
  // mapDispatchToProps
  {
    onToggleValidationMode: () => toggleMode('validation'),
  }
)(ToggleValidationModeButton);
