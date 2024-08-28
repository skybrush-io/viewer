import React from 'react';

import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import Folder from '@mui/icons-material/Folder';
import Tooltip from '@skybrush/mui-components/lib/Tooltip';
import { useTranslation } from 'react-i18next';

const OpenButton = (props: IconButtonProps) => {
  const { t } = useTranslation();
  return (
    <Tooltip content={t('buttons.openShowFile')}>
      <IconButton disableRipple {...props} size='large'>
        <Folder />
      </IconButton>
    </Tooltip>
  );
};

export default OpenButton;
