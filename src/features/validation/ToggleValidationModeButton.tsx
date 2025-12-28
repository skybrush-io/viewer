import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import Assignment from '@mui/icons-material/Assignment';
import AssignmentLate from '@mui/icons-material/AssignmentLate';
import AssignmentTurnedIn from '@mui/icons-material/AssignmentTurnedIn';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import { Tooltip } from '@skybrush/mui-components';

import { toggleMode } from '~/features/ui/actions';
import { UIMode } from '~/features/ui/modes';
import type { RootState } from '~/store';
 
type ToggleValidationModeButtonProps = IconButtonProps & {
  readonly onToggleValidationMode?: () => void;
  readonly trajectoriesValid?: boolean;
  readonly validationInProgress?: boolean;
};

const ToggleValidationModeButton = ({
  onToggleValidationMode,
  trajectoriesValid,
  validationInProgress,
  ...rest
}: ToggleValidationModeButtonProps) => {
  const { t } = useTranslation();
  return (
    <Tooltip content={t('buttons.validateTrajectories')}>
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
};

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    trajectoriesValid: true,
  }),
  // mapDispatchToProps
  {
    onToggleValidationMode: () => toggleMode(UIMode.VALIDATION),
  }
)(ToggleValidationModeButton);
