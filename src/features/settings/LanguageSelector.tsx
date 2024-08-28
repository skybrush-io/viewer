import config from 'config';
import React from 'react';
import { useTranslation } from 'react-i18next';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { useAppDispatch, useAppSelector } from '~/hooks/store';
import { enabledLanguages } from '~/i18n';

import { setLanguage } from './actions';
import { getLanguage } from './selectors';

/**
 * Component for selecting the playback speed.
 */
const LanguageSelector = () => {
  const dispatch = useAppDispatch();
  const language = useAppSelector(getLanguage);
  const { t } = useTranslation();

  return (
    <FormControl fullWidth variant='filled'>
      <InputLabel id='sidebar-language-label'>
        {t('settings.language')}
      </InputLabel>
      <Select
        labelId='sidebar-language-label'
        id='sidebar-language'
        value={language}
        onChange={(event) => {
          dispatch(setLanguage(event.target.value));
        }}
      >
        {enabledLanguages.map(({ code, label }) => (
          <MenuItem key={code} value={code}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
