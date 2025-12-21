import { useTranslation } from 'react-i18next';

import { Keyboard } from '@mui/icons-material';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import { Tooltip } from '@skybrush/mui-components';

import { useAppDispatch } from '~/hooks/store';
import { showHotkeyDialog } from './slice';

type ToggleValidationModeButtonProps = IconButtonProps & {
  readonly onToggleValidationMode?: () => void;
  readonly trajectoriesValid?: boolean;
  readonly validationInProgress?: boolean;
};

const ShowHotkeysDialogButton = ({
  onToggleValidationMode,
  trajectoriesValid,
  validationInProgress,
  ...rest
}: ToggleValidationModeButtonProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  return (
    <Tooltip content={t('buttons.showHotkeysDialog')}>
      <IconButton
        disableRipple
        onClick={() => {
          dispatch(showHotkeyDialog());
        }}
        {...rest}
        size='large'
      >
        <Keyboard />
      </IconButton>
    </Tooltip>
  );
};

export default ShowHotkeysDialogButton;
