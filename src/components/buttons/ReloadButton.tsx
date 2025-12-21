import Refresh from '@mui/icons-material/Refresh';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import { Tooltip } from '@skybrush/mui-components';
import { useTranslation } from 'react-i18next';

const ReloadButton = (props: IconButtonProps) => {
  const { t } = useTranslation();
  return (
    <Tooltip content={t('buttons.reloadShow')}>
      <IconButton disableRipple {...props} size='large'>
        <Refresh />
      </IconButton>
    </Tooltip>
  );
};

export default ReloadButton;
