import { useTranslation } from 'react-i18next';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { useAppDispatch, useAppSelector } from '~/hooks/store';
import type { SceneryType } from '~/views/player/Scenery';

import { setScenery } from './actions';
import { getScenery } from './selectors';

/**
 * Component for selecting the playback speed.
 */
const ScenerySelector = () => {
  const dispatch = useAppDispatch();
  const scenery = useAppSelector(getScenery);
  const { t } = useTranslation();
  return (
    <FormControl fullWidth variant='filled'>
      <InputLabel id='sidebar-scenery-label'>
        {t('settings.scenery.label')}
      </InputLabel>
      <Select
        labelId='sidebar-scenery-label'
        id='sidebar-scenery'
        value={scenery}
        onChange={(event) => {
          dispatch(setScenery(event.target.value as any as SceneryType));
        }}
      >
        <MenuItem value='disabled'>{t('settings.scenery.disabled')}</MenuItem>
        <MenuItem value='auto'>{t('settings.scenery.auto')}</MenuItem>
        <MenuItem value='day'>{t('settings.scenery.day')}</MenuItem>
        <MenuItem value='night'>{t('settings.scenery.night')}</MenuItem>
        <MenuItem value='indoor'>{t('settings.scenery.indoor')}</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ScenerySelector;
