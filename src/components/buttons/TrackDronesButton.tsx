import React from 'react';
import { useTranslation } from 'react-i18next';

import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import CenterFocusStrong from '@mui/icons-material/CenterFocusStrong';
import Tooltip from '@skybrush/mui-components/lib/Tooltip';

const TrackDronesButton = (props: IconButtonProps) => {
  const { t } = useTranslation();
  return (
    <Tooltip content={t('buttons.trackDrones')}>
      <IconButton disableRipple {...props} size='large'>
        <CenterFocusStrong />
      </IconButton>
    </Tooltip>
  );
};

export default TrackDronesButton;
