import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import MenuOpen from '@mui/icons-material/MenuOpen';
import Tooltip from '@skybrush/mui-components/lib/Tooltip';

import { toggleSidebar } from '~/features/sidebar/slice';

/**
 * Toggle button for the sidebar.
 */
const ToggleSidebarButton = (props: IconButtonProps) => {
  const dispatch = useDispatch();
  const handleClick = () => dispatch(toggleSidebar());
  const { t } = useTranslation();
  return (
    <Tooltip content={t('buttons.toggleSidebar')}>
      <IconButton size='large' {...props} onClick={handleClick}>
        <MenuOpen />
      </IconButton>
    </Tooltip>
  );
};

export default ToggleSidebarButton;
