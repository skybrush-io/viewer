import { useTranslation } from 'react-i18next';

import Search from '@mui/icons-material/Search';
import Settings from '@mui/icons-material/Settings';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import Tooltip from '@skybrush/mui-components/lib/Tooltip';

import type { CSSProperties } from '@mui/material';
import { getActiveSidebarTab } from '~/features/sidebar/selectors';
import { setActiveSidebarTab } from '~/features/sidebar/slice';
import { SidebarTab } from '~/features/sidebar/types';
import { useAppDispatch, useAppSelector } from '~/hooks/store';

/**
 * For some reason, there is a yellow focus ring around the icons when
 * clicked. This is a workaround to remove it.
 */
const NO_FOCUS: CSSProperties = { outline: 'none !important' };

const PlayerSidebarTabs = () => {
  const { t } = useTranslation();
  const value = useAppSelector(getActiveSidebarTab);
  const dispatch = useAppDispatch();

  return (
    <Tabs
      indicatorColor='primary'
      variant='fullWidth'
      value={value}
      onChange={(_event, newValue: SidebarTab) => {
        dispatch(setActiveSidebarTab(newValue));
      }}
    >
      <Tab
        icon={
          <Tooltip content={t('buttons.inspector')}>
            <Search sx={NO_FOCUS} />
          </Tooltip>
        }
        value={SidebarTab.INSPECTOR}
      />
      <Tab
        icon={
          <Tooltip content={t('buttons.settings')}>
            <Settings sx={NO_FOCUS} />
          </Tooltip>
        }
        value={SidebarTab.SETTINGS}
      />
    </Tabs>
  );
};

export default PlayerSidebarTabs;
