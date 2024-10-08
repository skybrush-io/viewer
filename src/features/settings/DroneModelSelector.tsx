import React from 'react';
import { useTranslation } from 'react-i18next';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { useAppDispatch, useAppSelector } from '~/hooks/store';
import { getDroneModel } from './selectors';
import { setDroneModel } from './actions';
import { isValidDroneModelType } from './types';

/**
 * Component for selecting the playback speed.
 */
const DroneModelSelector = () => {
  const dispatch = useAppDispatch();
  const scenery = useAppSelector(getDroneModel);
  const { t } = useTranslation();
  return (
    <FormControl fullWidth variant='filled'>
      <InputLabel id='sidebar-drone-model-label'>
        {t('settings.droneModel.label')}
      </InputLabel>
      <Select
        labelId='sidebar-drone-model-label'
        id='sidebar-drone-model'
        value={scenery}
        onChange={(event) => {
          const type = event.target.value;
          if (isValidDroneModelType(type)) {
            dispatch(setDroneModel(type));
          }
        }}
      >
        <MenuItem value='sphere'>{t('settings.droneModel.sphere')}</MenuItem>
        <MenuItem value='quad'>{t('settings.droneModel.quad')}</MenuItem>
        <MenuItem value='flapper'>{t('settings.droneModel.flapper')}</MenuItem>
      </Select>
    </FormControl>
  );
};

export default DroneModelSelector;
