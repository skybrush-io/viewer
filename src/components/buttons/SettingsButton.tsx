import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import Settings from '@mui/icons-material/Settings';
import Tooltip from '@skybrush/mui-components/lib/Tooltip';

import { toggleSidebar } from '~/features/sidebar/slice';

/**
 * Toggle button for the settings sidebar.
 */
const SettingsButton = (props: IconButtonProps) => {
  const dispatch = useDispatch();
  const handleClick = () => dispatch(toggleSidebar());
  const { t } = useTranslation();
  return (
    <Tooltip content={t('buttons.settings')}>
      <IconButton size='large' {...props} onClick={handleClick}>
        <Settings />
      </IconButton>
    </Tooltip>
  );
};

export default SettingsButton;
