import React from 'react';

import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import Refresh from '@mui/icons-material/Refresh';
import Tooltip from '@skybrush/mui-components/lib/Tooltip';
import { useTranslation } from 'react-i18next';

const ReloadButton = (props: IconButtonProps) => {
  const { t } = useTranslation();
  return (
    <Tooltip content={t('buttons.reloadShowFile')}>
      <IconButton disableRipple {...props} size='large'>
        <Refresh />
      </IconButton>
    </Tooltip>
  );
};

export default ReloadButton;
