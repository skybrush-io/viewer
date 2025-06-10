import React from 'react';
import { useTranslation } from 'react-i18next';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Search from '@mui/icons-material/Search';
import Settings from '@mui/icons-material/Settings';

import Tooltip from '@skybrush/mui-components/lib/Tooltip';

import { getActiveSidebarTab } from '~/features/sidebar/selectors';
import { SidebarTab } from '~/features/sidebar/types';
import { setActiveSidebarTab } from '~/features/sidebar/slice';
import { useAppDispatch, useAppSelector } from '~/hooks/store';

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
            <Search />
          </Tooltip>
        }
        value={SidebarTab.INSPECTOR}
      />
      <Tab
        icon={
          <Tooltip content={t('buttons.settings')}>
            <Settings />
          </Tooltip>
        }
        value={SidebarTab.SETTINGS}
      />
    </Tabs>
  );
};

export default PlayerSidebarTabs;
