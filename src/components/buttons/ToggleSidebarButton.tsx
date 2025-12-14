import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import MenuOpen from '@mui/icons-material/MenuOpen';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import Tooltip from '@skybrush/mui-components/lib/Tooltip';

import { isSidebarOpen, toggleSidebar } from '~/features/sidebar/slice';
import { useAppSelector } from '~/hooks/store';

/**
 * Toggle button for the sidebar.
 */
const ToggleSidebarButton = (props: IconButtonProps) => {
  const dispatch = useDispatch();
  const open = useAppSelector(isSidebarOpen);
  const handleClick = () => dispatch(toggleSidebar());
  const { t } = useTranslation();
  return (
    <Tooltip content={t('buttons.toggleSidebar')}>
      <IconButton
        disableRipple
        size='large'
        {...props}
        onClick={handleClick}
        sx={{
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        <MenuOpen />
      </IconButton>
    </Tooltip>
  );
};

export default ToggleSidebarButton;
