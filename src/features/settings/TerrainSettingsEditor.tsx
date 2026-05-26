import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import { useAppDispatch, useAppSelector } from '~/hooks/store';

import { updateAppSettings } from './slice';
import { getTerrainSettings } from './selectors';
import type { TerrainMode } from './types';

const TerrainSettingsEditor = () => {
  const dispatch = useAppDispatch();
  const terrain = useAppSelector(getTerrainSettings);
  const { t } = useTranslation();

  const setMode = (mode: TerrainMode) => {
    const next = { ...terrain, mode };
    // Save current token to the old provider slot, load the other provider's
    // stored token when switching between active providers.
    if (terrain.mode === 'googleMaps' && mode !== 'googleMaps') {
      next.googleMapsToken = terrain.token;
      next.token = mode === 'cesiumIon' ? terrain.cesiumIonToken : '';
    } else if (terrain.mode === 'cesiumIon' && mode !== 'cesiumIon') {
      next.cesiumIonToken = terrain.token;
      next.token = mode === 'googleMaps' ? terrain.googleMapsToken : '';
    } else if (terrain.mode === 'disabled' && mode !== 'disabled') {
      next.token = mode === 'googleMaps' ? terrain.googleMapsToken : terrain.cesiumIonToken;
    }
    dispatch(updateAppSettings('threeD', { terrain: next }));
  };

  const setField = (field: string, value: string | number) => {
    dispatch(
      updateAppSettings('threeD', { terrain: { ...terrain, [field]: value } })
    );
  };

  const showToken = terrain.mode !== 'disabled';

  return (
    <>
      <FormControl fullWidth variant='filled'>
        <InputLabel id='sidebar-terrain-label'>
          {t('settings.terrain.label')}
        </InputLabel>
        <Select
          labelId='sidebar-terrain-label'
          id='sidebar-terrain'
          value={terrain.mode}
          onChange={(event) => setMode(event.target.value as TerrainMode)}
        >
          <MenuItem value='disabled'>{t('settings.terrain.disabled')}</MenuItem>
          <MenuItem value='googleMaps'>{t('settings.terrain.googleMaps')}</MenuItem>
          <MenuItem value='cesiumIon'>{t('settings.terrain.cesiumIon')}</MenuItem>
        </Select>
      </FormControl>

      {showToken && (
        <Box pt={2}>
          <TextField
            key={terrain.mode}
            fullWidth
            variant='filled'
            label={t('settings.terrain.token')}
            value={terrain.token}
            onChange={(event) => setField('token', event.target.value)}
          />
        </Box>
      )}
    </>
  );
};

export default TerrainSettingsEditor;
