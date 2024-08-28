import React from 'react';
import { useTranslation } from 'react-i18next';

import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import ZoomOut from '@mui/icons-material/ZoomOut';
import Tooltip from '@skybrush/mui-components/lib/Tooltip';

const ZoomOutButton = (props: IconButtonProps) => {
  const { t } = useTranslation();
  return (
    <Tooltip content={t('buttons.resetZoom')}>
      <IconButton disableRipple {...props} size='large'>
        <ZoomOut />
      </IconButton>
    </Tooltip>
  );
};

export default ZoomOutButton;
