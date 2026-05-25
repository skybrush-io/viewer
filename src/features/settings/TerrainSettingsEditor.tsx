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
    dispatch(updateAppSettings('threeD', { terrain: { ...terrain, mode } }));
  };

  const setField = (field: string, value: string | number) => {
    dispatch(
      updateAppSettings('threeD', { terrain: { ...terrain, [field]: value } })
    );
  };

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
          <MenuItem value='enabled'>{t('settings.terrain.enabled')}</MenuItem>
        </Select>
      </FormControl>

      {terrain.mode === 'enabled' && (
        <>
          <Box pt={2}>
            <TextField
              fullWidth
              variant='filled'
              label={t('settings.terrain.tilesetUrl')}
              value={terrain.tilesetUrl}
              onChange={(event) => setField('tilesetUrl', event.target.value)}
            />
          </Box>
          <Box pt={2}>
            <TextField
              fullWidth
              variant='filled'
              label={t('settings.terrain.token')}
              value={terrain.token}
              onChange={(event) => setField('token', event.target.value)}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default TerrainSettingsEditor;
