import React from 'react';
import { connect } from 'react-redux';

import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import Assignment from '@mui/icons-material/Assignment';
import AssignmentLate from '@mui/icons-material/AssignmentLate';
import AssignmentTurnedIn from '@mui/icons-material/AssignmentTurnedIn';
import Tooltip from '@skybrush/mui-components/lib/Tooltip';

import { toggleMode } from '~/features/ui/actions';
import { UIMode } from '~/features/ui/modes';
import type { RootState } from '~/store';

import { hasValidationMessages } from './selectors';

interface ToggleValidationModeButtonProps extends IconButtonProps {
  readonly onToggleValidationMode?: () => void;
  readonly trajectoriesValid?: boolean;
  readonly validationInProgress?: boolean;
}

const ToggleValidationModeButton = ({
  onToggleValidationMode,
  trajectoriesValid,
  validationInProgress,
  ...rest
}: ToggleValidationModeButtonProps) => (
  <Tooltip content='Validate trajectories'>
    <IconButton
      disableRipple
      onClick={onToggleValidationMode}
      {...rest}
      size='large'
    >
      {validationInProgress ? (
        <Assignment />
      ) : trajectoriesValid ? (
        <AssignmentTurnedIn />
      ) : (
        <AssignmentLate />
      )}
    </IconButton>
  </Tooltip>
);

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    trajectoriesValid: !hasValidationMessages(state),
  }),
  // mapDispatchToProps
  {
    onToggleValidationMode: () => toggleMode(UIMode.VALIDATION),
  }
)(ToggleValidationModeButton);
